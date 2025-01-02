"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabaseClient";
import { BadgeInfo, CloudUpload } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const ProductUploadForm: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [productSP, setProductSP] = useState<number>(0);
  const [productDescription, setProductDescription] = useState<string>("");
  const [productMRP, setProductMRP] = useState<number>(0);
  const [productCategory, setProductCategory] = useState<string>(""); // New state for category
  const [images, setImages] = useState<File[]>([]);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [isSuggestionVisible, setIsSuggestionVisible] =
    useState<boolean>(false); // State for tooltip visibility

  const onDrop = (acceptedFiles: File[]) => {
    setImages([...images, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
        !productName ||
        !productDescription ||
        productMRP === 0 ||
        productSP === 0 ||
        !productCategory ||
        images.length === 0
    ) {
        toast.error("Please fill all the fields and upload at least one image");
        return;
    }

    const productDiscount = ((productMRP - productSP) / productMRP) * 100;

    // Check for duplicate product name
    const { data: existingProducts, error: checkError } = await supabase
        .from("products")
        .select("product_name")
        .eq("product_name", productName);

    if (checkError) {
        console.error("Error checking product name:", checkError.message);
        toast.error(`Error checking product name: ${checkError.message}`);
        return;
    }

    if (existingProducts && existingProducts.length > 0) {
        toast.error("Already this product is listed");
        return;
    }

    const productId = uuidv4();
    const imageUrls: any[] = [];
    const uploadPromises = images.map(async (image) => {
        const filePath = `${productId}/${uuidv4()}_${image.name}`;
        const { error: uploadError } = await supabase.storage
            .from("product-image")
            .upload(filePath, image);

        if (uploadError) {
            console.error("Error uploading image:", uploadError.message);
            toast.error(`Error uploading image: ${uploadError.message}`);
            return;
        }

        const { data: publicUrlData } = await supabase.storage
            .from("product-image")
            .getPublicUrl(filePath);

        if (publicUrlData) {
            imageUrls.push({ url: publicUrlData.publicUrl });
        } else {
            console.error("Error getting public URL");
            toast.error("Error getting public URL");
        }
    });

    await Promise.all(uploadPromises);

    const calculatedSP = productMRP - (productMRP * productDiscount) / 100;

    const { error: insertError } = await supabase
        .from("products")
        .insert([
            {
                product_id: productId,
                product_image: imageUrls,
                product_name: productName,
                product_description: productDescription,
                product_MRP: Number(productMRP),
                product_discount: Number(productDiscount),
                product_SP: Number(calculatedSP), // Use calculatedSP here
                product_amount: 100, // Initial amount, can be adjusted later
                product_category: productCategory, // Include the category
            },
        ]);

    if (insertError) {
        console.error("Error adding product:", insertError.message);
        toast.error(`Error adding product: ${insertError.message}`);
        return;
    }

    toast.success("Product added successfully!");
    setProductName("");
    setProductDescription("");
    setProductMRP(0); // Reset to 0
    setProductSP(0); // Reset product selling price
    setProductCategory(""); // Reset category
    setImages([]);
};


  return (
    <div className="w-full h-[100vh] flex gap-2 flex-col justify-center items-center">
      <ToastContainer />
      <h1 className="text-center text-2xl font-bold">Add Products Here</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white/50 flex flex-col rounded-md gap-5 items-center justify-between py-4 px-6"
      >
        <div className="flex flex-col relative">
          <div
            className="flex justify-between items-center"
            onMouseOver={() => setIsTooltipVisible(true)}
            onMouseOut={() => setIsTooltipVisible(false)}
          >
            <label>Product Category:</label>
            <BadgeInfo className=" hover:text-indigo-500 cursor-help" />
          </div>
          {isTooltipVisible && (
            <div className="absolute z-[2] top-6 left-0 bg-white/50 text-white text-sm p-2 rounded custom-backdrop-filter">
              <h1 className="text-center text-indigo-500 font-bold">
                Cheatlist for Product Category
              </h1>
              <table className="border-black text-black">
                <thead>
                  <tr>
                    <th className="border">Product</th>
                    <th className="border">Product Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border">AMD Processor</td>
                    <td className="border">AMD_CPU</td>
                  </tr>
                  <tr>
                    <td className="border">Intel Processor</td>
                    <td className="border">INTEL_CPU</td>
                  </tr>
                  <tr>
                    <td className="border">Motherboard</td>
                    <td className="border">Motherboard</td>
                  </tr>
                  <tr>
                    <td className="border">RAM</td>
                    <td className="border">RAM</td>
                  </tr>
                  <tr>
                    <td className="border">SSD</td>
                    <td className="border">SSD</td>
                  </tr>
                  <tr>
                    <td className="border">Graphics Card</td>
                    <td className="border">GPU</td>
                  </tr>
                  <tr>
                    <td className="border">Cabinet</td>
                    <td className="border">Cabinet</td>
                  </tr>
                  <tr>
                    <td className="border">Power Supply</td>
                    <td className="border">PSU</td>
                  </tr>
                  <tr>
                    <td className="border">Hard Disk</td>
                    <td className="border">HDD</td>
                  </tr>
                  <tr>
                    <td className="border">Laptop</td>
                    <td className="border">Laptop</td>
                  </tr>
                  <tr>
                    <td className="border">Monitor</td>
                    <td className="border">Monitor</td>
                  </tr>
                  <tr>
                    <td className="border">Keyboard</td>
                    <td className="border">Keyboard</td>
                  </tr>
                  <tr>
                    <td className="border">Mouse</td>
                    <td className="border">Mouse</td>
                  </tr>
                  <tr>
                    <td className="border">Pendrive</td>
                    <td className="border">Pendrive</td>
                  </tr>
                  <tr>
                    <td className="border">Cooler</td>
                    <td className="border">Cooler</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <input
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            required
            className="border-2 border-white rounded-md bg-transparent outline-none pl-1"
          />
        </div>
        <div className="flex flex-col">
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="border-2 border-white rounded-md bg-transparent outline-none pl-1"
          />
        </div>
        <div className="flex flex-col">
          <label>Product Description:</label>
          <input
            type="text"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
            className="border-2 border-white rounded-md bg-transparent outline-none pl-1"
          />
        </div>
        <div className="flex flex-col">
          <label>Product MRP:</label>
          <input
            type="number"
            value={productMRP}
            onChange={(e) => setProductMRP(Number(e.target.value))}
            required
            className="border-2 border-white rounded-md bg-transparent pl-1 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label>Product Selling Price:</label>
          <input
            type="number"
            value={productSP}
            onChange={(e) => setProductSP(Number(e.target.value))}
            required
            className="border-2 border-white rounded-md bg-transparent pl-1 outline-none"
          />
        </div>
        <div className="flex flex-col relative">
          <div
            className="flex justify-between items-center"
            onMouseOver={() => setIsSuggestionVisible(true)}
            onMouseOut={() => setIsSuggestionVisible(false)}
          >
            <label>Product Images:</label>
            <BadgeInfo className="hover:text-indigo-500 cursor-help" />
          </div>
          {isSuggestionVisible && (
            <div className="absolute z-[2] top-6 left-0 bg-white/50 text-white text-sm p-2 rounded custom-backdrop-filter">
              <h1 className="text-center text-indigo-500 font-bold">
                Cheatlist for Uploading Image
              </h1>
              <p className="text-center text-black">
                Remember to <b>Rename</b> the image you want to set as{" "}
                <b>First image</b>.
              </p>
              <p className="text-center text-black">
                Rename it and add{" "}
                <span className="text-indigo-500 font-bold">_first</span> at the
                end of the image name.
              </p>
              <p className="text-center text-black">
                If you have only one image, also in that case, <b>Rename</b> and
                add <span className="text-indigo-500 font-bold">_first</span> to
                that image name.
              </p>
            </div>
          )}
          <div
            {...getRootProps()}
            className="border-2 border-white rounded-md bg-transparent p-4 flex-col flex items-center border-dashed"
          >
            <input {...getInputProps()} multiple />
            <CloudUpload />
            <p className="text-center">Upload product image here</p>
          </div>
          <div className="flex flex-wrap">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Product Image ${index}`}
                  className="max-h-20 max-w-20 object-cover rounded-md m-2"
                  width={500}
                  height={500}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-indigo-500 p-2 rounded-md hover:font-bold"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductUploadForm;
