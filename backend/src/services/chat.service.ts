import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMessages = async (user1, user2) => {
    try {
        return await prisma.chat.findMany({
            where: {
                OR: [
                    {
                        from_id: user1,
                        to_id: user2,
                    },
                    {
                        from_id: user2,
                        to_id: user1,
                    },
                ],
            },
            orderBy: {
                timestamp: 'asc',
            },
        });
    } catch (e) {
        throw e;
    }
}

export const sendMessages = async (senderId, receiverId, message) => {
    try {
        return await prisma.chat.create({
            data: {
                from_id: senderId,
                to_id: receiverId,
                message: message,
            },
        });
    } catch (e) {
        throw e;
    }
}