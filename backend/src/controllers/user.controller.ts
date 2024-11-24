import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const userClient = new PrismaClient().users;

declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function () {
    return this.toString();
};


// getAllUsers
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const allUsers = await userClient.findMany();
        
        // Return the data in the response
        res.status(200).json({ data: allUsers });
    } catch (e) {
        // Log the error for debugging purposes
        console.error("Error fetching users:", e);

        // Send a specific error message in the response
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while fetching users."
        });
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
        const { username, email, password } = req.body;

        // Check for required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Missing required fields: username, email, or password.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters long.",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await userClient.create({
            data: {
                username,
                email,
                password_hash,
            },
        });

        res.status(201).json({
            message: "User created successfully",
            data: newUser,
        });

    } catch (e) {
        if (e.code === 'P2002') {
            return res.status(409).json({
                error: "User with the given username or email already exists.",
            });
        }
        console.error(e);

        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while creating the user.",
        });
    }
};


// updateUser
export const updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { username, email, password } = req.body;

        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const currentUser = await userClient.findUnique({
            where: { id: userId },
        });

        if (!currentUser) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        if (username && username !== currentUser.username) {
            const existingUser = await userClient.findFirst({
                where: { username },
            });
            if (existingUser) {
                return res.status(409).json({
                    error: "Username already exists",
                });
            }
        }

        if (email && email !== currentUser.email) {
            const existingUser = await userClient.findFirst({
                where: { email },
            });
            if (existingUser) {
                return res.status(409).json({
                    error: "Email already exists",
                });
            }
        }

        // Prepare updated data
        // Belum handle udpate password
        const userData = {
            username: username || currentUser.username,
            email: email || currentUser.email,
            password_hash: currentUser.password_hash,
        };

        const updatedUser = await userClient.update({
            where: { id: userId },
            data: userData,
        });

        res.status(200).json({ data: updatedUser });

    } catch (e) {
        console.error(e);  // Log error for debugging purposes

        // Handle and return error to the client
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "An error occurred while updating the user.",
        });
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
