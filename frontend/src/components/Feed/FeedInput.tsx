import React from "react";
import FeedInputPopUp from "./FeedInputPopUp";
import { useProfile } from "@/context/ProfileContext";


const FeedInput: React.FC = ()=>{
  const { profile, isLoading } = useProfile();
  if(!isLoading){
    return (
      <div className="flex flex-col bg-white p-4 rounded-lg space-y-3 border-gray-300 border">
        <div className="flex items-center">
          <img src={profile?.profile_photo} alt="Profile" className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover mr-2"/>
          <FeedInputPopUp/>
        </div>
      </div>
    );
  }
    
};

export default FeedInput