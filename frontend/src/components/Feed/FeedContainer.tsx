import React from "react";
import FeedCard from "./FeedCard";
import FeedInput from "./FeedInput";

interface FeedProps {
    user_name: string;
    user_profile: string;
    content: string;
}

interface Props{
    feeds : FeedProps[];
}

const FeedContainer: React.FC<Props> = ({feeds})=>{
    return(
        <div className="flex flex-col">
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
    );
};

export default FeedContainer