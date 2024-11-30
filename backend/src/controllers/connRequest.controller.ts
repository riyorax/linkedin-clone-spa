import * as connRequestService from '../services/connrequest.service'

export const getConnRequest = async (req, res) => {
    try {
        if (req.user !== null) {
            const id = parseInt(req.user.userId);
            const connRequest = await connRequestService.getConnRequest(id);
            return res.status(200).json({
                success: true,
                message: "Connection request fetched successfully",
                body: {
                    listConnRequest: connRequest,
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
            message: "Something went wrong while fetching connections request.",
            error: e,
        });
    }
}

export const insertConnRequest = async (req, res) => {
    try {
        if (req.access == "unconnected") {
            const fromId = req.user.userId;
            const toId = req.params.id;
            const createRequested = await connRequestService.insertConnRequest(fromId, toId);
            return res.status(200).json({
                success: true,
                message: "Connection request sent successfully",
                body: createRequested,
            })       
        } else if (req.access == "public") {
            res.status(401).json({
                success: false,
                message: "You must be logged in to send connection requests",
                error: null,
            })        
        } else if (req.access == "connected") {
            res.status(409).json({
                success: false,
                message: "You are already connected to this user",
                error: null,
            })        
        } else {
            res.status(400).json({
                success: false,
                message: "Cannot connected to user",
                error: null,
            })        
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while inserting connections request.",
            error: e,
        });
    }
}