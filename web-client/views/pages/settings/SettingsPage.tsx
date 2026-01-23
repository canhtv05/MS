'use client';

import Wrapper from '@/components/customs/wrapper';

const SettingsPage = () => {
  return (
    <>
      <div className="fixed inset-0 h-(--header-height) bg-red-500 z-70">hellowirld</div>
      <div className="flex [&>div]:rounded-md [&>div]:h-full [&>div]:custom-bg-1 gap-(--sp-layout) h-full">
        <div className="flex-1 overflow-hidden">
          <Wrapper>ok</Wrapper>
        </div>
        <div className="flex-2 h-[3000px]">
          <Wrapper>ok</Wrapper>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
