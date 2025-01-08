"use client"
import Link from "next/link";
import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useRouter } from "next/navigation";
import { FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import Image from "next/image";

const Footer = () => {
  const router = useRouter();
  return (
    <div className="w-full p-4 px-20 mb-16 md:mb-0 flex justify-between items-center bg-slate-300 dark:bg-slate-900">
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-sm md:text-xl font-bold text-center">
          All Rights Reseved by{" "}
          <span className="text-indigo-500">&copy;Modern Computer</span>, 2024
        </h1>
        <div className="w-full justify-center items-center flex gap-4 invisible md:visible">
        <div
          className="w-12 h-12 rounded-full bg-white cursor-pointer flex justify-center items-center border-2 border-green-500 hover:bg-transparent"
          onClick={() => {
            router.push(
              "https://wa.me/917686873088?text=Hi%20Modern%20computer%0AI've%20just%20visited%20the%20website%20and%20want%20to%20talk%20about%20some%20queries."
            );
          }}
        >
          <FaWhatsapp className="text-green-500 w-6 h-6" />
        </div>
        <div
          className="w-12 h-12 rounded-full bg-white hover:bg-transparent border-2 border-pink-500 cursor-pointer flex justify-center items-center"
          onClick={() => {
            router.push("https://www.instagram.com/moderncomputer1999/");
          }}
        >
          {/* <FaInstagram className="gradient-icon icons" /> */}
          <Image
            src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/Instagram-Logo.png"
            alt=""
            width={50}
            height={50}
          />
        </div>
        <div
          className="w-12 h-12 rounded-full bg-white hover:bg-transparent cursor-pointer flex justify-center items-center border-2 border-red-500"
          onClick={() => {
            router.push("https://www.youtube.com/@moderncomputer1999");
          }}
        >
          <FaYoutube className="text-red-600 w-6 h-6" />
        </div>
        <div
          className="w-12 h-12 rounded-full bg-white cursor-pointer flex justify-center items-center hover:bg-transparent border-2 border-green-600"
          onClick={() => {
            window.location.href = "tel:+917686873088";
          }}
        >
          <IoCall className="text-green-600 w-6 h-6" />
        </div>
        <div
          className="w-12 h-12 rounded-full bg-white cursor-pointer flex justify-center items-center hover:bg-transparent border-2 border-blue-600"
          onClick={() => {
            router.push(
              "https://www.facebook.com/people/Modern-Computer/100093078390711/?mibextid=ZbWKwL"
            );
          }}
        >
          <FaFacebook className="text-blue-600 w-6 h-6" />
        </div>
        <div
          className="w-12 h-12 rounded-full bg-white cursor-pointer flex justify-center items-center hover:bg-transparent border-2 border-yellow-400"
          onClick={() => {
            window.location.href = "mailto:moderncomputer1997@gmail.com";
          }}
        >
          <Image
            src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/gmail.png"
            alt=""
            width={25}
            height={25}
          />
        </div>
      </div>
      </div>
      <div className="p-2 rounded-md border-indigo-500 border-2 bg-indigo-500 hover:bg-transparent hover:text-indigo-500 cursor-pointer">
        <Link href="#hero">
          <ArrowUpwardIcon />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
