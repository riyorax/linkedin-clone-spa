import { PrismaClient } from '@prisma/client';

const feedClient = new PrismaClient().feed;

export const getFeedProfile = async (id) => {
  try {
    const feeds = await feedClient.findMany({
      where: {
        user_id: id,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10,
    });

    return feeds;
  } catch (e) {
    throw e;
  }
};

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


export const editFeed = async (content, feedId) => {
    try{
        return await feedClient.update({
            where:{
                id: feedId,
            },
            data: {
                content: content,
            }
        });
    }catch (e) {
        throw e;
    }
}

export const deleteFeed = async (feedId) => {
    try{
        return await feedClient.delete({
            where:{
                id: feedId,
            }
        });
    }catch (e) {
        throw e;
    }
}

export const isOwnerFeed = async (feedId, userId) => {
    try{
        const feed = await feedClient.findFirst({
            where: {
                id: feedId,
                user_id: userId,
            },
        })
        return feed !== null
    }catch (e) {
        throw e;
    }
}