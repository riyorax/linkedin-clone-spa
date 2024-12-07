import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { ListUserCard } from '@/components/ListUsers/ListUserCard'
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

interface FetchFeedsParams {
    pageParam: number;
    limit: number;
    searchQuery: string | null;
}

interface Feed {
    id: number;
    full_name: string;
    username: string;
    profile_photo_path: string;
    status: string;
}

interface FeedResponse {
    success: boolean;
    message: string;
    body: {
        access: string; 
        data: Feed[];  
        nextCursor: number | null; 
    };
}

const fetchFeeds = async ({ pageParam = 0, limit = 10, searchQuery }: FetchFeedsParams): Promise<FeedResponse> => {
    const { data } = await axios.get("http://localhost:3000/api/users", {
        params: {
            cursor: pageParam > 0 ? pageParam : undefined,
            limit,
            searchQuery,
        },
        withCredentials: true
    });
    return data;
};

const Feed: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 200);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["users", { limit: 10, searchQuery: debouncedSearchQuery }] as const,
        queryFn: ({ queryKey, pageParam }) => {
            const [, { limit }] = queryKey;
            return fetchFeeds({ pageParam, limit, searchQuery: debouncedSearchQuery });
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.body.nextCursor,
    });

    const feeds = data?.pages.flatMap((page) => page.body.data) || [];
    const access = data?.pages[0]?.body.access || "public";

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
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

    return (
        <div className="container flex mx-auto px-8 lg:px-40 space-x-2 ">
            <div className="flex flex-col flex-grow w-full">
                <hr className="my-4 border border-gray-300" />
                {feeds.map((feed) => (
                    <ListUserCard
                        key={feed.id}
                        access={access}
                        id={feed.id}
                        name={feed.full_name}
                        profile_photo={feed.profile_photo_path}
                        username={feed.username}
                        status={feed.status}
                    />
                ))}
                <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
                    {isFetchingNextPage && <p>Loading...</p>}
                </div>
                {!hasNextPage && <p className="text-sm">No more user to load.</p>}
            </div>
        </div>
    );


};

export default Feed;