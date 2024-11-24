import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userClient = new PrismaClient().users;

declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function () {
    return this.toString();
};

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userClient.findMany();

        res.status(200).json({ data: allUsers });
    } catch (e) {
        console.error("Error fetching users:", e);

        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while fetching users."
        });
    }
};

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

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Missing required fields: email or password.",
            });
        }

        const user = await userClient.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(404).json({
                error: "Incorrect username or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                error: "Incorrect username or password",
            });
        }

        const payload = {
            userId: user.id,
            email: user.email,
        };
        
        const generatedToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", generatedToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "strict",
        });

        res.status(200).json({
            message: "Login successful"
        });
    }
    catch (e) {
        console.error(e);

        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "An error occurred while logging in.",
        });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}

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
        console.error(e);

        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "An error occurred while updating the user.",
        });
    }
};

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
