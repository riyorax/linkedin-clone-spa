import { PrismaClient } from "@prisma/client";

const feedClient = new PrismaClient().feed

export const getPaginatedFeeds = async ({cursor, limit = 10, currentUserId}) => {
    const feeds = await feedClient.findMany({
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor} : undefined,
        take: limit,
        orderBy: { created_at: 'desc'},
        include: {
            users: {
                select: {
                    full_name: true,
                    profile_photo_path: true,
                },
            },
        },
    });
    return feeds.map(feed => ({
        ...feed,
        isOwner: feed.user_id === currentUserId,
    }));
}