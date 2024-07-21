import { useState } from "react";
import { supabase } from "../supabaseClient";

export const UseSupabase = () => {
  const [products, setProducts] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [singleProduct, setSingleProduct] = useState<any>(null);

  const getDataFromSupabase = async () => {
    let { data, error } = await supabase.from("products").select("*");
    if (data) {
      setProducts(data);
      console.log(data);
    }
    if (error) {
      console.log(error);
    }
  };

  const getFilterData = async (query: string) => {
    const decodedQuery = decodeURIComponent(query); // Decode the URL-encoded query string
    let { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`product_name.ilike.%${decodedQuery}%, product_description.ilike.%${decodedQuery}%, product_category.ilike.%${decodedQuery}%`);
    if (data) {
      setFilterData(data);
      console.log(data);
    }
    if (error) {
      console.log(error);
    }
  };

  const getSingleProduct = async (product_id: string) => {
    try {
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("product_id", product_id)
        .single(); // This assumes product_id is unique and returns a single product
      if (data) {
        setSingleProduct(data);
      }
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    products,
    getDataFromSupabase,
    filterData,
    getFilterData,
    singleProduct,
    getSingleProduct,
  };
};
