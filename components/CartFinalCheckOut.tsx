import { useAppSelector } from '@/lib/hooks/redux'
import { getCart } from '@/redux/cartSlice'
import React from 'react'

const CartFinalCheckOut = () => {
    const cart = useAppSelector(getCart);
  return (
    <div className='w-full flex justify-center items-center p-6 flex-wrap'>
        <div className='w-full md:w-1/2 flex flex-col overflow-y-auto'>

        </div>
        <div>

        </div>
    </div>
  )
}

export default CartFinalCheckOut