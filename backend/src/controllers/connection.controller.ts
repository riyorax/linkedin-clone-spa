import { Request, Response } from 'express';
import * as connectionService from '../services/connection.service';

export const getMutualConnection = async (req: Request, res: Response) => {
    try {
        const listConnection = await connectionService.getMutualConnection(req.params.id);
        res.status(200).json({
            success: true,
            message: "List connection data fetched successfully",
            body: {
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