import React from 'react'
import HeaderCart from './HeaderCart'
import CustomerDetails from './CustomerDetails'

const CheckOutCart = () => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-6'>
      <HeaderCart />
      <div className='w-full pt-16'>
      <h1 className='text-2xl font-bold text-center'>Checkout for <span className='text-indigo-500'>Cart Items</span></h1>
      <CustomerDetails />
      </div>
    </div>
  )
}

export default CheckOutCart