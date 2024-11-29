import React from "react";
import FeedCard from "./FeedCard";
import FeedInput from "./FeedInput";
import ProfileSidebar from "../Profile/ProfileSidebar";

interface FeedProps {
    user_name: string;
    user_profile: string;
    content: string;
}

interface Props{
    feeds : FeedProps[];
}

const Feed: React.FC<Props> = ({feeds})=>{
    return(
       <div className="flex flex-row justify-center min-w-max">
        <aside>
        <ProfileSidebar full_name="asep" email="asep@gmail.com" username="asepgemink" profile_photo_path="p" />

        </aside>
         <div className="flex flex-col flex-grow max-w-xl w-full">
            <FeedInput/>
            <hr className="my-4 border border-gray-300"></hr>
            {feeds.map((feed, index) => (
                <FeedCard
                key={index}
                user_name={feed.user_name}
                user_profile={feed.user_profile}
                content={feed.content}
                />
            ))}
        </div>
        <div className="w-1/4 max-w-[300px] min-w-[200px]"></div>
       </div>
        
    );
};

export default Feed