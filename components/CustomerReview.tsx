"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import CharacterCounterInput from './CharacterCounterInput';
import { supabase } from '@/lib/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerReview: React.FC = () => {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-screen h-screen p-5 gap-10 text-center flex justify-center items-center flex-col'>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className='font-bold text-3xl'>Share <span className='text-indigo-600'>Your Experience</span> with Us</h1>
      <div className='flex gap-4 justify-center items-center flex-wrap'>
        <Image 
          src="https://keteyxipukiawzwjhpjn.supabase.co/storage/v1/object/public/product-image/Review/call-center-7040784_1920.png" 
          width={1000} 
          height={1000} 
          alt="Review Image" 
          className='w-64 h-64 md:w-96 md:h-96' 
        />
        <div className='flex flex-col p-4 w-96 h-64 md:w-96 md:h-96 rounded-md'>
          <CharacterCounterInput user={user} />
        </div>
      </div>
    </div>
  );
}

export default CustomerReview;
    