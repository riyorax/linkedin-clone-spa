import React from "react";
import FeedCard from "./FeedCard";
import FeedInput from "./FeedInput";
import ProfileSidebar from "../Profile/ProfileSidebar";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useProfile } from "@/context/ProfileContext";

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

    const { profile, isLoading } = useProfile();
    // console.log(profile.)
    const feeds = data?.pages.flatMap((page) => page.data) || [];
    return (
        <div className="container flex mx-auto px-8 lg:px-60 space-x-2">
            <aside className="w-64">
                <ProfileSidebar profile={profile} isLoading={isLoading} />
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
        </div>
    );
};

export default Feed;