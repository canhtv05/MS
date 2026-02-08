'use client';

import { useState, useEffect, useMemo } from 'react';
import { IInterestDTO } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { CheckRead } from '@solar-icons/react-perf/Outline';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
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
import { XIcon } from '@/components/animate-ui/icons';

interface IEditInterestsPopoverProps {
  selectedInterests: IInterestDTO[];
  allInterests: IInterestDTO[];
  onSave: (interestIds: string[]) => void;
  onCancel?: () => void;
  trigger: React.ReactNode;
}

export const EditInterestsPopover = ({
  selectedInterests,
  allInterests,
  onSave,
  onCancel,
  trigger,
}: IEditInterestsPopoverProps) => {
  const { t } = useTranslation('profile');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(selectedInterests.map(i => i.id)),
  );
  const [searchText, setSearchText] = useState('');

  // Reset selected when popover opens
  useEffect(() => {
    if (isOpen) {
      const newSelectedIds = new Set(selectedInterests.map(i => i.id));
      setSelectedIds(newSelectedIds);
      setSearchText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Filter interests based on search
  const filteredInterests = useMemo(() => {
    if (!searchText.trim()) return allInterests;
    const lowerSearch = searchText.toLowerCase();
    return allInterests.filter(interest => interest.title.toLowerCase().includes(lowerSearch));
  }, [allInterests, searchText]);

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

  const handleSave = () => {
    onSave(Array.from(selectedIds));
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
      <PopoverTrigger className="cursor-pointer inline-flex items-center justify-center border-0 bg-transparent p-0">
        {trigger}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner>
          <PopoverPopup
            transition={{
              type: 'tween',
            }}
            className={cn(
              'w-[85vw] max-w-[450px] rounded-xl border border-border/50',
              'bg-popover shadow-xl',
              'p-0 overflow-hidden',
              'mt-1',
            )}
          >
            {/* Header - Social Media Style */}
            <div className="relative flex items-center justify-center px-4 py-3 border-b border-border/50">
              <h3 className="text-base font-semibold text-foreground">
                {t('introduce.edit_interests', 'Edit Interests')}
              </h3>
              <IconButton
                variant="ghost"
                onClick={handleCancel}
                className="absolute right-2 size-8 hover:bg-muted/80 rounded-full transition-colors duration-200 cursor-pointer"
                title={t('common:button.close')}
              >
                <XIcon className="size-5 text-foreground/70" />
              </IconButton>
            </div>

            {/* Search - Integrated in Header Area */}
            <div className="px-4 pt-3 pb-2">
              <div className="relative">
                <Input
                  icon={<Magnifer className="size-4 text-foreground/50" />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder={t('introduce.search_interests', 'Search interests...')}
                  className={cn(
                    'h-9 rounded-lg border-border/50',
                    'bg-muted/50 focus:bg-background',
                    'transition-colors duration-200',
                    'placeholder:text-foreground/40',
                  )}
                />
              </div>
            </div>

            {/* Interests Grid */}
            <div className="min-h-[200px] max-h-[400px] overflow-y-auto p-4">
              {filteredInterests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">
                    {searchText
                      ? t('introduce.no_interests_found', 'No interests found')
                      : t('introduce.no_interests_available', 'No interests available')}
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {filteredInterests.map(interest => {
                    const isSelected = selectedIds.has(interest.id);
                    return (
                      <button
                        key={interest.id}
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
                            e.currentTarget.style.backgroundColor = hexToRgba(interest.color, 0.05);
                          } else {
                            e.currentTarget.style.borderColor = hexToRgba(interest.color, 0.5);
                            e.currentTarget.style.backgroundColor = hexToRgba(interest.color, 0.15);
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = '';
                            e.currentTarget.style.backgroundColor = '';
                          } else {
                            e.currentTarget.style.borderColor = hexToRgba(interest.color, 0.4);
                            e.currentTarget.style.backgroundColor = hexToRgba(interest.color, 0.1);
                          }
                        }}
                      >
                        <div
                          className="size-2 rounded-full shrink-0 transition-colors duration-200"
                          style={{ backgroundColor: interest.color }}
                        />
                        <span
                          className={cn(
                            'text-xs font-medium leading-tight transition-colors duration-200',
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
                </div>
              )}
            </div>

            {/* Footer - Social Media Style */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
              <div className="text-sm text-muted-foreground">
                {selectedCount > 0 ? (
                  <span className="font-medium">
                    {selectedCount}{' '}
                    {selectedCount === 1
                      ? t('introduce.interest_selected', 'interest selected')
                      : t('introduce.interests_selected', 'interests selected')}
                  </span>
                ) : (
                  <span className="text-foreground/60">
                    {t('introduce.select_interests', 'Select your interests')}
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
    </Popover>
  );
};
