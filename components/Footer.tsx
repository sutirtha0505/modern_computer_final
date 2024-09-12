import { MoveUp } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full p-4 flex justify-between items-center bg-slate-900">
      <h1 className="text-lg font-bold text-center">
        All Rights Reseved by{" "}
        <span className="text-indigo-500">&copy;Modern Computer</span>, 2024
      </h1>
      <div className="p-2 rounded-md border-indigo-500 border-2 bg-indigo-500 hover:bg-transparent hover:text-indigo-500 cursor-pointer">
        <Link href="#hero"><MoveUp /></Link>
      </div>
    </div>
  );
};

export default Footer;
