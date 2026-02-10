'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { IInterestDTO } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { CheckRead } from '@solar-icons/react-perf/Outline';
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
} from '@/components/animate-ui/primitives/base/popover';
import { hexToRgba } from '@/utils/common';
import { Input } from '@/components/ui/input';
import { Magnifer } from '@solar-icons/react-perf/Outline';
import { useInterestInfiniteQuery } from '@/services/queries/profile';
import useDebounce from '@/hooks/use-debounce';
import { Loader2Icon } from '@/components/animate-ui/icons';
import { CreateInterestDialog } from './CreateInterestDialog';
import Loading from '@/components/Loading';
import Show from '@/components/Show';
import { AddCircle } from '@solar-icons/react-perf/category/style/Outline';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { useProfileMutation } from '@/services/mutations/profile';

interface IEditInterestsPopoverProps {
  selectedInterests: IInterestDTO[];
  onSave: (interestIds: string[]) => void;
  onCancel?: () => void;
  trigger: React.ReactNode;
}

export const EditInterestsPopover = ({
  selectedInterests,
  onSave,
  onCancel,
  trigger,
}: IEditInterestsPopoverProps) => {
  const { t } = useTranslation('profile');
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(selectedInterests.map(i => i.id)),
  );
  const [customInterests, setCustomInterests] = useState<
    Omit<IInterestDTO, 'createdBy' | 'createdDate' | 'modifiedBy' | 'modifiedDate'>[]
  >([]);
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const previousSearchTextRef = useRef<string>('');
  const { createInterestMutation } = useProfileMutation();
  const {
    data: interestsData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInterestInfiniteQuery({ searchText: debouncedSearchText, size: 50 }, isOpen);

  // Track if we're fetching due to search text change
  const isSearching = useMemo(() => {
    const isSearchTextChanged = previousSearchTextRef.current !== debouncedSearchText;
    if (isSearchTextChanged) {
      previousSearchTextRef.current = debouncedSearchText;
    }
    return isFetching && isSearchTextChanged && debouncedSearchText !== '';
  }, [isFetching, debouncedSearchText]);

  const allInterests = useMemo(() => {
    if (!interestsData?.pages) return customInterests;
    const serverInterests = interestsData.pages.flatMap(page => page.data.data);
    const seenIds = new Set<string>();
    const uniqueServerInterests = serverInterests.filter(i => {
      if (seenIds.has(i.id)) {
        return false;
      }
      seenIds.add(i.id);
      return true;
    });
    const uniqueCustomInterests = customInterests.filter(ci => !seenIds.has(ci.id));
    return [...uniqueServerInterests, ...uniqueCustomInterests];
  }, [interestsData, customInterests]);

  // Reset selected when popover opens
  useEffect(() => {
    if (isOpen) {
      const newSelectedIds = new Set(selectedInterests.map(i => i.id));
      setSelectedIds(newSelectedIds);
      setSearchText('');
      previousSearchTextRef.current = '';
      setCustomInterests([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !isOpen) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver, isOpen]);

  const toggleInterest = (interestId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(interestId)) {
        newSet.delete(interestId);
      } else {
        newSet.add(interestId);
      }
      return newSet;
    });
  };

  const handleCreateCustomInterest = (title: string, color: string) => {
    const tempId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newInterest: Omit<
      IInterestDTO,
      'createdBy' | 'createdDate' | 'modifiedBy' | 'modifiedDate'
    > = {
      id: tempId,
      title,
      color,
      code: '',
    };

    setCustomInterests(prev => [...prev, newInterest]);
    setSelectedIds(prev => new Set([...prev, tempId]));
    createInterestMutation.mutate({ title, color });
  };

  const handleSave = () => {
    // Get all selected interest IDs (both server and custom)
    const allSelectedIds = Array.from(selectedIds);
    onSave(allSelectedIds);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedIds(new Set(selectedInterests.map(i => i.id)));
    setSearchText('');
    setIsOpen(false);
    onCancel?.();
  };

  const selectedCount = selectedIds.size;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {/* @ts-expect-error PopoverTrigger is not a valid component */}
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner sideOffset={8} align="start">
          <PopoverPopup
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -2, scale: 0.98 }}
            transition={{
              type: 'tween',
              duration: 0.15,
              ease: 'easeOut',
            }}
            style={{
              transformOrigin: 'top center',
              willChange: 'transform, opacity',
            }}
            className="overflow-hidden rounded-md border border-input bg-popover w-[85vw] max-w-md"
          >
            <div className="px-4 pt-3 pb-2 space-y-2">
              <div className="relative">
                <Input
                  icon={<Magnifer className="size-4 text-foreground/50" />}
                  value={searchText}
                  autoFocus={false}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder={t('profile:search_interests', 'Search interests...')}
                  className={cn('h-9 rounded-lg')}
                  id="search_interests"
                  endIcon={
                    isSearching ? <Loader2Icon className="animate-spin size-4 p-0.5" /> : undefined
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateDialogOpen(true)}
                className="w-full justify-center gap-2 shadow-none"
              >
                <AddCircle className="size-4" />
                <span>{t('profile:create_custom_interest', 'Create Custom Interest')}</span>
              </Button>
            </div>

            <div
              ref={parentRef}
              className="max-h-[250px] overflow-y-auto p-4"
              style={{ scrollbarGutter: 'stable' }}
            >
              <Show
                when={isFetching && allInterests.length === 0 && !debouncedSearchText}
                fallback={
                  <Show
                    when={allInterests.length > 0}
                    fallback={
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">
                          {searchText
                            ? t('profile:no_interests_found', 'No interests found')
                            : t('profile:no_interests_available', 'No interests available')}
                        </p>
                      </div>
                    }
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {allInterests.map((interest, index) => {
                        if (!interest) return null;

                        const isSelected = selectedIds.has(interest.id);
                        const isLastItem = index === allInterests.length - 1;
                        return (
                          <button
                            key={interest.code}
                            ref={el => {
                              if (isLastItem && el) {
                                loadMoreRef.current = el;
                              }
                            }}
                            onClick={() => toggleInterest(interest.id)}
                            className={cn(
                              'group relative flex items-center gap-1.5 rounded-full px-2.5 py-1',
                              'border transition-colors duration-200 cursor-pointer',
                              'hover:opacity-90',
                              isSelected ? 'shadow-sm' : 'border-border/50 bg-background',
                            )}
                            style={
                              isSelected
                                ? {
                                    borderColor: hexToRgba(interest.color, 0.4),
                                    backgroundColor: hexToRgba(interest.color, 0.1),
                                  }
                                : undefined
                            }
                            onMouseEnter={e => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = hexToRgba(interest.color, 0.3);
                                e.currentTarget.style.backgroundColor = hexToRgba(
                                  interest.color,
                                  0.05,
                                );
                              } else {
                                e.currentTarget.style.borderColor = hexToRgba(interest.color, 0.5);
                                e.currentTarget.style.backgroundColor = hexToRgba(
                                  interest.color,
                                  0.15,
                                );
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = '';
                                e.currentTarget.style.backgroundColor = '';
                              } else {
                                e.currentTarget.style.borderColor = hexToRgba(interest.color, 0.4);
                                e.currentTarget.style.backgroundColor = hexToRgba(
                                  interest.color,
                                  0.1,
                                );
                              }
                            }}
                          >
                            <div
                              className="size-2 rounded-full shrink-0 transition-colors duration-200"
                              style={{ backgroundColor: interest.color }}
                            />
                            <span
                              className={cn(
                                'text-xs font-medium leading-none transition-colors duration-200',
                                isSelected
                                  ? 'text-foreground'
                                  : 'text-foreground/70 group-hover:text-foreground',
                              )}
                              style={isSelected ? { color: interest.color } : undefined}
                            >
                              {interest.title}
                            </span>
                            {isSelected && (
                              <div
                                className={cn(
                                  'ml-0.5 flex items-center justify-center shrink-0',
                                  'size-3 rounded-full transition-all duration-200',
                                  'bg-primary text-white',
                                )}
                                style={{
                                  backgroundColor: interest.color,
                                }}
                              >
                                <CheckRead className="size-2" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                      <Show when={isFetchingNextPage}>
                        <div className="w-full flex justify-center py-4">
                          <Loading size="sm" />
                        </div>
                      </Show>
                    </div>
                  </Show>
                }
              >
                <div className="flex items-center justify-center py-12">
                  <Loading size="md" />
                </div>
              </Show>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
              <div className="text-sm text-muted-foreground">
                {selectedCount > 0 ? (
                  <span className="font-medium">
                    {selectedCount}{' '}
                    {selectedCount === 1
                      ? t('profile:interest_selected', 'interest selected')
                      : t('profile:interests_selected', 'interests selected')}
                  </span>
                ) : (
                  <span className="text-foreground/60">
                    {t('profile:select_interests', 'Select your interests')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-sm font-medium',
                    'transition-colors duration-200',
                    'text-foreground/70 hover:text-foreground',
                    'hover:bg-muted/80 cursor-pointer',
                  )}
                  title={t('common:button.cancel')}
                >
                  {t('common:button.cancel', 'Cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-sm font-semibold',
                    'transition-all duration-200',
                    'bg-primary hover:bg-primary/90 text-white',
                    'shadow-sm hover:shadow-md',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'cursor-pointer',
                  )}
                  title={t('common:button.save')}
                >
                  {t('common:button.save', 'Save')}
                </button>
              </div>
            </div>
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>

      <CreateInterestDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleCreateCustomInterest}
      />
    </Popover>
  );
};
