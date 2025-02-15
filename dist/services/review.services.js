"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserReviews = exports.editReview = exports.getsingleReview = exports.getProductReview = exports.createReview = void 0;
const rating_model_1 = __importDefault(require("../models/rating.model"));
const createReview = async (rateNumber, review, product, user) => {
    return await rating_model_1.default.addAndUpdateReview(rateNumber, review, product, user);
};
exports.createReview = createReview;
const getProductReview = async (productId) => {
    return await rating_model_1.default.find({ product: productId });
};
exports.getProductReview = getProductReview;
const getsingleReview = async (Id) => {
    return await rating_model_1.default.findOne({ _id: Id });
};
exports.getsingleReview = getsingleReview;
const editReview = async (reviewId, number, text) => {
    return await rating_model_1.default.editAndUpdateReview(reviewId, number, text);
};
exports.editReview = editReview;
const getUserReviews = async (userId) => {
    return await rating_model_1.default.find({ user: userId });
};
exports.getUserReviews = getUserReviews;
