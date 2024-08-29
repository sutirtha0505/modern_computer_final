import React, { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient' // Import your Supabase client

const EditReview = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
        
        if (error) {
          throw error
        }
        
        console.log('Number of rows:', data.length)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>EditReview</div>
  )
}

export default EditReview
