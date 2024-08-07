import React, { useCallback, useEffect, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { supabase } from "@/lib/supabaseClient";
import { ImageUp, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ShopPhotoGallery: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const handleRemove = (file: File) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const handleUpload = async () => {
    const uploads = selectedFiles.map(async (file) => {
      const { data, error } = await supabase.storage
        .from("product-image")
        .upload(`gallery/${file.name}`, file);

      if (error) {
        console.error("Error uploading file:", error);
        return null;
      }

      return data;
    });

    const results = await Promise.all(uploads);

    if (results.every(result => result !== null)) {
      toast.success("The images are uploaded successfully!", {
        position: "bottom-center",
      });
      setSelectedFiles([]);
      fetchGalleryImages();  // Fetch the updated list of images after upload
    }
  };

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: true,
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase.storage
      .from("product-image")
      .list("gallery", { limit: 100 });

    if (error) {
      console.error("Error fetching gallery images:", error);
      return;
    }

    if (data) {
      const imageUrls = data.map(file => {
        const { data: publicUrlData } = supabase.storage
          .from("product-image")
          .getPublicUrl(`gallery/${file.name}`);
        const publicUrl = publicUrlData.publicUrl;
        console.log("Image URL:", publicUrl);  // Log the URL for debugging
        return publicUrl;
      });
      setGalleryImages(imageUrls);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  return (
    <div className="flex flex-col justify-between items-center w-96 h-[550px] rounded-md bg-slate-800 p-4">
      <ToastContainer />
      <h1 className="text-xl font-extrabold text-center">
        Add images of <span className="text-indigo-600">your shop</span>
      </h1>
      <div
        {...getRootProps()}
        className="w-20 h-20 mt-4 rounded-full border-2 border-dashed flex items-center justify-center outline-none cursor-pointer"
      >
        <input {...getInputProps()} />
        <ImageUp />
      </div>
      {selectedFiles.length > 0 && (
        <>
          <div className="mt-4 h-40 overflow-y-scroll flex flex-wrap justify-center gap-4">
            {selectedFiles.map((file) => (
              <div key={file.name} className="relative w-20 h-20">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleRemove(file)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            className="mt-4 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 h-10 w-28 rounded-md text-l hover:text-l hover:font-bold duration-200"
          >
            Upload
          </button>
        </>
      )}
      <div className="mt-4 h-30 flex justify-start items-center overflow-x-scroll w-full gap-2 p-2">
        {galleryImages.map((url, index) => (
          <img key={index} src={url} alt={`Gallery image ${index}`} className="w-20 h-20 object-cover rounded-md" />
        ))}
      </div>
    </div>
  );
};

export default ShopPhotoGallery;
