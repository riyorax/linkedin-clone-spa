import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { ListUserCard } from '@/components/ListUsers/ListUserCard'
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import { useProfile } from "@/context/ProfileContext";
import RecommendSidebar from "@/components/Recommendation/Recommendation";

interface UsersFeedsParams {
    pageParam: number;
    limit: number;
    searchQuery: string | null;
}

interface User {
    id: number;
    full_name: string;
    username: string;
    profile_photo_path: string;
    status: string;
}

interface UserResponse {
    success: boolean;
    message: string;
    body: {
        access: string;
        data: User[];
        nextCursor: number | null;
    };
}

const fetchUsers = async ({ pageParam = 0, limit = 10, searchQuery }: UsersFeedsParams): Promise<UserResponse> => {
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
            return fetchUsers({ pageParam, limit, searchQuery: debouncedSearchQuery });
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.body.nextCursor,
    });

    const users = data?.pages.flatMap((page) => page.body.data) || [];
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

    const { profile, isLoading } = useProfile();

    return (
        <div className="container mx-auto px-8 lg:px-40 space-y-2">
            <div className="flex justify-between space-x-2">
                <aside className="hidden md:block">
                    <ProfileSidebar
                        profile={profile}
                        isLoading={isLoading}
                    />
                </aside>
                <div className="flex flex-col flex-grow w-full">
                    {users.map((user) => (
                        <ListUserCard
                            key={user.id}
                            access={access}
                            id={user.id}
                            name={user.full_name}
                            profile_photo={user.profile_photo_path}
                            username={user.username}
                            status_request={user.status}
                        />
                    ))}
                    {isFetchingNextPage && (
                        <div className="h-10 flex justify-center items-center w-full">
                            <p>Loading...</p>
                        </div>
                    )}
                    {!hasNextPage && (
                        <div className="h-10 flex justify-center items-center w-full">
                            <p className="text-[10px] sm:text-sm text-muted-foreground">No more users to load.</p>
                        </div>
                    )}
                </div>
                <aside className="hidden sm:block">
                    <RecommendSidebar />
                </aside>
            </div>
        </div>
    );


};

export default Feed;