"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAuthorAchievement = exports.addAuthorAchievement = exports.getAuthorProfile = exports.editUserProfile = exports.createUserProfile = void 0;
const profile_services_1 = require("../services/profile.services");
const cloudinary_1 = require("../middlewares/cloudinary");
const express_validator_1 = require("express-validator");
const auth_services_1 = require("../services/auth.services");
const createUserProfile = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const token = await (0, auth_services_1.extractor)(req);
        const userId = await (0, auth_services_1.verifyVerificationToken)(token);
        const biography = req.body.biography;
        const data = {
            biography: biography,
            author: userId
        };
        if (Array.isArray(req.files) && req.files.length > 0) {
            const urls = await (0, cloudinary_1.cloudinaryImageUploadMethod)(req.files, process.env.PRODUCTPROFILEFOLDER);
            data.imgsrc = urls[0];
        }
        const profile = await (0, profile_services_1.createProfile)(data);
        if (profile) {
            return res.status(200).json({
                status: true,
                profile
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.createUserProfile = createUserProfile;
const editUserProfile = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const user = req.user;
        const id = user.id;
        const biography = req.body.biography;
        const data = {
            biography: biography,
        };
        if (Array.isArray(req.files)) {
            const urls = await (0, cloudinary_1.cloudinaryImageUploadMethod)(req.files, process.env.PRODUCTPROFILEFOLDER);
            data.imgsrc = urls[0];
        }
        if (data.imgsrc === undefined || data.imgsrc === '')
            data.imgsrc = req.body.imgsrc;
        const profile = await (0, profile_services_1.editProfile)(data, id);
        if (profile) {
            return res.status(200).json({
                status: true,
                profile
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Update failed') {
                return res.status(401).json({
                    status: false,
                    message: 'error occured while updating profile'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.editUserProfile = editUserProfile;
const getAuthorProfile = async (req, res, next) => {
    try {
        const userid = req.query.userId;
        const profile = await (0, profile_services_1.getProfile)(userid);
        if (profile) {
            return res.status(200).json({
                status: true,
                profile
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getAuthorProfile = getAuthorProfile;
const addAuthorAchievement = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const user = req.user;
        const id = user.id;
        const { title, description } = req.body;
        const data = {
            title: title, description: description
        };
        const achievement = await (0, profile_services_1.addAchievement)(data, id);
        if (!achievement) {
            return res.status(400).json({
                status: false,
                message: 'Achievement could not be added to achievement list'
            });
        }
        return res.status(200).json({
            status: true,
            achievement
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addAuthorAchievement = addAuthorAchievement;
const removeAuthorAchievement = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const user = req.user;
        const id = user.id;
        const achievementid = req.query.achievement;
        const achievement = await (0, profile_services_1.removeAchievement)(achievementid, id);
        if (!achievement) {
            return res.status(400).json({
                status: false,
                message: 'Achievement could not be removed from achievement list'
            });
        }
        return res.status(200).json({
            status: true,
            achievement
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeAuthorAchievement = removeAuthorAchievement;
