"use client"
import EditAboutSection from '@/components/EditAboutSection';
import PreventAdminAccess from '@/components/PreventAdminAccess';
import { supabase } from '@/lib/supabaseClient';
import React, { useState, useEffect } from 'react';


const EditAboutSectionPage = () => {
    const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profile, error } = await supabase
            .from('profile')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profile) {
            setRole(profile.role);
          } else if (error) {
            console.error('Error fetching profile:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) {
    return <div className='pt-16 w-full h-screen flex justify-center items-center'><h1>Loading...</h1></div>;
  }

  if (user && role === 'admin') {
    return (
      <div className='pt-16 w-full h-screen pl-4 pr-4 pb-4 flex flex-col justify-center items-center'>
        <EditAboutSection />
      </div>
    );
  } else {
    return (
      <PreventAdminAccess />
    );
  }
};


export default EditAboutSectionPage