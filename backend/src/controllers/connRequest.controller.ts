import * as connRequestService from '../services/connrequest.service'

export const getConnRequest = async (req, res) => {
    try {
        console.log(req.access);
        console.log(req.params.id);
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
            return res.status(400).json({
                success: false,
                message: "You're not allowed to see this page",
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