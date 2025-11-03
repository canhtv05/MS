"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import HeaderHomeLayout from "@/views/layouts/home/HeaderHomeLayout";
import Image from "next/image";

const HomPage = () => {
  return (
    <div className="h-[2000px] bg-white">
      <HeaderHomeLayout />

      <main className="lg:pt-0 pt-20 lg:-mt-10 md:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full">
          <div className="w-full flex flex-col gap-6 lg:gap-8 lg:pl-30 pl-5">
            <h1 className="lg:text-[50px] md:text-[40px] text-[30px] text-black font-roboto font-medium leading-none relative">
              A Smarter Way to Form Friendships
            </h1>

            <p className="md:text-lg text-sm text-black/60 max-w-xl">
              Connect with like-minded people, discover new friends, and build meaningful relationships effortlessly.
            </p>

            <div>
              <Button size="sm" className="rounded-full md:px-15 px-5 py-5 md:py-7">
                Get started
              </Button>
            </div>
          </div>

          <div className="relative w-full max-w-full aspect-square overflow-hidden">
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
