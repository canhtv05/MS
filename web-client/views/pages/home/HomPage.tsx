"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import HeaderHomeLayout from "@/views/layouts/home/HeaderHomeLayout";
import Image from "next/image";

const HomPage = () => {
  return (
    <div className="h-[2000px] bg-linear-to-br from-green-50 via-violet-50 ">
      <HeaderHomeLayout />
      <main className="lg:pt-0 pt-20 -mt-10">
        <div className="relative w-full flex flex-col lg:flex-row justify-between items-center">
          <div className="w-full flex flex-col gap-6 lg:gap-8 lg:pl-30 pl-10 relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-linear-to-br from-green-400 to-green-200 shadow-xl opacity-70 lg:w-40 lg:h-40"></div>
            <div className="absolute -bottom-10 right-10 w-24 h-24 rounded-full bg-linear-to-tr from-green-300 to-green-100 shadow-lg opacity-60 lg:w-32 lg:h-32"></div>

            <h1 className="lg:text-[50px] md:text-[40px] text-[30px] font-roboto font-medium leading-none relative">
              A Smarter Way to Form Friendships
            </h1>

            <p className="md:text-lg text-sm text-foreground/60 max-w-xl">
              Connect with like-minded people, discover new friends, and build meaningful relationships effortlessly.
            </p>

            <div>
              <Button size="sm" className="rounded-full md:px-15 px-5 py-5 md:py-7">
                Get started
              </Button>
            </div>
          </div>

          <div className="relative w-full max-w-full aspect-square overflow-hidden">
            <svg
              className="absolute -top-10 -left-10 w-[120%] h-[120%] -z-10"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                fill="oklch(92.5% 0.084 155.995)"
                d="M53.1,-67.9C68.2,-62.2,79.2,-45.8,82.4,-28.5C85.6,-11.3,81,6.8,72.1,20.2C63.3,33.7,50.3,42.5,37.6,52.3C24.9,62.2,12.4,72.9,-1.5,75C-15.5,77.1,-31,70.5,-46.1,61.5C-61.2,52.4,-76,41,-82.5,25.7C-89,10.4,-87.2,-8.7,-81.5,-26.6C-75.9,-44.6,-66.4,-61.5,-52.2,-67.4C-37.9,-73.4,-19,-68.4,0,-68.4C19,-68.5,38.1,-73.5,53.1,-67.9Z"
                transform="translate(100 100)"
              />
            </svg>

            <Image
              className="absolute w-full h-full object-contain"
              src="/imgs/hand-drawn-digital-natives-illustration.png"
              alt="hand-drawn-digital-natives-illustration.png"
              fill
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomPage;
