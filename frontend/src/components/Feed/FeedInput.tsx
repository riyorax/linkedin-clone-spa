import React from "react";
import FeedInputPopUp from "./FeedInputPopUp";
import { useProfile } from "@/context/ProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


const FeedInput: React.FC = () => {
  const { profile, isLoading } = useProfile();
  if (!isLoading) {
    return (
      <div className="flex flex-col bg-white p-4 rounded-lg space-y-3 border-gray-300 border">
        <div className="flex items-center space-x-2">
          <Avatar className="w-7 h-7 text-[8px] sm:text-sm sm:w-11 sm:h-10 flex items-center justify-center rounded-full border-2 border-white shadow-md bg-neutral-100">
            <AvatarImage className="rounded-full" src={profile?.profile_photo} alt={profile?.name} />
            <AvatarFallback>{profile?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <FeedInputPopUp />
        </div>
      </div>
    );
  }

};

export default FeedInput