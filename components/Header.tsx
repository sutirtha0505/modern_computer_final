"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  BaggageClaim,
  CircleUser,
  LucideLogIn,
  Search,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks/redux";
import { getCart } from "@/redux/cartSlice";
import { supabase } from "@/lib/supabaseClient";
import "@/app/globals.css";
const Header = () => {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();
  const cart = useAppSelector(getCart);
  const pathname = usePathname();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseEnter = () => {
      setIsMouseInside(true);
    };

    const handleMouseLeave = () => {
      setIsMouseInside(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    const region = document.getElementById("mouse-region");
    if (region) {
      region.addEventListener("mouseenter", handleMouseEnter);
      region.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (region) {
        region.removeEventListener("mouseenter", handleMouseEnter);
        region.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const searchHandler = () => {
    if (query.trim()) {
      router.push(`/search/${query}`);
    }
  };

  useEffect(() => {
    if (pathname.startsWith("/search")) {
      setQuery("");
    }
  }, [pathname]);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchHandler();
    }
  };

  const navigateToCart = () => {
    router.push("/cart");
  };

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile, error } = await supabase
          .from("profile")
          .select("role, profile_photo")
          .eq("id", user.id)
          .single();

        if (profile) {
          setRole(profile.role);
          setProfilePhoto(profile.profile_photo);
        }
        // else if (error) {
        //   console.error("Error fetching profile:", error);
        // }
      }
    };
    getUserData();
  }, []);

  return (
    <>
      <div className="relative" id="mouse-region">
        <div className="flex items-center backdrop-blur-3xl bg-white/50 w-full h-16 fixed justify-between px-4 z-10 custom-backdrop-filter">
          <Link href="/">
            <Image
              src="/logo.jpg"
              width={50}
              height={50}
              className="rounded-full cursor-pointer"
              alt="Logo"
            />
          </Link>

          <div className="hidden md:flex gap-10">
            <Link href="/product" className="relative group">
              Products
              <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
            </Link>
            <Link href="/pre-build-pc" className="relative group">
              Pre-Build PC
              <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
            </Link>
            <Link href="/custom-build-pc" className="relative group">
              Custom-Build PC
              <span className="block h-0.5 w-0  bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
            </Link>
            <Link href="/about" className="relative group">
              About
              <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
            </Link>
          </div>

          <div className="flex relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown} // Added key down handler here
              placeholder="Search..."
              className="pl-11 py-2 rounded-full border border-gray-300 w-[220px] focus:outline-none text-black"
            />
            <button
              onClick={searchHandler}
              className="absolute right-0 top-0 bottom-0 p-[9px] bg-indigo-500 rounded-full hover:bg-indigo-600"
            >
              <Search />
            </button>
          </div>

          <div className="flex gap-3 md:gap-10 items-center justify-center mx-2 relative">
            <div className="relative">
              <CircleUser
                className="select-none cursor-pointer hover:text-indigo-500"
                onClick={toggleProfileMenu}
              />
              {isProfileMenuOpen && (
                <div className="absolute right-0 w-52 bg-white/50 rounded-md shadow-lg z-10 custom-backdrop-filter backdrop-blur-md mt-2">
                  {user ? (
                    <>
                      <div className="flex justify-center items-center gap-3 px-4 py-2 hover:bg-white/30 hover:rounded-md backdrop-blur-3xl">
                        {/* image here by matching the id from profile table */}
                        {profilePhoto ? (
                          <Image
                            src={profilePhoto}
                            alt="Profile Photo"
                            width={30}
                            height={30}
                            className="rounded-full w-10 h-10"
                          />
                        ) : (
                          <CircleUser className="w-7 h-7" />
                        )}
                        <p
                          className="block px-4 py-2 text-sm font-medium hover:text-indigo-600 cursor-pointer"
                          onClick={() => {
                            if (user && user.id) {
                              // Navigate to a user profile page or perform an action with the user ID
                              router.push(`/profile/${user.id}`);
                            }
                          }}
                        >
                          {user.user_metadata.name}
                        </p>
                      </div>
                      {role === "admin" && (
                        <div className="flex justify-start gap-3 px-4 py-2 hover:bg-white/30 hover:rounded-md">
                          <p
                            onClick={() => {
                              toggleProfileMenu();
                              router.push("/admin");
                            }}
                            className="text-white cursor-pointer hover:text-indigo-600"
                          >
                            Admin Panel
                          </p>
                        </div>
                      )}
                      <div className="flex justify-center gap-3 px-4 py-2">
                        <button
                          onClick={async () => {
                            toggleProfileMenu();
                            const { error } = await supabase.auth.signOut();
                            window.location.reload();
                          }}
                          className="bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 h-10 w-28 rounded-md text-xs hover:text-l hover:font-bold duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-start gap-3 px-4 py-2 hover:bg-white/30 hover:rounded-md">
                        <LucideLogIn className="text-indigo-500" />
                        <Link
                          href="/SignIn"
                          className="text-white cursor-pointer hover:text-indigo-600"
                        >
                          LogIn
                        </Link>
                      </div>
                      <div className="flex justify-start gap-3 px-4 py-2 hover:bg-white/30 hover:rounded-md">
                        <UserPlus className=" text-emerald-400" />
                        <Link
                          href="/SignUp"
                          className="text-white cursor-pointer hover:text-emerald-400"
                        >
                          SignUp
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <div
                className="flex gap-1 hover:text-indigo-500 cursor-pointer"
                onClick={navigateToCart}
              >
                <BaggageClaim />
                <p>{cart.length}</p>
              </div>
            </div>
          </div>
        </div>
        {isMouseInside && (
          <div
            className="fixed top-0 left-0 w-8 h-8 bg-indigo-500 rounded-full blur-md pointer-events-none"
            style={{
              transform: `translate(${mousePosition.x - 16}px, ${
                mousePosition.y - 16
              }px)`,
            }}
          ></div>
        )}
      </div>
    </>
  );
};

export default Header;
