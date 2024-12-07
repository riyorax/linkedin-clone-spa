import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const userClient = new PrismaClient().users;

export const getAllUsers = async () => {
    try {
        return await userClient.findMany();
    } catch (e) {
        throw e;
    }
};

export const getUserById = async (id: number) => {
    try {
        return await userClient.findUnique({
            where: { id },
        });
    } catch (e) {
        throw e;
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        return await userClient.findFirst({
            where: { email },
        });
    } catch (e) {
        throw e;
    }
};

export const getUserByUsername = async (username: string) => {
    try {
        return await userClient.findFirst({
            where: { username },
        });
    } catch (e) {
        throw e;
    }
};

export const createUser = async (username: string, email: string, fullname: string, password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        return await userClient.create({
            data: {
                username,
                email,
                full_name: fullname,
                password_hash,
            },
        });
    } catch (e) {
        throw e;
    }
};

export const updateUserData = async (id: number, updatedData: any) => {
    try {
        const updatedUser = await userClient.update({
            where: { id },
            data: updatedData,
        });

        return updatedUser;
    } catch (e) {
        throw e;
    }
};

export const deleteUserById = async (id: number) => {
    try {
        return await userClient.delete({
            where: { id },
        });
    } catch (e) {
        throw e;
    }
};

export const fetchUsers = async (
    searchQuery: string | undefined,
    userId: number | undefined,
    cursor: number | undefined,
    limit: number = 10
) => {
    try {
        const users = await userClient.findMany({
            where: searchQuery
                ? {
                    full_name: {
                        contains: searchQuery,
                        mode: 'insensitive',
                    },
                }
                : undefined,
            select: {
                id: true,
                full_name: true,
                username: true,
                profile_photo_path: true,
                connection_connection_from_idTousers: userId
                    ? {
                        where: {
                            to_id: userId,
                        },
                        select: {
                            from_id: true,
                        },
                    }
                    : false,

                connection_request_connection_request_from_idTousers: userId
                    ? {
                        where: {
                            to_id: userId,
                        },
                        select: {
                            from_id: true,
                            to_id: true,
                        },
                    }
                    : false,

                connection_request_connection_request_to_idTousers: userId
                    ? {
                        where: {
                            from_id: userId,
                        },
                        select: {
                            from_id: true,
                            to_id: true,
                        },
                    }
                    : false,
            },
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            take: limit,
            orderBy: { id: 'desc' },
        });

        const nextCursor = users.length === limit ? users[users.length - 1].id : null;

        return {
            users: users.map((user) => ({
                id: user.id,
                full_name: user.full_name,
                username: user.username,
                profile_photo_path: user.profile_photo_path,
                status:
                    userId
                    ? BigInt(user.id) === BigInt(userId)
                        ? "public"
                        : user.connection_connection_from_idTousers?.length > 0
                            ? "connected"
                            : user.connection_request_connection_request_from_idTousers?.length
                                ? "pending"
                                : user.connection_request_connection_request_to_idTousers?.length
                                    ? "sent"
                                    : "unconnected"
                    : "public"
            })),
            nextCursor,
        };
    } catch (e) {
        throw e;
    }
};