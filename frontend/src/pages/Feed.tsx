import React from "react";
import { useEffect, useRef } from "react";
import FeedCard from "../components/Feed/FeedCard";
import FeedInput from "../components/Feed/FeedInput";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
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
    updated_at: string;
    user_id: number;
}

interface FeedResponse {
    success: boolean;
    message: string;
    body: {
        cursor: number | null;
        feeds: Feed[];
    }
}

const fetchFeeds = async ({ pageParam = 0, limit = 10 }: FetchFeedsParams): Promise<FeedResponse> => {
    const { data } = await axios.get("http://localhost:3000/api/feed", {
        params: {
            cursor: pageParam > 0 ? pageParam : undefined,
            limit,
        },
        withCredentials: true
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
        getNextPageParam: (lastPage) => lastPage.body.cursor,
    });

    const { profile, isLoading } = useProfile();
    const feeds = data?.pages.flatMap((page) => page.body.feeds) || [];

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            {
                threshold: 0.5,
                rootMargin: '100px'
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (!isLoading) {
        return (
            <div className="container flex mx-auto px-8 lg:px-40 space-x-2 ">
                <aside className="hidden sm:block">
                    <ProfileSidebar profile={profile} isLoading={isLoading} />
                </aside>
                <div className="flex flex-col flex-grow max-w-xl w-full">
                    <FeedInput />
                    <hr className="my-4 border border-gray-300" />
                    {feeds.map((feed) => (
                        <FeedCard
                            key={feed.id}
                            feed_id={feed.id}
                            user_name={feed.users.full_name}
                            user_profile={feed.users.profile_photo_path}
                            content={feed.content}
                            updated_at={feed.updated_at}
                            user_id={feed.user_id}
                            viewer_id={profile?.id}
                        />
                    ))}
                    {isFetchingNextPage && (
                        <div className="h-10 flex justify-center items-center w-full">
                            <p>Loading...</p>
                        </div>
                    )}
                    {!hasNextPage && (
                        <div className="h-10 flex justify-center items-center w-full">
                            <p className="text-[10px] sm:text-sm text-muted-foreground">No more feeds to load.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

};

export default Feed;