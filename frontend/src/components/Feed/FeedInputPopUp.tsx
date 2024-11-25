import React from "react";
import { useState } from "react";

const FeedInputPopUp: React.FC = ({})=>{
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () =>{
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <button className="flex-grow w-full h-12 px-4 border rounded-full text-left bg-white border-gray-400 hover:bg-gray-100" onClick={toggleOpen}>
                <p className="font-semibold text-gray-700 px-2">Start a post, try writing with AI</p>   
            </button>
            {isOpen && (
                <div className="fixed inset-0 flex items-start pt-10 justify-center bg-opacity-50 bg-black z-10" onClick={toggleOpen}>
                    <div className="bg-white rounded-lg shadow-lg w-[600px] p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-row items-center">
                                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Profile" className="w-12 h-12 rounded-full object-cover"/>
                                <div className="ml-3">
                                    <h3 className="font-semibold">Maximilian Sulistiyo</h3>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-gray-700 text-right" onClick={toggleOpen}>
                                ✕
                            </button>
                        </div>
                        <textarea placeholder="What do you want to talk about?" className="w-full mt-4 rounded-lg p-3 resize-none placeholder-gray-600 focus:outline-none" rows={4}></textarea>
                        <div className="flex items-center justify-end mt-4">
                            <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
};

export default FeedInputPopUp