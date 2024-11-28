import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const userClient = new PrismaClient().users;

export const getAllUsers = async () => {
    return await userClient.findMany();
};

export const getUserById = async (id: number) => {
    return await userClient.findUnique({
        where: { id },
    });
};

export const getUserByEmail = async (email: string) => {
    return await userClient.findFirst({
        where: { email },
    });
};

export const getUserByUsername = async (username: string) => {
    return await userClient.findFirst({
        where: { username },
    });
};

export const createUser = async (username: string, email: string, fullname: string, password: string) => {
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
};

export const updateUserData = async (id: number, updatedData: any) => {
    return await userClient.update({
        where: { id },
        data: updatedData,
    });
};

export const deleteUserById = async (id: number) => {
    return await userClient.delete({
        where: { id },
    });
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};
