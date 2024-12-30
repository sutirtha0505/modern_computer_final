"use client"
import SingleProduct from '@/components/SingleProduct'
import { UseSupabase } from '@/lib/hooks/UseSupabase'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const ProductPage = () => {
    const {product_id} = useParams();
    const {singleProduct, getSingleProduct} = UseSupabase();
    useEffect(() => {
      if (product_id) {
          getSingleProduct(String(product_id));
      }
  }, [product_id, getSingleProduct])
    console.log(singleProduct);
  return (
    <div>
        <SingleProduct singleProduct = {singleProduct} />
    </div>
  )
}

export default ProductPage