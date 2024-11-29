import * as userService from '../services/user.service';

export const isFilledUsername = (req, res) => {
    if (!req.body.username) {
        return res.status(200).json({
            success: false,
            message: "Missing required fields: username",
            body: {
                token: null,
            },
        });
    }
};

export const isFilledEmail = (req, res) => {
    console.log(req.body);
    if (!req.body.email) {
        return res.status(200).json({
            success: false,
            message: "Missing required fields: email",
            body: {
                token: null,
            },
        });
    }
};

export const isFilledFullname = (req, res) => {
    if (!req.body.fullname) {
        return res.status(200).json({
            success: false,
            message: "Missing required fields: fullname",
            body: {
                token: null,
            },
        });
    }
};

export const isFilledPassword = (req, res) => {
    if (!req.body.password) {
        return res.status(200).json({
            success: false,
            message: "Missing required fields: password",
            body: {
                token: null,
            },
        });
    }
};

export const isFilledConfirmPassword = (req, res) => {
    if (!req.body.confirmPassword) {
        return res.status(200).json({
            success: false,
            message: "Missing required fields: confirmPassword",
            body: {
                token: null,
            },
        });
    }
};

export const passwordLength = (req, res) => {
    if (req.body.password.length < 8) {
        return res.status(200).json({
            success: false,
            message: "Password must be at least 8 characters long",
            body: {
                token: null,
            },
        });
    }
};

export const comparePassword = (req, res) => {
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(200).json({
            success: false,
            message: "Passwords do not match",
            body: {
                token: null,
            },
        });
    }
};

export const emailExist = async (req, res) => {
    try {
        const existingUser = await userService.getUserByEmail(req.body.email);
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: "User with the given email already exists.",
                body: {
                    token: null,
                },
            });
        }
    } catch (e) {
        throw e;
    }
};

export const usernameExist = async (req, res) => {
    try {
        const existingUser = await userService.getUserByUsername(req.body.username);
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: "User with the given username already exists.",
                body: {
                    token: null,
                },
            });
        }
    } catch (e) {
        throw e;
    }
};

export const validateParamId = (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({
            success: false,
            message: "Missing required parameter: id",
            error: null,
        });
    }

    let reqId;
    try {
        reqId = BigInt(req.params.id);
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Parameter id must be a valid integer that can be converted to BigInt",
            error: e,
        });
    }

    req.params.id = reqId;
    next();
};


export const validateRegister = async (req, res, next) => {
    if (await isFilledUsername(req, res)) return;
    if (await isFilledEmail(req, res)) return;
    if (await isFilledFullname(req, res)) return;
    if (await isFilledPassword(req, res)) return;
    if (await isFilledConfirmPassword(req, res)) return;
    if (await passwordLength(req, res)) return;
    if (await comparePassword(req, res)) return;
    if (await usernameExist(req, res)) return;
    if (await emailExist(req, res)) return;

    next();
};

export const validateLogin = async (req, res, next) => {
    if (await isFilledEmail(req, res)) return;
    if (await isFilledPassword(req, res)) return;

    next();
};

export const validateFeedParam = async (req, res, next) => {
    const { limit, cursor } = req.query;

    if(!limit){
        return res.status(400).json({
            success: false,
            message: "Missing required parameter: limit",
            error: null,
        })
    }

    if(isNaN(Number(limit))){
        return res.status(400).json({
            success: false,
            message: "Limit must be a number",
            error: null,
        })
    }

    if (cursor && isNaN(Number(cursor))) {
        return res.status(400).json({
            success: false,
            message: "Cursor must be a number",
            error: null,
        });
    }

    next();
};