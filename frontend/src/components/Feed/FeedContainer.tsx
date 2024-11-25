import React from "react";
import FeedCard from "./FeedCard";

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
        <div>
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