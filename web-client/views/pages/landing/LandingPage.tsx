'use client';

import LandingFooterLayout from '@/views/layouts/landing/LandingFooterLayout';
import LandingHeaderLayout from '@/views/layouts/landing/LandingHeaderLayout';
import LandingBanner from '@/views/layouts/landing/components/LandingBanner';
import LandingFeature from '@/views/layouts/landing/components/LandingFeature';
import LandingPlatform from '@/views/layouts/landing/components/LandingPlatform';
import LandingTestimonials from '@/views/layouts/landing/components/LandingTestimonials';

const LandingPage = () => {
  return (
    <div className="bg-white">
      <LandingHeaderLayout />
      <LandingBanner />
      <LandingFeature />
      <LandingPlatform />
      <LandingTestimonials />
      <LandingFooterLayout />
    </div>
  );
};

export default LandingPage;
