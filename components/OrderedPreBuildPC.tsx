import React from 'react'
import { supabase } from '@/lib/supabaseClient';

interface OrderedPreBuildPCProps {
    userId: string;
}

const OrderedPreBuildPC: React.FC<OrderedPreBuildPCProps> = ({userId}) => {
  return (
    <div className='flex flex-col justify-center items-center gap-4'>
        <h1 className="text-lg font-bold">
          Your <span className="text-indigo-600">Ordered Pre-Build PC</span>
        </h1>
    </div>
  )
}

export default OrderedPreBuildPC