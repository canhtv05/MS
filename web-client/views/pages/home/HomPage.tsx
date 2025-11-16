'use client';

import HeaderHomeLayout from '@/views/layouts/home/HeaderHomeLayout';
import HomeBanner from '@/views/layouts/home/components/HomeBanner';
import HomeFeature from '@/views/layouts/home/components/HomeFeature';
import HomePlatform from '@/views/layouts/home/components/HomePlatform';
import HomeTestimonials from '@/views/layouts/home/components/HomeTestimonials';

const HomPage = () => {
  return (
    <div className="bg-white">
      <HeaderHomeLayout />
      <HomeBanner />
      <HomeFeature />
      <HomePlatform />
      <HomeTestimonials />
    </div>
  );
};

export default HomPage;
