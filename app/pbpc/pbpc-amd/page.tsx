import PBPCAMDDisplay from '@/components/PBPCAMDDisplay'
import React from 'react'

const PreBuildAMDPC = () => {
  return (
    <div className='pt-16 w-full h-full justify-center items-center flex flex-col gap-6'>
      <h1 className='p-5 text-2xl text-center font-extrabold'>Choose Your favourite <span className='text-orange-400'>Pre-Build <span className='text-indigo-500'>AMD</span> </span> PC </h1>
      <PBPCAMDDisplay />
    </div>
  )
}

export default PreBuildAMDPC