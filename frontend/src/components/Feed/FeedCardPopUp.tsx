import React from 'react'
import { useState } from 'react'

const FeedCardPopUp: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };
    
  return (
    <div className="relative mr-2 mt-2">
        {isOpen && (
            <div className="fixed inset-0 bg-transparent z-0" onClick={toggleMenu}></div>
        )}

    <button className="p-2 hover:bg-gray-100 rounded-full" onClick={toggleMenu}>
      <img src='https://www.svgrepo.com/show/124304/three-dots.svg' className='w-3 h-3'></img>
    </button>

    {isOpen && (
      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10" onClick={(e) => e.stopPropagation()}>
        <ul className="py-2">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            Update
          </li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            Delete
          </li>
        </ul>
      </div>
    )}
    </div>
  )
}

export default FeedCardPopUp