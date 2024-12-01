import React from "react";
import FeedCard from "./FeedCard";
import FeedInput from "./FeedInput";
import ProfileSidebar from "../Profile/ProfileSidebar";
import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface Users {
    full_name: string;
    profile_photo_path: string;
}
interface FetchFeedsParams {
    pageParam: number;
    limit: number;
}

interface Feed {
    id: number;
    users: Users;
    content: string;
}

interface FeedResponse {
    data: Feed[],
    nextCursor: number | null;
}

const fetchFeeds = async ({ pageParam = 0, limit = 10 }: FetchFeedsParams): Promise<FeedResponse> => {
    const { data } = await axios.get("http://localhost:3000/api/feed", {
        params: {
            cursor: pageParam > 0 ? pageParam : undefined,
            limit,
        },
    });
    return data;
};

const fetchSelfProfile = async () => {
    const response = await axios.get("http://localhost:3000/api/self/profile", {
        withCredentials: true
    });
    return response.data.body;
};

const Feed: React.FC = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["feeds", { limit: 10 }] as const,
        queryFn: ({ queryKey, pageParam }) => {
            const [, { limit }] = queryKey;
            return fetchFeeds({ pageParam, limit });
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const { 
        data: profile, 
        isLoading: profileLoading, 
        error: profileError 
    } = useQuery({
        queryKey: ['profile'],
        queryFn: fetchSelfProfile
    });

    const feeds = data?.pages.flatMap((page) => page.data) || [];

    return (
        <div className="flex flex-row justify-center min-w-max space-x-5">
            <aside className="w-64">
                <ProfileSidebar
                    full_name={profile?.name}
                    username={profile?.username}
                    profile_photo_path={profile?.profile_photo}
                    isLoading={profileLoading}
                />  
            </aside>
            <div className="flex flex-col flex-grow max-w-xl w-full">
                <FeedInput />
                <hr className="my-4 border border-gray-300" />
                {feeds.map((feed) => (
                    <FeedCard
                        key={feed.id}
                        user_name={feed.users.full_name}
                        user_profile={feed.users.profile_photo_path}
                        content={feed.content}
                    />
                ))}
                <div className="mt-4">
                    {hasNextPage && (
                        <button
                            className="p-2 bg-blue-500 text-white rounded"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage ? "Loading more..." : "Load More"}
                        </button>
                    )}
                    {!hasNextPage && <p>No more feeds to load.</p>}
                </div>
            </div>
            <div className="w-1/4 max-w-[300px] min-w-[200px]"></div>
        </div>
    );
};

export default Feed;