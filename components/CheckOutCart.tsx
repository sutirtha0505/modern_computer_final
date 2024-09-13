"use client"
import React, { useEffect, useState } from 'react'
import HeaderCart from './HeaderCart'
import CustomerDetails from './CustomerDetails'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const CheckOutCart = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();  // Initialize router

  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        
        // If no user is found, redirect to /SignIn
        if (!user) {
          router.push('/SignIn');
        } else {
          setUser(user);
          console.log('User ID:', user.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [router]); // Added router as a dependency

  if (loading) {
    return <div>Loading...</div>;  // Optionally display loading state
  }

  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-6'>
      <HeaderCart />
      <div className='w-full pt-16'>
        <h1 className='text-2xl font-bold text-center'>
          Checkout for <span className='text-indigo-500'>Cart Items</span>
        </h1>
        <CustomerDetails />
      </div>
    </div>
  )
}

export default CheckOutCart;
