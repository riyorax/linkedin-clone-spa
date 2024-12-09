import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    req.user = null;
    if (token == null) {
        res.status(401)
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403)
            return next(); 
        }

        req.user = decoded; 
        next(); 
    });
};
