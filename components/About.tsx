"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      const { data, error } = await supabase.from("about").select("*").single(); // Fetches a single row

      if (error) {
        console.error("Error fetching about data:", error);
      } else {
        setAboutData(data);
      }
      setLoading(false);
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!aboutData) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex flex-col gap-5 justify-center items-center w-full h-full mt-12">
      <h1 className="text-3xl font-extrabold ">
        About <span className="text-indigo-600">Us</span>
      </h1>

      <div className="text-center">
        {aboutData.about_image && (
          <img
            src={aboutData.about_image}
            alt="About"
            className="mx-auto mb-4 w-60 h-60 rounded-full"
          />
        )}
        <p className="mb-4 w-full text-center p-4">
          {aboutData.about_description}
        </p>
        <h1 className="text-2xl font-bold">
          Find us in <span className="text-green-400">Google Maps</span>
        </h1>
        <div className="p-4 flex justify-center items-center w-full md:px-28">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117809.33356005314!2d88.2346774433594!3d22.6708709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89d6194bec665%3A0xcd7daf9c1de1513d!2sMODERN%20COMPUTER!5e0!3m2!1sen!2sin!4v1722415474783!5m2!1sen!2sin"
            className="w-full md:w-full rounded-md h-96"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <h1 className="text-2xl font-bold">
          Check <span className="text-red-500">YouTube</span> for{" "}
          <span className="text-indigo-600">Latest Offers</span>
        </h1>
        <div className="w-full flex gap-10 justify-center flex-wrap items-center p-6 md:p-28">
          {aboutData.about_yt_1 && (
            <iframe
              className="w-auto h-64 md:w-[500px] md:h-[300px] rounded-md"
              src={aboutData.about_yt_1}
              title="YouTube video 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          {aboutData.about_yt_2 && (
            <iframe
              className="w-auto h-64 md:w-[500px] md:h-[300px] rounded-md"
              src={aboutData.about_yt_2}
              title="YouTube video 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
