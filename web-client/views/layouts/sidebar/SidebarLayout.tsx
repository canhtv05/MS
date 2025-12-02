'use client';

import FriendRequest from '@/components/FriendRequest';

const SidebarLayout = () => {
  return (
    <div className="w-72">
      <div className="h-full flex justify-start items-start flex-col">
        <div className="flex justify-between items-center">
          <h4 className="text-sm uppercase font-bold text-foreground/50">Request</h4>
        </div>
        <div className="flex gap-5 flex-col mt-3">
          <FriendRequest />
          <FriendRequest />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
