import React, { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient' // Import your Supabase client

interface Profile {
  id: string
  email: string
  role: string
}

const EditReview: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('email, role')

        if (error) {
          throw error
        }

        // Log the number of rows and selected columns
        console.log('Number of rows:', data.length)

        // Extract and log the email and user_role columns
        const rows = data.map(row => ({
          email: row.email,
          role: row.role
        }))

        console.log('Selected rows:', rows)
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
