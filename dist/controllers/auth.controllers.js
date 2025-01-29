"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featuredAuthors = exports.userPreference = exports.removePreference = exports.addPreference = exports.userwishlist = exports.removewishlist = exports.addToWish = exports.assignRole = exports.activateAccount = exports.initActivation = exports.authUser = exports.ResetPassword = exports.forgetPassword = exports.login = exports.register = void 0;
const auth_services_1 = require("../services/auth.services");
const express_validator_1 = require("express-validator");
const delivermail_1 = require("../configs/delivermail");
const register = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { name, email, password } = req.body;
        const data = {
            name,
            email,
            password
        };
        const token = await (0, auth_services_1.registerUser)(data, 'local');
        const account = await (0, auth_services_1.UserExist)(email);
        const otp = await (0, auth_services_1.otpgen)(account._id);
        const maildata = await (0, auth_services_1.Regverificationmail)(email, otp);
        await (0, delivermail_1.reusableMail)(maildata);
        return res.status(200).json({
            status: 'true',
            token
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Account already exists') {
                return res.status(400).json({
                    message: 'User already exist'
                });
            }
            else if (error.message === 'name already inuse') {
            }
            else {
                next(error);
            }
        }
    }
};
exports.register = register;
const login = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { email, password } = req.body;
        const token = await (0, auth_services_1.ValidateUserPassword)(email, password);
        if (token.length > 0) {
            return res.status(200).json({
                status: true,
                token: token
            });
        }
        else {
            throw new Error('authentication failed');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'authentication failed') {
                return res.status(401).json({
                    message: 'authentication failed'
                });
            }
            else if (error.message === 'Account not verified') {
                return res.status(401).json({
                    message: 'Account not verified. Initiate verification process'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.login = login;
const forgetPassword = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { email } = req.body;
        const user = await (0, auth_services_1.UserByEmail)(email);
        const token = await (0, auth_services_1.generateToken)(user, 'reset');
        if (token) {
            const data = await (0, auth_services_1.Resetpasswordmail)(token, email);
            await (0, delivermail_1.reusableMail)(data);
            return res.status(200).json({
                status: true,
                message: `Reset mail sent to ${email}`
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Account not found') {
                return res.status(404).json({
                    message: 'account not found'
                });
            }
            else if (error.message === 'jwt expired') {
                return res.status(401).json({
                    message: 'Token expired'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.forgetPassword = forgetPassword;
const ResetPassword = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { password } = req.body;
        const token = await (0, auth_services_1.extractor)(req);
        const userId = await (0, auth_services_1.verifyResetToken)(token);
        if (userId) {
            await (0, auth_services_1.changePassword)(userId.toString(), password);
            return res.status(200).json({
                message: 'Password Resetted',
                status: true
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'authentication failed') {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }
            else if (error.message === 'jwt expired') {
                return res.status(401).json({
                    message: 'Token expired'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.ResetPassword = ResetPassword;
const authUser = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        if (req.user) {
            const userdata = req.user;
            const id = userdata.id;
            const user = await (0, auth_services_1.getUserById)(id);
            return res.status(200).json({
                status: true,
                user
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authUser = authUser;
const initActivation = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { email } = req.body;
        const user = await (0, auth_services_1.UserByEmail)(email);
        const token = await (0, auth_services_1.generateToken)(user, 'verification');
        console.log(token);
        if (token) {
            const otp = await (0, auth_services_1.otpgen)(user._id);
            const data = await (0, auth_services_1.verificationmail)(token, email, otp);
            await (0, delivermail_1.reusableMail)(data);
            return res.status(200).json({
                status: true,
                message: `Verification mail sent to ${email}`
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'jwt expired') {
                return res.status(401).json({
                    message: 'Token expired'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.initActivation = initActivation;
const activateAccount = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { otp } = req.body;
        const token = await (0, auth_services_1.extractor)(req);
        const userId = await (0, auth_services_1.verifyVerificationToken)(token);
        if (userId) {
            const verifyotp = await (0, auth_services_1.checkOTP)(otp, userId.toString());
            if (!verifyotp) {
                throw new Error('Incorrect OTP');
            }
            const user = await (0, auth_services_1.activate)(userId);
            return res.status(200).json({
                status: true,
                message: 'Account activated',
                provider: user.provider,
                role: user.role
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'authentication failed') {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            else if (error.message === 'jwt expired') {
                return res.status(401).json({
                    message: 'Token expired'
                });
            }
            else if (error.message === 'Incorrect OTP') {
                return res.status(401).json({
                    message: 'incorrect otp'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.activateAccount = activateAccount;
const assignRole = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { role } = req.body;
        const token = await (0, auth_services_1.extractor)(req);
        const userId = await (0, auth_services_1.verifyVerificationToken)(token);
        if (userId) {
            const user = await (0, auth_services_1.assignUserRole)(userId, role);
            return res.status(200).json({
                status: true,
                message: 'Role assigned',
                provider: user.provider,
                role: user.role
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'authentication failed') {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            else if (error.message === 'jwt expired') {
                return res.status(401).json({
                    message: 'Token expired'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.assignRole = assignRole;
const addToWish = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const productid = req.query.product;
        const user = req.user;
        const userid = user.id;
        const add = await (0, auth_services_1.addToWishlist)(userid, productid);
        if (!add) {
            return res.status(400).json({
                status: false,
                message: "Product not added to wishlist",
            });
        }
        return res.status(200).json({
            status: true,
            wishlist: add.wishlist
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'user not found') {
                return res.status(404).json({
                    message: 'user not found'
                });
            }
            else if (error.message === 'Product already in wishlist') {
                return res.status(400).json({
                    message: 'product already in wishlist'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.addToWish = addToWish;
const removewishlist = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const productid = req.query.product;
        const user = req.user;
        const userid = user.id;
        const remove = await (0, auth_services_1.removeFromWishlist)(userid, productid);
        if (!remove) {
            return res.status(400).json({
                status: false,
                message: "Product not removed from wishlist",
            });
        }
        return res.status(200).json({
            status: true,
            productid
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removewishlist = removewishlist;
const userwishlist = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const user = req.user;
        const userid = user.id;
        const product = await (0, auth_services_1.getUserWishlist)(userid);
        if (product) {
            return res.status(200).json({
                status: true,
                product
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.userwishlist = userwishlist;
const addPreference = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const category = req.body.preferences;
        const user = req.user;
        const userid = user.id;
        const list = await (0, auth_services_1.addToPreference)(userid, category);
        if (!list) {
            return res.status(400).json({
                status: false,
                message: "Category not added to wishlist",
            });
        }
        return res.status(200).json({
            status: true,
            preferences: list.preferences
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'user not found') {
                return res.status(404).json({
                    message: 'user not found'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.addPreference = addPreference;
const removePreference = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const categoryid = req.body.preferences;
        const user = req.user;
        const userid = user.id;
        const list = await (0, auth_services_1.removeFromPreference)(userid, categoryid);
        if (!list) {
            return res.status(400).json({
                status: false,
                message: "Category not removed from wishlist",
            });
        }
        return res.status(200).json({
            status: true,
            preference: list.preferences
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removePreference = removePreference;
const userPreference = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const user = req.user;
        const userid = user.id;
        const preferences = await (0, auth_services_1.getUserPreference)(userid);
        if (preferences) {
            return res.status(200).json({
                status: true,
                preferences
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.userPreference = userPreference;
const featuredAuthors = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const authors = await (0, auth_services_1.getFeaturedAuthors)(page, limit);
        if (authors) {
            return res.status(200).json({
                status: true,
                authors
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.featuredAuthors = featuredAuthors;
