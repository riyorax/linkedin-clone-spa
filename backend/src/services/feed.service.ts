import { PrismaClient } from "@prisma/client";

const feedClient = new PrismaClient().feed

export const getPaginatedFeeds = async (offset) => {
    return await feedClient.findMany({
        skip: parseInt(offset),
        take: 10,
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
}