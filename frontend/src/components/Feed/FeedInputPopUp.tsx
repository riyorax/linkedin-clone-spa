import React from "react";
import { useState } from "react";

const FeedInputPopUp: React.FC = ({})=>{
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () =>{
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex">
            <button className="flex-grow w-full h-12 px-4 border rounded-full text-left bg-gray-100" onClick={toggleOpen}>
                <p className="font-semibold">Start a post, try writing with AI</p>   
            </button>
            {isOpen && (
                <div>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Profile" className="w-12 h-12 rounded-full object-cover"/>
                </div>
            )}
        </div>
      );
};

export default FeedInputPopUp