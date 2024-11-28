import * as connectionService from '../services/connection.service'

export const accessProfile = async (req, res, next) => {
    try {
        let access;
        if (!req.user) {
            // Unauthenticated
            access = "public";
        } else {
            // Authenticated
            const authId = req.user.userId;
            const reqId = req.params.id;
            if (reqId !== authId) {
                // Authenticated user is not the owner
                const from = await connectionService.getConnection(authId, reqId);
                const to = await connectionService.getConnection(reqId, authId);

                if (!from || !to) {
                    // not connected
                    access = "unconnected";
                } else { 
                    // connected
                    access = "connected";
                }
            } else {
                // owner
                access = "owner";
            }
        }

        req.access = access;
        next();
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message ||  "Internal Server Error",
            error: e,
        });
    }
};
