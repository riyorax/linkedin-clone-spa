import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getConnRequest = async (userId) => {
    try {
        const connRequest = await prisma.$queryRaw`
            SELECT u.full_name, u.profile_photo_path
             FROM users u
             JOIN (
                SELECT r.from_id
                FROM connection_request r
                WHERE r.to_id = ${userId}
             ) res
             ON u.id = res.from_id;
            `
        
        return connRequest;
    } catch (e) {
        throw e;
    }
}

export const insertConnRequest = async (fromId: number, toId: number) => {
    try {
        return await prisma.connection_request.create({
            data: {
                from_id: fromId,
                to_id: toId,
                created_at: new Date(),
            }
        })
    } catch (e) {
        throw e;        
    }
}