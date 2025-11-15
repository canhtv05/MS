'use client';

import HeaderHomeLayout from '@/views/layouts/home/HeaderHomeLayout';
import HomeBanner from '@/views/layouts/home/components/HomeBanner';
import HomeFeature from '@/views/layouts/home/components/HomeFeature';

const HomPage = () => {
  return (
    <div className="h-[2000px] bg-white">
      <HeaderHomeLayout />
      <HomeBanner />
      <HomeFeature />
    </div>
  );
};

export default HomPage;
