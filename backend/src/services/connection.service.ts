import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getConnection = async (from_id, to_id) => {
    try {
        return await prisma.connection.findFirst({
            where: {
                from_id: BigInt(from_id),
                to_id: BigInt(to_id),
            },
        });
    } catch (e) {
        throw e;
    }
}

interface MutualConnectionResult {
    mutual_connections: BigInteger;
}

export const countMutualConnections = async (userId) => {
    try {
        const mutual = await prisma.$queryRaw<MutualConnectionResult[]>`
            SELECT COUNT(*) AS mutual_connections
            FROM connection c1
            JOIN connection c2
              ON c1.from_id = c2.to_id
              AND c1.to_id = c2.from_id
            WHERE c1.from_id = ${userId};
        `;
        
        const count = Number(mutual[0].mutual_connections);
        return count;
    } catch (e) {
        throw e;
    }
};

export const getMutualConnection = async (userId) => {
    try {
        const mutual = await prisma.$queryRaw`
            SELECT u.full_name, u.profile_photo_path
            FROM users u
            JOIN (
                SELECT c1.to_id
                FROM connection c1
                JOIN connection c2
                ON c1.from_id = c2.to_id
                AND c1.to_id = c2.from_id
                WHERE c1.from_id = ${userId}
            ) m
            ON u.id = m.to_id;
        `;

        return mutual;
    } catch (e) {
        throw e;
    }
}

export const acceptConnection = async (fromId: number, toId: number) => {
    try {
        const newConnection = await prisma.$transaction(async (tx) => {
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

            // insert connection
            const insertedConnections = await tx.connection.createManyAndReturn({
                data: [
                    { from_id: fromId, 
                        to_id: toId, 
                        created_at: new Date() 
                    },
                    { from_id: toId, 
                        to_id: fromId, 
                        created_at: new Date() 
                    },
                ],
            });

            // delete from request
            await tx.connection_request.deleteMany({
                where: {
                    OR: [
                        { from_id: fromId, to_id: toId },
                        { from_id: toId, to_id: fromId },
                    ],
                },
            });

            return insertedConnections;
        });

        return newConnection;
    } catch (e) {
        console.log("heafkjnakjnre")
        throw e;        
    }
}