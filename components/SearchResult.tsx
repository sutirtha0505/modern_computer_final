import React from "react";
import ProductCard from "./ProductCard";

const SearchResult = ({ filterData }: { filterData: any }) => {
  return (
    <div className="pt-20 pb-20 flex justify-center">
      <div className="flex flex-col gap-4 items-center w-[80%]">
        <div className="flex flex-col gap-2 items-center">
          <h1 className=" font-extrabold text-3xl">Results: {filterData.length}</h1>
          <p>
            Price and other details may vary based on product size and quantity
          </p>
        </div>
        <div className="flex gap-3 flex-wrap p-1 items-center justify-center">
          {
            filterData.map((products: any) =>{
              return (
                <div key={products.product_id} >
                  <ProductCard products={products}/>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
