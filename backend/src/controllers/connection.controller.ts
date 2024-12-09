import * as connectionService from '../services/connection.service';
import * as userService from '../services/user.service';

export const getMutualConnection = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: null,
            });
        }
        const listConnection = await connectionService.getMutualConnection(req.params.id);
        const name = await userService.getUserById(req.params.id);
        res.status(200).json({
            success: true,
            message: "List connection data fetched successfully",
            body: {
                name: name?.full_name,
                access: req.access,
                listConnection: listConnection,
            },
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching connections.",
            error: e,
        });
    }
}

export const acceptConnection = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "You're not authenticated, log in to continue",
                error: null,
            })

        }

        const newConnection = await connectionService.acceptConnection(req.params.id, req.user.userId);
        if (!newConnection) {
            return res.status(400).json({
                success: false,
                message: "Cannot accept this connection request",
                error: null,
            })
        }

        res.status(200).json({
            success: true,
            message: "Connection request accepted successfully",
            body: {
                newConnection: newConnection,
            },
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while accepting connections.",
            error: e,
        });
    }
}

export const deleteConnection = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "You're not authenticated, log in to continue",
                error: null,
            })
        }
        const deleted = await connectionService.deleteConnection(req.params.id, req.user.userId);
        if (!deleted) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this connection",
                error: null,
            })
        }

        res.status(200).json({
            success: true,
            message: "Connection deleted successfully",
            body: null,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting connections request.",
            error: e,
        });
    }
}

export const getConnectionRecommendations = async (req, res) => {
    try {
        if (req.user !== null) {
            const id = BigInt(req.user.userId);
            const recommendation = await connectionService.getConnectionRecommendations(id);
            return res.status(200).json({
                success: true,
                message: "connections recommendation fetched successfully",
                body: {
                    recommendation: recommendation,
                }
            })
        } else {
            res.status(401).json({
                success: false,
                message: "You're not allowed to access this resource",
                error: null,
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching connections recommendation.",
            error: e,
        });
    }
}