'use client';

import HeaderHomeLayout from '@/views/layouts/home/HeaderHomeLayout';
import HomeBanner from '@/views/layouts/home/components/HomeBanner';

const HomPage = () => {
  return (
    <div className="h-[2000px] bg-white">
      <HeaderHomeLayout />
      <HomeBanner />
    </div>
  );
};

export default HomPage;
