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
};

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
            SELECT u.id, u.full_name, u.username, u.profile_photo_path
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
};

export const acceptConnection = async (fromId: number, toId: number) => {
  try {
    const newConnection = await prisma.$transaction(async (tx) => {
      // validate request connection
      const isExist = await tx.connection_request.findFirst({
        where: {
          from_id: fromId,
          to_id: toId,
        },
      });

      if (!isExist) {
        return;
      }

      // insert connection
      const insertedConnections = await tx.connection.createManyAndReturn({
        data: [
          {
            from_id: fromId,
            to_id: toId,
            created_at: new Date(),
          },
          {
            from_id: toId,
            to_id: fromId,
            created_at: new Date(),
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
    throw e;
  }
};

export const getAllConnections = async (userId) => {
  try {
    const connections = await prisma.connection.findMany({
      where: {
        OR: [{ from_id: BigInt(userId) }],
      },
    });

    return connections;
  } catch (e) {
    console.error("Error fetching connections:", e);
    throw e;
  }
};

export const deleteConnection = async (fromId: number, toId: number) => {
  try {
    const deleted = await prisma.$transaction(async (tx) => {
      // validate request connection
      const isExist = await tx.connection.findFirst({
        where: {
          from_id: fromId,
          to_id: toId,
        },
      });

      if (!isExist) {
        return;
      }

      // delete from request
      const deleted = await tx.connection.deleteMany({
        where: {
          OR: [
            { from_id: fromId, to_id: toId },
            { from_id: toId, to_id: fromId },
          ],
        },
      });

      return deleted;
    });

    return deleted;
  } catch (e) {
    throw e;
  }
};

export const getConnectionRecommendations = async (userId: bigint) => {
  try {
    const directConnections = await prisma.connection.findMany({
      where: {
        from_id: userId,
      },
    });

    const directConnectionIds = directConnections.map((conn) => conn.to_id);

    const secondDegreeConnections = await prisma.connection.findMany({
      where: {
        AND: [
          { from_id: { in: directConnectionIds } },
          { to_id: { notIn: [...directConnectionIds, userId] } },
        ],
      },
      include: {
        users_connection_to_idTousers: {
          select: {
            id: true,
            full_name: true,
            username: true,
            profile_photo_path: true,
          },
        },
      },
    });

    const secondDegreeUsers = Array.from(
      new Map(
        secondDegreeConnections.map((conn) => [
          conn.to_id,
          {
            level: 2,
            ...conn.users_connection_to_idTousers,
          },
        ]),
      ).values(),
    );

    const secondDegreeConnectionIds = secondDegreeUsers.map((user) => user.id);

    const thirdDegreeConnections = await prisma.connection.findMany({
      where: {
        AND: [
          { from_id: { in: secondDegreeConnectionIds } },
          {
            to_id: {
              notIn: [
                ...directConnectionIds,
                ...secondDegreeConnectionIds,
                userId,
              ],
            },
          },
        ],
      },
      include: {
        users_connection_to_idTousers: {
          select: {
            id: true,
            full_name: true,
            username: true,
            profile_photo_path: true,
          },
        },
      },
    });

    const thirdDegreeUsers = Array.from(
      new Map(
        thirdDegreeConnections.map((conn) => [
          conn.to_id,
          {
            level: 3,
            ...conn.users_connection_to_idTousers,
          },
        ]),
      ).values(),
    );

    const recommendations = [...secondDegreeUsers, ...thirdDegreeUsers];
    const top10Recommendations = recommendations.slice(0, 10);

    return top10Recommendations;
  } catch (error) {
    throw error;
  }
};

