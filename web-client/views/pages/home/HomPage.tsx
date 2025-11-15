"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import HeaderHomeLayout from "@/views/layouts/home/HeaderHomeLayout";
import HomeBanner from "@/views/layouts/home/components/HomeBanner";
import Live2DCanvas from "@/views/layouts/home/components/Live2DCanvas";

const HomPage = () => {
  return (
    <div className="h-[2000px] bg-white">
      <HeaderHomeLayout />
      <HomeBanner />
      <Live2DCanvas />
    </div>
  );
};

export default HomPage;
