"use client"
import React from "react";
import { MdPostAdd } from "react-icons/md";
import { CiViewTable } from "react-icons/ci";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TbTableOptions } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Sparkles, TableProperties } from "lucide-react";
import { FaComputer } from "react-icons/fa6";
import { MdOutlineCategory } from "react-icons/md";
import { TiInfoLargeOutline } from "react-icons/ti";

const Admin = () => {
  const router = useRouter();
  return (
    <div className=" w-full p-5 gap-3 h-full flex flex-col">
      <h1 className="text-center text-5xl font-extrabold">
        Welcome to <span className="text-indigo-500">Admin page</span>
      </h1>
      <div className="p-4 flex flex-col justify-center items-center gap-4">
        <h1 className="font-bold text-emerald-300 text-xl">
          Products Management
        </h1>
        <div className="flex gap-2 flex-wrap justify-center items-center">
          <div
            onClick={() => {
              router.push("/admin/productadd");
            }}
            className="p-4 rounded-sm flex flex-col justify-center items-center bg-cyan-400 border-cyan-400 border-2 hover:bg-transparent hover:text-cyan-400 cursor-pointer h-24 gap-2"
          >
            <MdPostAdd size={30} />
            <p className="text-center font-semibold text-xs">Add New Product</p>
          </div>
          <div onClick={()=>{
            router.push("/admin/producttable");
          }} className="p-4 rounded-sm flex flex-col justify-center items-center bg-violet-500 border-violet-500 border-2 hover:bg-transparent hover:text-violet-500 cursor-pointer h-24 gap-2">
            <CiViewTable size={30} />
            <p className="text-center font-semibold text-xs">
              View All Products
            </p>
          </div>
          <div onClick={()=>{
            router.push("/admin/custom-pc-combination");
          }} className="p-4 rounded-sm flex flex-col justify-center items-center bg-red-500 border-red-500 border-2 hover:bg-transparent hover:text-red-500 gap-2 cursor-pointer h-24">
            <MdOutlineDashboardCustomize size={30} />
            <p className="text-center font-semibold text-xs">
              Custom PC Combinations
            </p>
          </div>
          <div onClick={()=>{
            router.push("/admin/custom_build_table");
          }} className="p-4 rounded-sm flex flex-col justify-center items-center  bg-pink-500 border-pink-500 border-2 hover:bg-transparent hover:text-pink-500 gap-2 cursor-pointer h-24">
            <TbTableOptions size={30} />
            <p className="text-center font-semibold text-xs">Custom PC Table</p>
          </div>
          <div onClick={()=>{
            router.push("/admin/best_seller_carousel");
          }} className="p-4 rounded-sm flex flex-col justify-center items-center  bg-orange-500 border-orange-500 border-2 hover:bg-transparent hover:text-orange-500 gap-2 cursor-pointer h-24">
            <Sparkles size={30} />
            <p className="text-center font-semibold text-xs">Best Seller Carousel</p>
          </div>
          <div onClick={()=>{
            router.push("/admin/pre-build-pc-listing");
          }} className="p-4 rounded-sm flex flex-col justify-center items-center  bg-blue-500 border-blue-500 border-2 hover:bg-transparent hover:text-blue-500 gap-2 cursor-pointer h-24">
            <FaComputer size={30} />
            <p className="text-center font-semibold text-xs">Pre-Build PC Add</p>
          </div>
          <div onClick={()=>{
            router.push("/admin/pre-build-table");
          }} className="p-4 rounded-sm flex flex-col justify-center items-center bg-rose-500 border-rose-500 border-2 hover:bg-transparent hover:text-rose-500 gap-2 cursor-pointer h-24">
            <TableProperties size={30}/>
            <p className="text-center font-semibold text-xs">Pre-Build PC Table</p>
          </div>
          <div onClick={()=>{
            router.push("/admin/product-by-category");
          }} className="p-4 rounded-sm flex flex-col justify-center items-center bg-fuchsia-900 border-fuchsia-900 border-2 hover:bg-transparent hover:text-fuchsia-900 gap-2 cursor-pointer h-24">
            <MdOutlineCategory size={30}/>
            <p className="text-center font-semibold text-xs">Product by Categories</p>
          </div>
          <div onClick={()=>{
            router.push("/admin/edit-about-section");
          }} className="p-4 rounded-sm flex flex-col justify-center items-center bg-emerald-500 border-emerald-500 border-2 hover:bg-transparent hover:text-emerald-500 gap-2 cursor-pointer h-24">
            <TiInfoLargeOutline size={30}/>
            <p className="text-center font-semibold text-xs">About Section</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
