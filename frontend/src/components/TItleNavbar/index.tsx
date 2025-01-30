import React from 'react'

interface TitleProps {
    title: string;
}

const TitleNavbar: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className='py-4 px-5 bg-white border-b-2 border-gray-300 shadow-md'>
        <p className='font-bold text-2xl'>{title}</p>
    </div>
  )
}

export default TitleNavbar;
