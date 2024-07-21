"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowRedoOutline } from "react-icons/io5";
import SVGblob from "./SVGblob";
import VanillaTilt from "vanilla-tilt";
import { Typewriter } from "react-simple-typewriter";
import { supabase } from "@/lib/supabaseClient";

// TypeScript type for the VanillaTilt options
interface VanillaTiltOptions {
  max: number;
  speed: number;
  glare: boolean;
  "max-glare": number;
}

function Hero() {
  // Create a ref for the tilt element with a proper type declaration
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const [user, setuser] = useState<any>(null);

  // Initialize Vanilla Tilt on component mount
  useEffect(() => {
    if (tiltRef.current) {
      // Initialize VanillaTilt
      VanillaTilt.init(tiltRef.current, {
        max: 3,
        speed: 400,
        glare: false,
        "max-glare": 0.3,
      } as VanillaTiltOptions); // Use type assertion here
    }
  }, []);
  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setuser(user);
    };
    getUserData();
  }, []);
  

  return (
    <>
    {user ? (
        <p className="text-4xl md:text-6xl font-extrabold text-center pt-20 pb-0 w-full">
          Welcome,{" "}
          <span className=" text-indigo-500">{user.user_metadata.name}</span>
        </p>
      ) : (
        <p className="text-4xl md:text-6xl font-extrabold text-center pt-20 pb-0">Welcome,{" "}
        <span className=" text-indigo-500">Viewer</span>
        </p>
        
      )}
    <div className="w-screen flex justify-center items-center flex-wrap">
      <div className="flex justify-center items-center h-[800px] rounded-md">
        <div className="w-[400px] h-[400px] md:w-[600px] flex items-center justify-center backdrop-blur-sm rounded-3xl md:h-[600px]">
          <div ref={tiltRef} className="relative">
            <div className="w-full h-full absolute -z-10">
              <SVGblob />
            </div>
            <Image
              width={500}
              height={500}
              src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Hero/Hero_Photoroom.png"
              alt="Hero Image"
              className="z-20"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-20 gap-[30px] text-wrap">
        <h1 className="text-center uppercase text-5xl tracking-tighter select-none">
          Fulfil Your Dream <br /> with
        </h1>
        <p className="text-center uppercase text-5xl font-bold tracking-tighter select-none text-red-600">
          Modern
          <span className="text-cyan-400"> Computer</span>
        </p>
        <p className="text-wrap text-center text-xl select-none">
          Modern Computer presents the{" "}
          <span className="text-cyan-400 font-semibold">Rs. 10,000</span> PC
          deal! <br /> Special student offers included. Whether it's for you or{" "}
          <br />
          your child, seize this opportunity for high-quality <br /> computing.
          Limited stock available. Upgrade your tech <br /> affordably.
        </p>

        <ul className="text-xm flex flex-col items-center justify-between">
          <li className="flex gap-5 w-full">
            <IoArrowRedoOutline className="text-red-500" />{" "}
            <p>
              Affordable Pricing for{" "}
              <span className="text-cyan-400 font-semibold">Students</span>
            </p>
          </li>
          <li className="flex gap-5 w-full">
            <IoArrowRedoOutline className="text-red-500" />
            <p>
              <span className="text-cyan-400 font-semibold">
                Student Discount{" "}
              </span>
              will be applied
            </p>
          </li>
          <li className="flex gap-5 w-full">
            <IoArrowRedoOutline className="text-red-500" />
            <p>
              <span className="text-cyan-400 font-semibold">
                High Performance
              </span>{" "}
              Personal Computer
            </p>
          </li>
          <li className="flex gap-5 w-full">
            <IoArrowRedoOutline className="text-red-500" />
            <p>
              <span className="text-cyan-400 font-semibold">Confirm gifts</span>{" "}
              for students
            </p>
          </li>
        </ul>
        <button className="bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 h-10 w-28 rounded-md text-l hover:text-l hover:font-bold duration-200">
          Check out
        </button>
      </div>
    </div>
    </>
  );
}

export default Hero;
