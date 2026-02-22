import React, { useContext } from 'react'
import { UserContext } from '../Context/AppContext';

const Body = () => {
  const { userData } = useContext(UserContext)

  return (
    <div className='min-h-max flex flex-col justify-center items-center p-3'>
      <h3 className=' font-bold text-[20px] text-white md:text-3xl '>Hey Users <p className='text-green-300 inline' 
      >{ userData?.name}</p></h3>
      <h1 className=' font-bold text-[32px] text-white mb-5 sm:text-4xl md:text-6xl'>Welcome to our app</h1>
      <p className=' font-sm text-[16px] text-white text-center md:text-2xl'>Small savings today lead to big financial freedom tomorrow.</p>
      <button className='btn mt-10'>Get Started</button>
    </div>
  )
}

export default Body
