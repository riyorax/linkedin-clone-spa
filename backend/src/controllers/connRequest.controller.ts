import * as connRequestService from '../services/connrequest.service'

export const getConnRequest = async (req, res) => {
    try {
        if (req.access == 'owner') {
            const connRequest = await connRequestService.getConnRequest(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Connection request fetched successfully",
                body: {
                    listConnRequest: connRequest,
                }
            })
        } else {
            res.status(400).json({
                success: false,
                message: "You're not allowed to see this page",
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
                message: "Connection request fetched successfully",
                body: createRequested,
            })       
        }
        res.status(400).json({
            success: false,
            message: "Cannot connect to user",
            error: null,
        })        
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching connections request.",
            error: e,
        });
    }
}