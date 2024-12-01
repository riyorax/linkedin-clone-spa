import React from "react";
import FeedCard from "./FeedCard";
import FeedInput from "./FeedInput";
import ProfileSidebar from "../Profile/ProfileSidebar";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

interface FetchFeedsParams {
    pageParam: number;
    limit: number;
}

interface Feed {
    id: number;
    user_name: string;
    user_profile: string;
    content: string;
}

interface FeedResponse {
    data: Feed[],
    nextCursor: number | null;
}

const fetchFeeds = async ({ pageParam = 0, limit = 10 }: FetchFeedsParams): Promise<FeedResponse> => {
    const { data } = await axios.get("/api/feed", {
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

    const feeds = data?.pages.flatMap((page) => page.data) || [];

    return (
        <div className="flex flex-row justify-center min-w-max">
            <aside>
                <ProfileSidebar
                    full_name="asep"
                    username="asepgemink"
                    profile_photo_path="p"
                />
            </aside>
            <div className="flex flex-col flex-grow max-w-xl w-full">
                <FeedInput />
                <hr className="my-4 border border-gray-300" />
                {feeds.map((feed) => (
                    <FeedCard
                        key={feed.id}
                        user_name={feed.user_name}
                        user_profile={feed.user_profile}
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