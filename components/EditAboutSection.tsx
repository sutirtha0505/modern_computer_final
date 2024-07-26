import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabaseClient";
import { ImageUp } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EditAboutSection: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [yt1, setYt1] = useState("");
  const [yt2, setYt2] = useState("");
  const [location, setLocation] = useState({ lat: "", long: "" });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  const handleSave = async () => {
    let imageUrl: string | null = null;

    if (image) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("About")
        .upload(`public/${image.name}`, image);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("About")
        .getPublicUrl(`public/${image.name}`);
      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase.from("about").insert({
      about_image: imageUrl,
      about_description: description,
      about_location: `(${location.lat}, ${location.long})`,
      about_yt_1: yt1,
      about_yt_2: yt2,
    });

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      toast.success("Updated Successfully");
    }
  };

  return (
    <div className="flex flex-col p-4 rounded-md bg-white/50 custom-backdrop-filter w-96 h-[550px] items-center justify-between">
      <ToastContainer />
      <h1 className="text-xl font-extrabold text-center">
        Edit the <span className="text-indigo-600">About </span>section
      </h1>
      <div className="flex flex-col gap-2 justify-center items-center w-full">
        <div
          {...getRootProps({ className: "dropzone" })}
          className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center"
        >
          <input {...getInputProps()} />
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              className="w-full h-full rounded-full"
            />
          ) : (
            <ImageUp />
          )}
        </div>
        <label
          htmlFor="Description"
          className="text-left w-full text-xs font-bold"
        >
          Description
        </label>
        <textarea
          rows={4}
          className="resize-none border rounded-md p-2 w-full bg-transparent text-sm outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add business description"
        />
        <label htmlFor="yt1" className="text-left w-full text-xs font-bold">
          Latest YouTube video's Embeded URL(1):
        </label>
        <input
          type="text"
          className="border rounded-md p-2 bg-transparent w-full text-sm outline-none"
          value={yt1}
          onChange={(e) => setYt1(e.target.value)}
          placeholder="YouTube video 1 URL"
        />
        <label htmlFor="yt2" className="text-left w-full text-xs font-bold">
          Latest YouTube video's Embeded URL(2):
        </label>
        <input
          type="text"
          className="border rounded-md p-2 bg-transparent w-full text-sm outline-none"
          value={yt2}
          onChange={(e) => setYt2(e.target.value)}
          placeholder="YouTube video 2 URL"
        />
        <div className="flex gap-2 w-full">
          <div className="flex flex-col gap-1 w-1/2">
            <label htmlFor="lat" className="text-left text-xs font-bold">
              Latitude:
            </label>
            <input
              type="text"
              className="border rounded-md p-2 bg-transparent text-sm outline-none"
              value={location.lat}
              onChange={(e) =>
                setLocation({ ...location, lat: e.target.value })
              }
              placeholder="Latitude"
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <label htmlFor="long" className="text-left text-xs font-bold">
              Longitude:
            </label>
            <input
              type="text"
              className="border rounded-md p-2 bg-transparent text-sm outline-none"
              value={location.long}
              onChange={(e) =>
                setLocation({ ...location, long: e.target.value })
              }
              placeholder="Longitude"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white rounded-md p-2"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditAboutSection;
