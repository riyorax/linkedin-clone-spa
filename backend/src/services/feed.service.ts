import { PrismaClient } from "@prisma/client";

const feedClient = new PrismaClient().feed

export const getPaginatedFeeds = async ({cursor, limit = 10}) => {
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
                    id: true,
                },
            },
        },
    });
    return feeds;
}

export const insertNewFeed = async (content, userId) =>{
    try {
        return await feedClient.create({
            data: {
                content,
                user_id: userId,
                updated_at: new Date(),
            },
        });
    } catch (e) {
        throw e;
    }
}