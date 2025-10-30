"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import Image from "next/image";

const HeaderHomeLayout = () => {
  return (
    <header className="sticky top-8">
      <div className="flex justify-center">
        <div className="p-2 max-w-2xl bg-white w-full rounded-2xl shadow-xl">
          <div className="flex justify-start items-center">
            <div className="flex justify-start items-center gap-3">
              <Image width={35} height={35} src={"/imgs/logo.png"} alt="Leaf Logo" />
              <h1 className="font-bold text-lg font-mono">LEAF</h1>
            </div>
            <span className="block mx-5 h-6 w-[0.3px] bg-foreground/10"></span>
            <div className="flex flex-1 justify-between items-center w-full">
              <div className="flex justify-center items-center gap-10">
                <span>Resources</span>
                <span>Github</span>
              </div>
              <div className="">
                <Button variant={"outline"} className="shadow-lg">
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderHomeLayout;
