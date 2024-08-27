"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import { ImageUp } from "lucide-react";

const EditHeroSection: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [paragraph, setParagraph] = useState("");
  const [link, setLink] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!image || !paragraph || !link) {
      toast.error("All fields are required");
      return;
    }

    try {
      // Upload image to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("product-image")
        .upload(`Hero/${image.name}`, image);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("product-image")
        .getPublicUrl(`Hero/${image.name}`);

      if (!publicUrlData) {
        throw new Error("Unable to get public URL");
      }

      const imageUrl = publicUrlData.publicUrl;

      // Save data to Supabase table
      const { error: dbError } = await supabase.from("hero_section").upsert({
        hero_image: imageUrl,
        hero_paragraph: paragraph,
        hero_button_link: link,
      });

      if (dbError) {
        throw dbError;
      }

      // Clear the form
      setImage(null);
      setParagraph("");
      setLink("");

      // Show success toast
      toast.success("Hero section updated perfectly");
    } catch (error) {
      console.error("Error updating hero section:", error);
      toast.error("Failed to update hero section");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-80 h-96 flex flex-col justify-center items-center gap-5 rounded-lg bg-slate-700 p-4">
        <div
          {...getRootProps()}
          className="w-28 h-28 border-2 border-dashed border-white rounded-lg flex justify-center items-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <ImageUp className="h-6 w-6 text-white" />
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm text-white font-bold">
            Hero Section Paragraph:
          </label>
          <textarea
            className="w-full h-20 p-2 bg-transparent resize-none border-b-2 border-white text-white outline-none"
            placeholder="Enter paragraph for hero section..."
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="link" className="text-sm text-white font-bold">
            Hero Section Link:
          </label>
          <input
            type="url"
            className="w-full p-2 bg-transparent border-b-2 border-white text-white outline-none"
            placeholder="Enter link for 'Know more' button..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>
        <button
          onClick={handleUpload}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditHeroSection;
