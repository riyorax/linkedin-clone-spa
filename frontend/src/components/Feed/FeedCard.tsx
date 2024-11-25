import React from "react";

interface Props {
    user_name: string;
    user_profile: string;
    content: string;
}

const FeedCard: React.FC<Props> = ({user_name, user_profile, content})=>{
    return(
        <div className="bg-white rounded-lg mx-10 border-gray-300 border">
            <div className="flex justify-between">
                <div className="flex items-center space-x-4 my-2 mx-4">
                    <img src = {user_profile} alt = {user_name} className="w-12 h-12 object-cover rounded-full" ></img>
                    <p className="font-semibold">{user_name}</p>
                </div>  
            </div>
            <div className="mb-3 mx-3">
                <p>{content}</p>
            </div>
        </div>
    );
};

export default FeedCard