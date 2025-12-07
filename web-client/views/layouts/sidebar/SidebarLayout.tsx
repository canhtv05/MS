'use client';

import { SquarePenIcon } from '@/components/animate-ui/icons/square-pen';
import { Input } from '@/components/customs/input';
import { Search } from 'lucide-react';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { SlidersHorizontal } from '@/components/animate-ui/icons/sliders-horizontal';
import { useTranslation } from 'react-i18next';
import {
  Tabs,
  TabsHighlight as TabsHighlightPrimitive,
  TabsHighlightItem as TabsHighlightItemPrimitive,
  TabsList as TabsListPrimitive,
  TabsPanel,
  TabsPanels,
  TabsTab as TabsTabPrimitive,
} from '@/components/animate-ui/primitives/base/tabs';
import { useState } from 'react';
import UserCard from '@/components/UserCard';
import useViewport from '@/hooks/use-view-port';
import { Viewport } from '@/enums/common';

const SidebarLayout = () => {
  const { t } = useTranslation('layout');
  const [activeTab, setActiveTab] = useState('primary');
  const { width } = useViewport();

  if (!width) return null; // Wait for width to be available (client-side)

  return (
    <div className="hidden lg:block lg:w-72 shrink-0">
      <div className="h-full flex flex-col justify-start items-start gap-7 w-full">
        <div className="w-full">
          <div className="dark:bg-gray-800 shadow-[0_0_10px_0_rgba(0,0,0,0.07)] block lg:w-full w-auto bg-white rounded-lg">
            <div className="flex justify-between group items-center px-4 pt-4">
              <h3 className="text-sm font-black">Messages</h3>
              <SquarePenIcon size={18} className="group-hover:animate-icon" />
            </div>
            <div className="pt-4 px-4">
              <AnimateIcon animateOnHover>
                <Input
                  autoComplete="off"
                  showClear
                  inputSize="md"
                  id="search_messages"
                  placeholder={t('header.search_placeholder')}
                  className="dark:bg-gray-700 bg-gray-100 h-8 placeholder:font-medium rounded-lg border-transparent"
                  classNameIcon="dark:bg-gray-700 bg-gray-100 h-8"
                  icon={<Search className={'size-5 p-0.5 text-foreground/60 stroke-3'} />}
                  endIcon={<SlidersHorizontal className="size-5 p-0.5" />}
                />
              </AnimateIcon>
            </div>
            <div className="pt-3">
              <div className="flex max-h-[50vh] overflow-y-auto w-full max-w-sm flex-col gap-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 flex px-4 items-center justify-between gap-3 pb-2 pt-1">
                    <div className="relative flex-1">
                      <TabsHighlightPrimitive
                        mode="parent"
                        transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                        className="absolute w-full h-[2.5px]! bg-primary top-auto! bottom-0! rounded-full"
                      >
                        <TabsListPrimitive className="relative -z-10 gap-3 after:z-10 after:h-[2.5px] after:w-full after:absolute after:bottom-0 after:left-0 after:content-[''] after:bg-input after:rounded-full flex bg-transparent">
                          <TabsHighlightItemPrimitive value="primary">
                            <TabsTabPrimitive
                              value="primary"
                              className="relative transition-none py-2 px-0 z-10 flex justify-center text-sm font-medium text-muted-foreground transition-colors data-[active=true]:font-bold data-[active=true]:text-foreground bg-transparent cursor-pointer"
                            >
                              Primary
                            </TabsTabPrimitive>
                          </TabsHighlightItemPrimitive>
                          <TabsHighlightItemPrimitive value="general">
                            <TabsTabPrimitive
                              value="general"
                              className="relative transition-none py-2 px-0 z-10 flex justify-center text-sm font-medium text-muted-foreground transition-colors data-[active=true]:font-bold data-[active=true]:text-foreground bg-transparent cursor-pointer"
                            >
                              General
                            </TabsTabPrimitive>
                          </TabsHighlightItemPrimitive>
                        </TabsListPrimitive>
                      </TabsHighlightPrimitive>
                      <strong className="absolute text-xs text-primary font-bold top-3 right-0">
                        Requests(4)
                      </strong>
                    </div>
                  </div>
                  <TabsPanels className="py-2">
                    <TabsPanel value="primary" className="flex flex-col gap-1">
                      {Array.from({ length: 6 }, (_, index) => (
                        <div
                          key={index}
                          className="dark:hover:bg-gray-500/20 hover:bg-gray-300/20 transition-colors duration-300 cursor-pointer px-4 py-2"
                        >
                          <UserCard
                            name="John Doe"
                            avatar="https://picsum.photos/150/150"
                            isOnline={index % 2 === 0}
                          />
                        </div>
                      ))}
                    </TabsPanel>
                    <TabsPanel value="general" className="flex flex-col gap-1">
                      {Array.from({ length: 6 }, (_, index) => (
                        <div
                          key={index}
                          className="dark:hover:bg-gray-500/20 hover:bg-gray-300/20 transition-colors duration-300 cursor-pointer px-4 py-2"
                        >
                          <UserCard
                            name="John Doe"
                            avatar="https://picsum.photos/150/150"
                            isOnline={index % 2 === 0}
                          />
                        </div>
                      ))}
                    </TabsPanel>
                  </TabsPanels>
                </Tabs>
              </div>
              <div className="text-center text-sm font-bold pb-1 text-foreground/70">See all</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
