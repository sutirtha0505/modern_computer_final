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

interface Product {
  product_id: string;
  product_name: string;
  product_image: { string: string }[];
  product_main_category: string;
  show_product: boolean;
  category_product_image: string;
}

const Header = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const router = useRouter();
  const cart = useAppSelector(getCart);
  const pathname = usePathname();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

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

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: products, error } = await supabase
          .from("products")
          .select(
            "product_id, product_name, product_image, product_main_category, show_product, category_product_image"
          )
          .eq("show_product", true); // Filter for products where show_product is true

        if (error) {
          console.error("Error fetching products:", error);
          setProducts([]); // Set an empty array in case of error
        } else if (products) {
          // Ensure unique categories
          const uniqueCategories = Array.from(
            new Set(products.map((product) => product.product_main_category))
          );
          const uniqueProducts = uniqueCategories.map((category) =>
            products.find(
              (product) => product.product_main_category === category
            )
          );

          // Filter out undefined values
          const filteredProducts = uniqueProducts.filter(
            (product): product is Product => product !== undefined
          );

          setProducts(filteredProducts);
        } else {
          setProducts([]); // Fallback to an empty array if the data is null
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchProducts();
  }, []);

  const searchHandler = () => {
    if (query.trim()) {
      router.push(`/search/${query}`);
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const lowercasedValue = value.toLowerCase();
      const suggestionData = products.filter((product) =>
        product.product_name.toLowerCase().startsWith(lowercasedValue)
      );
      setSuggestions(suggestionData);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setQuery(product.product_name);
    setSuggestions([]);
    searchHandler(); // Trigger search after clicking on a suggestion
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
          .select("role, profile_photo, customer_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          setRole(profile.role);
          setProfilePhoto(profile.profile_photo);
          setCustomerName(profile.customer_name);
        }
      }
    };
    getUserData();
  }, []);
  return (
    <>
      <div className="relative" id="mouse-region">
        <div className="flex items-center backdrop-blur-3xl bg-white/50 w-full h-16 fixed justify-between px-4 z-20 custom-backdrop-filter">
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
            <div className="relative group">
              <Link href="#" className="responsive-font font-bold">
                Products
                <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
              </Link>
              <div className="absolute -left-7 mt-2 w-48 bg-slate-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:transition-opacity group-hover:duration-300 p-4">
                <ul className="py-2 text-gray-800">
                  {products.map((category, index) => (
                    <div className="flex items-center justify-start">
                      <img
                        src={category.category_product_image}
                        alt=""
                        className="w-8 h-8"
                      />
                      <li
                        key={index}
                        onClick={() =>
                          router.push(
                            `/product-by-categories/${encodeURIComponent(
                              category?.product_main_category ?? ""
                            )}`
                          )
                        }
                        className="block text-xs px-4 py-2 cursor-pointer hover:text-indigo-500 text-white font-bold"
                      >
                        {category?.product_main_category}
                      </li>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative group">
              <Link href="#pbpc" className="responsive-font font-bold">
                Pre-Build PC
                <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
              </Link>
              <div className="absolute -left-7 mt-2 w-48 bg-slate-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:transition-opacity group-hover:duration-300 p-4">
                <ul className="py-2 text-gray-800">
                  <div className="flex items-center justify-start">
                    <img
                      src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pbpc_intel/INTEL_Prebuild.png"
                      alt=""
                      className="w-8 h-8"
                    />
                    <li
                      onClick={() => {
                        router.push("/pbpc/pbpc-intel");
                      }}
                      className="block text-xs px-4 py-2 cursor-pointer hover:text-indigo-500 text-white font-bold"
                    >
                      <p>Pre-Build Intel PC</p>
                    </li>
                  </div>
                  <div className="flex items-center justify-start">
                    <img
                      src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/pbpc_amd/AMD_Prebuild.png"
                      alt=""
                      className="w-8 h-8"
                    />
                    <li
                      onClick={() => {
                        router.push("/pbpc/pbpc-amd");
                      }}
                      className="block text-xs px-4 py-2 cursor-pointer hover:text-indigo-500 text-white font-bold"
                    >
                      <p>Pre-Build AMD PC</p>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            <div className="relative group">
              <Link href="#cbpc" className="responsive-font font-bold">
                Custom-Build PC
                <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
              </Link>
              <div className="absolute -left-7 mt-2 w-48 bg-slate-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:transition-opacity group-hover:duration-300 p-4">
                <ul className="py-2 text-gray-800">
                  <div className="flex items-center justify-start">
                    <img
                      src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/cbpc_intel/INTEL_Custom.png"
                      alt=""
                      className="w-8 h-8"
                    />
                    <li
                      onClick={() => {
                        router.push("/cbpc/cbpc-intel");
                      }}
                      className="block text-xs px-4 py-2 cursor-pointer hover:text-indigo-500 text-white font-bold"
                    >
                      <p>Custom-Build Intel PC</p>
                    </li>
                  </div>
                  <div className="flex items-center justify-start">
                    <img
                      src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/cbpc_amd/AMD_Custom.png"
                      alt=""
                      className="w-8 h-8"
                    />
                    <li
                      onClick={() => {
                        router.push("/cbpc/cbpc-amd");
                      }}
                      className="block text-xs px-4 py-2 cursor-pointer hover:text-indigo-500 text-white font-bold"
                    >
                      <p>Custom-Build AMD PC</p>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            <Link href="#about" className="relative group responsive-font font-bold">
              About
              <span className="block h-0.5 w-0 bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-500"></span>
            </Link>
          </div>

          <div className="flex relative">
            <input
              type="text"
              value={query}
              onChange={handleSearchTermChange}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="pl-11 py-2 rounded-full border border-gray-300 w-[220px] focus:outline-none text-black"
            />
            {suggestions.length > 0 && (
              <ul
                className="absolute bg-slate-900 border border-gray-300 w-full mt-1 max-h-48 overflow-y-auto z-10 top-10 scrollbar-hide
              "
              >
                {suggestions.map((product) => (
                  <li
                    key={product.product_id}
                    onClick={() => handleSuggestionClick(product)}
                    className="cursor-pointer p-2 hover:bg-gray-700 text-xs"
                  >
                    {product.product_name}
                  </li>
                ))}
              </ul>
            )}
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
                      <div
                        className="flex justify-center items-center gap-3 px-4 py-2 hover:bg-white/30 hover:rounded-md backdrop-blur-3xl"
                        onClick={() => {
                          if (user && user.id) {
                            // Navigate to a user profile page or perform an action with the user ID
                            router.push(`/profile/${user.id}`);
                          }
                        }}
                      >
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
                        <h1 className="text-sm font-medium hover:text-indigo-600 cursor-pointer block w-fit text-center overflow-hidden text-wrap break-before-auto">
                          {customerName
                            ? customerName // Render customer_name if it exists
                            : user?.user_metadata?.name
                            ? user.user_metadata.name
                            : user.email}
                        </h1>
                      </div>
                      {role === "admin" && (
                        <div
                          className="flex justify-center gap-8 px-4 py-2 hover:bg-white/30 hover:rounded-md text-white cursor-pointer hover:text-indigo-600"
                          onClick={() => {
                            toggleProfileMenu();
                            router.push("/admin");
                          }}
                        >
                          <img
                            src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/web-administrator.png"
                            alt=""
                            className="w-6 h-6"
                          />
                          <p>Admin Panel</p>
                        </div>
                      )}
                      <div
                        className="flex justify-center gap-8 px-4 py-2 hover:bg-white/30 hover:rounded-md text-white cursor-pointer hover:text-indigo-600"
                        onClick={() => {
                          toggleProfileMenu();
                          router.push("/orders");
                        }}
                      >
                        <img
                          src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Logo_Social/delivery-box.png"
                          alt=""
                          className="w-6 h-6"
                        />
                        <p>Your Orders</p>
                      </div>
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
            <div className="relative z-20">
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
