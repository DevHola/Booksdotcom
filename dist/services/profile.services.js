"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAchievement = exports.addAchievement = exports.getProfile = exports.editProfile = exports.createProfile = void 0;
const profile_model_1 = __importDefault(require("../models/profile.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const createProfile = async (data) => {
    const user = await User_model_1.default.findById(data.author);
    if (!user) {
        throw new Error('User not found');
    }
    const profile = await profile_model_1.default.create({
        biography: data.biography,
        imgsrc: data.imgsrc,
        author: data.author
    });
    await profile.save();
    await User_model_1.default.findByIdAndUpdate(data.author, {
        $set: {
            profile: profile._id
        }
    });
    return profile;
};
exports.createProfile = createProfile;
const editProfile = async (data, userId) => {
    const userprofile = await User_model_1.default.findById(userId, { profile: 1 });
    const profile = await profile_model_1.default.findByIdAndUpdate(userprofile, {
        $set: data
    }, { new: true });
    if (!profile) {
        throw new Error('Update failed');
    }
    return profile;
};
exports.editProfile = editProfile;
const getProfile = async (id) => {
    return await profile_model_1.default.findOne({ author: id }, { balance: 0 });
};
exports.getProfile = getProfile;
const addAchievement = async (data, userid) => {
    const user = await User_model_1.default.findById(userid);
    const profile = await profile_model_1.default.findById(user?.profile);
    if (!profile) {
        throw new Error('Profile not found');
    }
    const update = await profile_model_1.default.findByIdAndUpdate(profile._id, {
        $push: {
            achievements: data
        }
    }, { new: true });
    if (!update) {
        throw new Error('Update failed');
    }
    return update;
};
exports.addAchievement = addAchievement;
const removeAchievement = async (achievementid, userid) => {
    const user = await User_model_1.default.findById(userid);
    const profile = await profile_model_1.default.findById(user?.profile);
    if (!profile) {
        throw new Error('Profile not found');
    }
    const update = await profile_model_1.default.findByIdAndUpdate(profile._id, {
        $pull: {
            achievements: {
                _id: achievementid
            }
        }
    }, { new: true });
    if (!update) {
        throw new Error('Update failed');
    }
    return update;
};
exports.removeAchievement = removeAchievement;
