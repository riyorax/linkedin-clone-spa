import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const generateToken = (payload, options = {}) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const defaultOptions = {
        expiresIn: "1h",
    };

    const jwtOptions = { ...defaultOptions, ...options };
    return jwt.sign(payload, secret, jwtOptions);
}

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};
