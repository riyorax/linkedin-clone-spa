import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Get token from cookies
    const token = req.cookies.token
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded
        next()
    })
}