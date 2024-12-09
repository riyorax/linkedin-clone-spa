import React from "react";
import FeedCardPopUp from "./FeedCardPopUp";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";

interface Props {
    feed_id: number;
    user_name: string;
    user_profile: string;
    content: string;
    updated_at: string;
    user_id: number;
    viewer_id: number | undefined;
}

const FeedCard: React.FC<Props> = ({ feed_id, user_name, user_profile, content, updated_at, user_id, viewer_id }) => {
    const navigate = useNavigate();
    function postedTime(updated_at: string): string {
        const now = new Date();
        const updated_at_time = new Date(updated_at);
        const timeDiff = now.getTime() - updated_at_time.getTime();

        const timeDiffSeconds = Math.floor(timeDiff / 1000);
        const timeDiffMinutes = Math.floor(timeDiffSeconds / 60);
        const timeDiffHours = Math.floor(timeDiffMinutes / 60);
        const timeDiffDays = Math.floor(timeDiffHours / 24);

        if (timeDiffSeconds < 60) {
            return `${timeDiffSeconds} seconds ago`;
        }

        if (timeDiffMinutes < 60) {
            return `${timeDiffMinutes} minutes ago`;
        }

        if (timeDiffHours < 24) {
            return `${timeDiffHours} hours ago`;
        }

        return `${timeDiffDays} days ago`;
    }
    return (
        <div className="bg-white rounded-lg border-gray-300 border my-1">
            <div className="flex justify-between">
                <div className="flex items-center space-x-4 my-4 mx-4 cursor-pointer" onClick={() => navigate(`/profile/${user_id}`)}>
                    <Avatar className="w-8 h-8 sm:w-12 sm:h-12 text-[8px] sm:text-sm flex items-center justify-center object-cover rounded-full border-2 border-white shadow-md bg-neutral-100">
                        <AvatarImage className="rounded-full" src={user_profile} alt={user_name} />
                        <AvatarFallback>{user_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm sm:text-l font-semibold">{user_name}</p>
                        <p className="text-[10px] sm:text-sm text-gray-500">{postedTime(updated_at)}</p>
                    </div>
                </div>
                {user_id === viewer_id && <FeedCardPopUp feed_id={feed_id} currentContent={content} />}
            </div>
            <div className="mb-3 mx-3">
                <p className="text-[10px] sm:text-sm text-muted-foreground">{content}</p>
            </div>

        </div>
    );
};

export default FeedCard