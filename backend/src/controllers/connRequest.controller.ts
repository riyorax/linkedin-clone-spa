import * as connRequestService from '../services/connrequest.service'

export const getConnRequest = async (req, res) => {
    try {
        if (req.user !== null) {
            const id = parseInt(req.user.userId);
            const connRequest = await connRequestService.getConnRequestUser(id);
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
                message: "Cannot sent connection request to user",
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

export const deleteConnRequest = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "You're not authenticated, log in to continue",
                error: null,
            })
        }
        const deleted = await connRequestService.deleteConnRequest(req.params.id, req.user.userId);
        if (!deleted) {
            return res.status(400).json({
                success: false,
                message: "Cannot reject this connection request",
                error: null,
            })            
        }

        res.status(200).json({
            success: true,
            message: "Connection request rejected successfully",
            body: {
                deleted: deleted,
            },
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while rejecting connections request.",
            error: e,
        });
    }
}