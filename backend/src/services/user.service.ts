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
        return await userClient.update({
            where: { id },
            data: updatedData,
        });
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
