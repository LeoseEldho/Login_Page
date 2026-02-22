import React from 'react'
import Header from '../Component/Header';
import Body from '../Component/Body';

const Home = () => {
  return (
    <div className='flex flex-col bg-white dark:bg-gray-800 min-h-screen justify-center relative'>
      <Header></Header>
      <Body></Body>
    </div>
  )
}

export default Home
