'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Bookmark,
  Library,
  ClipboardText,
  UsersGroupTwoRounded,
} from '@solar-icons/react-perf/BoldDuotone';
import useViewport from '@/hooks/use-view-port';
import { Viewport } from '@/enums/common';
import { AltArrowDown } from '@solar-icons/react-perf/Outline';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { cn } from '@/lib/utils';

interface ITabs {
  id: string;
  labelKey: string;
  icon: ReactNode;
}

const tabs: ITabs[] = [
  { id: 'posts', labelKey: 'posts', icon: <Bookmark className="text-current size-[16px]" /> },
  {
    id: 'introduce',
    labelKey: 'introduce',
    icon: <ClipboardText className="text-current size-[16px]" />,
  },
  {
    id: 'friends',
    labelKey: 'friends',
    icon: <UsersGroupTwoRounded className="text-current size-[16px]" />,
  },
  { id: 'pictures', labelKey: 'pictures', icon: <Library className="text-current size-[16px]" /> },
];

// Fake data for posts
const fakePosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    likes: 234,
    comments: 12,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
    likes: 567,
    comments: 45,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop',
    likes: 123,
    comments: 8,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop',
    likes: 891,
    comments: 67,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop',
    likes: 345,
    comments: 23,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=400&fit=crop',
    likes: 678,
    comments: 34,
  },
];

const fakeLiked = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop',
    likes: 1234,
    comments: 89,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    likes: 2345,
    comments: 156,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop',
    likes: 987,
    comments: 45,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop',
    likes: 543,
    comments: 32,
  },
];

interface PostCardProps {
  post: {
    id: number;
    image: string;
    likes: number;
    comments: number;
  };
}

const PostCard = ({ post }: PostCardProps) => (
  <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg">
    <Image
      src={post.image}
      alt={`Post ${post.id}`}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      sizes="(max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
    />
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
      <div className="flex items-center gap-1 text-white font-semibold">
        <Heart size={18} className="fill-white" />
        <span>{post.likes}</span>
      </div>
      <div className="flex items-center gap-1 text-white font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="white"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{post.comments}</span>
      </div>
    </div>
  </div>
);

const ProfilePageTabs = () => {
  const { t } = useTranslation('profile');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useViewport();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const handleSetMounted = () => {
      setMounted(true);
    };
    handleSetMounted();
  }, []);

  const tabParam = searchParams.get('tab');
  const activeTab =
    tabs.findIndex(tab => tab.id === tabParam) !== -1
      ? tabs.findIndex(tab => tab.id === tabParam)
      : 0;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleTabClick = (index: number) => {
    const tabId = tabs[index].id;
    const newUrl = `${pathname}?tab=${tabId}`;
    router.push(newUrl, { scroll: false });
  };

  const activeTabId = tabs[activeTab].id;

  const maxVisible = !mounted
    ? tabs.length
    : width < Viewport.MD
      ? 2
      : width < Viewport.LG
        ? 3
        : tabs.length;

  const visibleTabs = tabs.slice(0, maxVisible);
  const hiddenTabs = tabs.slice(maxVisible);
  const showDropdown = hiddenTabs.length > 0;
  const renderItemsCount = visibleTabs.length + (showDropdown ? 1 : 0);

  const isHiddenActive = hiddenTabs.some(tab => tab.id === activeTabId);
  const activeRenderIndex = isHiddenActive ? visibleTabs.length : activeTab;

  const indicatorIndex = hoverIndex !== null ? hoverIndex : activeRenderIndex;

  const getCurrentTabContent = () => {
    const currentTab = tabs[activeTab];
    if (!currentTab) return fakePosts;
    switch (currentTab.id) {
      case 'posts':
        return fakePosts;
      case 'liked':
        return fakeLiked;
      case 'saved':
        return [];
      case 'pictures':
        return fakePosts; // Mock content
      case 'friends':
        return []; // Mock
      case 'introduce':
        return []; // Mock
      default:
        return fakePosts;
    }
  };

  const getEmptyMessage = () => {
    const currentTab = tabs[activeTab];
    if (!currentTab) return t('no_posts');
    switch (currentTab.id) {
      default:
        return t('no_posts');
    }
  };

  const content = getCurrentTabContent();

  const handleHiddenTabSelect = (tabId: string) => {
    const newUrl = `${pathname}?tab=${tabId}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="relative mt-2 w-full">
      <div className="relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border w-full" />
        <div className="relative">
          <div className="flex">
            {visibleTabs.map((tab, index) => (
              <button
                key={tab.id}
                className={`flex-1 py-3 text-sm flex gap-1 group items-center justify-center font-medium transition-colors duration-300 cursor-pointer
                  ${
                    activeTab === index
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                onClick={() => handleTabClick(index)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="flex gap-2 items-center justify-center">
                  {tab.icon}
                  <span className="truncate">{t(tab.labelKey)}</span>
                </div>
              </button>
            ))}

            {showDropdown && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex-1 py-3 text-sm flex gap-1 group items-center justify-center font-medium transition-colors duration-300 cursor-pointer outline-none
                      ${
                        isHiddenActive
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    onMouseEnter={() => setHoverIndex(visibleTabs.length)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="flex gap-1 items-center justify-center">
                      <span className="truncate">{t('more') || 'More'}</span>
                      <AltArrowDown size={14} className="mt-[2px]" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="group">
                  <DropdownMenuArrow />
                  {hiddenTabs.map(tab => (
                    <DropdownMenuItem
                      key={tab.id}
                      onClick={() => handleHiddenTabSelect(tab.id)}
                      className={cn(
                        'cursor-pointer outline-none focus:bg-muted/50 transition-colors duration-200',
                        'text-muted-foreground focus:text-primary!',
                        activeTabId === tab.id
                          ? 'text-primary group-hover:text-muted-foreground! group-hover:focus:text-primary!'
                          : '',
                      )}
                    >
                      <div className="flex gap-2 items-center">
                        {tab.icon}
                        {t(tab.labelKey)}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div
            className="absolute bottom-0 h-[2px] bg-primary transition-all duration-300 ease-out"
            style={{
              width: `${100 / renderItemsCount}%`,
              transform: `translateX(${indicatorIndex * 100}%)`,
            }}
          />
        </div>
      </div>

      {/* <div className="md:mt-6 mt-[10px] ">
        {content.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3">
            {content.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              {tabs[activeTab].icon}
            </div>
            <p className="text-lg font-medium">{getEmptyMessage()}</p>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default ProfilePageTabs;
