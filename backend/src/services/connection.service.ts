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