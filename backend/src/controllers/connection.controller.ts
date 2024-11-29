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