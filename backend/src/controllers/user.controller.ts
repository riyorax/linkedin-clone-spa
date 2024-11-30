import { request, Request, Response } from 'express';
import * as userService from '../services/user.service';
import * as authService from '../services/auth.service';
import * as connectionService from '../services/connection.service';
import * as connRequestService from '../services/connrequest.service';
import '../utils/bigIntUtils';

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userService.getAllUsers();
        res.status(200).json({
            data: allUsers
        });
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "Something went wrong while fetching users."
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: null,
            });
        }
        const countConnection = await connectionService.countMutualConnections(id);
        const response = {
            success: true,
            message: "User data fetched successfully",
        };
        const responseBody = {
            username: user.username,
            name: user.full_name,
            work_history: user.work_history,
            skills: user.skills,
            connection_count: countConnection,
            profile_photo: user.profile_photo_path,
            access: req.access,
        };

        if (req.access === "public") {
            return res.status(200).json({
                ...response,
                body: responseBody,
            });
        } else if (req.access === "unconnected") {
            const statusRequest = await connRequestService.getConnRequest(id, req.user.userId);
            let request = "";
            if (statusRequest) {
                request = "pending";
            } else {
                const sendRequest = await connRequestService.getConnRequest(req.user.userId, id);
                if (sendRequest) {
                    request = "sent";
                }
            }
            return res.status(200).json({
                ...response,
                body: {
                    ...responseBody,
                    relevant_posts: null,
                    status_request: request,
                },
            });
        } else {
            return res.status(200).json({
                ...response,
                body: {
                    ...responseBody,
                    relevant_posts: null,
                },
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Something went wrong while fetching users.",
            error: e,
        });
    }
};

export const register = async (req, res) => {
    try {
        const { username, email, name: fullname, password, confirmPassword } = req.body;
        const newUser = await userService.createUser(username, email, fullname, password);
        const payload = {
            userId: newUser.id,
            email: newUser.email,
        };

        const generatedToken = authService.generateToken(payload);

        res.cookie("token", generatedToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            body: {
                token: generatedToken,
            },
        });
    } catch (e) {
        if (e.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: e.message || "User with the given username or email already exists.",
                error: e,
            });
        }

        res.status(500).json({
            success: false,
            message: e.message || "Something went wrong while creating the user.",
            error: e,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "Incorect email or password",
                error: "Incorect email or password",
            });
        }

        const isMatch = await authService.comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: "Incorect email or password",
                error: "Incorect email or password",
            });
        }

        const payload = {
            userId: user.id,
            email: user.email,
        };
        const generatedToken = authService.generateToken(payload);

        res.cookie("token", generatedToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            body: {
                token: generatedToken,
            },
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: e.message || "Internal Server Error",
            error: e,
        });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}

export const updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { username, email, password } = req.body;

        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const currentUser = await userService.getUserById(userId);
        if (!currentUser) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        if (username && username !== currentUser.username) {
            const existingUser = await userService.getUserByUsername(username);
            if (existingUser) {
                return res.status(409).json({
                    error: "Username already exists",
                });
            }
        }

        if (email && email !== currentUser.email) {
            const existingUser = await userService.getUserByEmail(email);
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

        const updatedUser = await userService.updateUserData(userId, { username, email });

        res.status(200).json({ data: updatedUser });
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message || "An error occurred while updating the user.",
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        await userService.deleteUserById(userId);

        res.status(204).send();
    } catch (e) {
        res.status(500).json({
            error: "Internal Server Error",
            message: e.message
        });
    }
};
