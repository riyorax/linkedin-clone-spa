import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getConnRequest = async (userId) => {
    try {
        const connRequest = await prisma.$queryRaw`
            SELECT u.full_name, u.profile_photo_path
             FROM users u
             JOIN (
                SELECT r.from_id, r.created_at
                FROM connection_request r
                WHERE r.to_id = ${userId}
             ) res
             ON u.id = res.from_id
             ORDER BY res.created_at;
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

export const deleteConnRequest = async (fromId: number, toId: number) => {
    try {
        const deleted = await prisma.$transaction(async (tx) => {
            // validate request connection
            const isExist = await tx.connection_request.findFirst({
                where: {
                    from_id: fromId,
                    to_id: toId,
                }
            })

            if (!isExist) {
                return;
            }

            // delete from request
            const deleted = await tx.connection_request.delete({
                where: {
                    from_id_to_id: {
                        from_id: fromId,
                        to_id: toId,
                    },
                },
            });

            return deleted;
        });

        return deleted;
    } catch (e) {
        throw e;        
    }
}