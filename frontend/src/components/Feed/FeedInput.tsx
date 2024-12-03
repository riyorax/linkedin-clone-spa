import React from "react";
import FeedInputPopUp from "./FeedInputPopUp";

const FeedInput: React.FC = ({})=>{
    return (
        <div className="flex flex-col bg-white p-4 rounded-lg space-y-3 border-gray-300 border">
          <div className="flex items-center">
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Profile" className="w-12 h-12 rounded-full object-cover mr-2"/>
            <FeedInputPopUp/>
          </div>
        </div>
      );
};

export default FeedInput