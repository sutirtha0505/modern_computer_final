"use client"
import React, { useEffect, useState } from 'react'
import HeaderCart from './HeaderCart'
import CustomerDetails from './CustomerDetails'
import { supabase } from '@/lib/supabaseClient'

const CheckOutCart = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

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