import React from "react";

const ShopPhotoGallery = () => {
  return (
    <div className="flex flex-col justify-center items-center w-96 h-[550px] rounded-md bg-slate-800">
      <h1 className="text-xl font-extrabold text-center">
        Add images of <span className="text-indigo-600">your shop</span>
      </h1>
      <div>
        {/* react-dropzone here */}
      </div>
    </div>
  );
};

export default ShopPhotoGallery;
