import Link from "next/link";
import React from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { FaComputer } from "react-icons/fa6";
import { IoBuildOutline } from "react-icons/io5";
import { LuBadgeInfo } from "react-icons/lu";
const Menu = () => {
  return (
    <div className="md:hidden flex items-center backdrop-blur-3xl bg-white/50 w-full h-16 fixed justify-between px-4 z-10 custom-backdrop-filter bottom-0">
      <div className="flex gap-10 w-full justify-between ">
        <Link href="#productbycategoriesslider" className="relative items-center flex flex-col group text-xs font-extrabold">
          <AiOutlineProduct className="text-indigo-500 text-xl" />
          Products
          <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
        </Link>
        <Link
          href="#pbpc"
          className="relative items-center flex flex-col group text-xs font-extrabold"
        >
          <FaComputer className="text-indigo-500 text-xl" />
          Pre-Build PC
          <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
        </Link>
        <Link
          href="#cbpc"
          className="relative items-center flex flex-col group text-xs font-extrabold"
        >
          <IoBuildOutline className="text-indigo-500 text-xl" />
          Custom-Build PC
          <span className="block h-0.5 w-0  bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
        </Link>
        <Link href="#about" className="relative items-center flex flex-col group text-xs font-extrabold">
          <LuBadgeInfo className="text-indigo-500 text-xl" />
          About
          <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
