import { PrismaClient } from '@prisma/client';

const userClient = new PrismaClient().users;

// getAllUsers
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userClient.findMany();
        res.status(200).json({ data: allUsers });
    }
    catch (e) {
        res.json({ error: e });
    }
};

// getUserById
export const getUserById = async (req, res) => {
    try {
        const user = await userClient.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });
        res.status(200).json({ data: user });
    }
    catch (e) {
        res.json({ error: e });
    }
};

// createUser
export const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await userClient.create({
            data: userData,
        });
        res.status(201).json({ data: newUser });
    }
    catch (e) {
        res.json({ error: e });
    }
};

// updateUser
export const updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const userData = req.body;
        const updatedUser = await userClient.update({
            where: {
                id: userId,
            },
            data: userData,
        });
        res.status(200).json({ data: updatedUser });
    }
    catch (e) {
        res.json({ error: e });
    }
};


// deleteUser
export const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        await userClient.delete({
            where: {
                id: userId,
            },
        });
        res.status(204).json({ message: 'User deleted successfully' });
    }
    catch (e) {
        res.json({ error: e });
    }
}
