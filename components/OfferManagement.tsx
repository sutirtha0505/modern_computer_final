import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TableProperties } from "lucide-react";
import { MdOutlineDashboardCustomize, MdPostAdd } from "react-icons/md";

const OfferManagement = () => {
  const [selectedDiv, setSelectedDiv] = useState<number | null>(null); // Track which div is selected
  const router = useRouter();

  const renderSubDivs = () => {
    if (selectedDiv === 1) {
      // Subdivs for "Offer on the Products"
      return (
        <div className="w-full flex gap-5 justify-center items-center mt-4">
          <div className="p-4 rounded-sm bg-green-400 border-green-400 border-2 cursor-pointer">
            All Products
          </div>
          <div className="p-4 rounded-sm bg-yellow-400 border-yellow-400 border-2 cursor-pointer">
            Categorized Offer
          </div>
          <div className="p-4 rounded-sm bg-blue-400 border-blue-400 border-2 cursor-pointer">
            Single Product Offer
          </div>
        </div>
      );
    } else if (selectedDiv === 2) {
      // Subdivs for "Offer on Pre-Build PC"
      return (
        <div className="w-full flex gap-5 justify-center items-center mt-4">
          <div className="p-4 rounded-sm bg-green-400 border-green-400 border-2 cursor-pointer">
            All Prebuild PC Offers
          </div>
          <div className="p-4 rounded-sm bg-yellow-400 border-yellow-400 border-2 cursor-pointer">
            Intel Prebuild PC Offers
          </div>
          <div className="p-4 rounded-sm bg-blue-400 border-blue-400 border-2 cursor-pointer">
            AMD Prebuild PC Offers
          </div>
        </div>
      );
    } else if (selectedDiv === 3) {
      // Subdivs for "Offer on Custom Build PC"
      return (
        <div className="w-full flex gap-5 justify-center items-center mt-4">
          <div className="p-4 rounded-sm bg-green-400 border-green-400 border-2 cursor-pointer">
            All Custom Build PC Offers
          </div>
          <div className="p-4 rounded-sm bg-yellow-400 border-yellow-400 border-2 cursor-pointer">
            Intel Custom Build PC Offers
          </div>
          <div className="p-4 rounded-sm bg-blue-400 border-blue-400 border-2 cursor-pointer">
            AMD Custom Build PC Offers
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen flex flex-col gap-6 p-6 items-center">
      <h1 className="font-bold text-2xl text-center">
        <span className="text-indigo-500">Offer</span> Management System
      </h1>

      <div className="w-full flex gap-5 p-10 justify-center items-center">
        {/* Offer on the Products */}
        {(selectedDiv === null || selectedDiv === 1) && (
          <div
            className="p-4 rounded-sm flex flex-col justify-center items-center bg-cyan-400 border-cyan-400 border-2 hover:bg-transparent hover:text-cyan-400 cursor-pointer h-24 gap-2"
            onClick={() => setSelectedDiv(1)}
          >
            <MdPostAdd size={30} />
            <p className="text-center font-semibold text-xs">Offer on the Products</p>
          </div>
        )}

        {/* Offer on Pre-Build PC */}
        {(selectedDiv === null || selectedDiv === 2) && (
          <div
            className="p-4 rounded-sm flex flex-col justify-center items-center bg-rose-500 border-rose-500 border-2 hover:bg-transparent hover:text-rose-500 cursor-pointer h-24 gap-2"
            onClick={() => setSelectedDiv(2)}
          >
            <TableProperties size={30} />
            <p className="text-center font-semibold text-xs">Offer on Pre-Build PC</p>
          </div>
        )}

        {/* Offer on Custom Build PC */}
        {(selectedDiv === null || selectedDiv === 3) && (
          <div
            className="p-4 rounded-sm flex flex-col justify-center items-center bg-red-500 border-red-500 border-2 hover:bg-transparent hover:text-red-500 cursor-pointer h-24 gap-2"
            onClick={() => setSelectedDiv(3)}
          >
            <MdOutlineDashboardCustomize size={30} />
            <p className="text-center font-semibold text-xs">Offer on Custom Build PC</p>
          </div>
        )}
      </div>

      {/* Render Sub Divs based on the selected main div */}
      {renderSubDivs()}

      {/* Back button */}
      {selectedDiv !== null && (
        <button
          onClick={() => setSelectedDiv(null)}
          className="px-4 py-2 mt-4 bg-gray-800 text-white rounded hover:bg-gray-600"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default OfferManagement;
