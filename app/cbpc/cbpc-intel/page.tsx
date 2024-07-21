
import CPCIntelDisplay from '@/components/CPCIntelDisplay'
import React from 'react'

const CustomBuildIntelPC = () => {
  return (
    <div className='pt-16 w-full h-full justify-center items-center flex flex-col gap-6'>
      <h1 className='p-5 text-2xl text-center font-extrabold'>Build your own favourite <span className='text-indigo-500'>Intel </span> PC </h1>
      <CPCIntelDisplay />
    </div>
  )
}

export default CustomBuildIntelPC