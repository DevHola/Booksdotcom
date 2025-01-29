"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReview = exports.getUserProductReviews = exports.editProductReview = exports.getProductReviews = exports.addReview = void 0;
const express_validator_1 = require("express-validator");
const review_services_1 = require("../services/review.services");
const addReview = async (req, res, next) => {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res.status(401).json({
            errors: error.array()
        });
    }
    try {
        const { rateNumber, review, product } = req.body;
        const user = req.user;
        const id = user.id;
        const add = await (0, review_services_1.createReview)(rateNumber, review, product, id);
        return res.status(200).json({
            status: true,
            review: add
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addReview = addReview;
const getProductReviews = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const productid = req.params.id;
        const reviews = await (0, review_services_1.getProductReview)(productid);
        return res.status(200).json({
            status: true,
            reviews
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductReviews = getProductReviews;
const editProductReview = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { reviewid, ratenumber, review } = req.body;
        const user = req.user;
        const userid = user.id;
        const reviewcheck = await (0, review_services_1.getsingleReview)(reviewid);
        if (reviewcheck.user != userid) {
            return res.status(401).json({
                message: 'unauthorised'
            });
        }
        const reviews = await (0, review_services_1.editReview)(reviewid, ratenumber, review);
        return res.status(200).json({
            status: true,
            reviews
        });
    }
    catch (error) {
        next(error);
    }
};
exports.editProductReview = editProductReview;
const getUserProductReviews = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const userid = req.params.id;
        const reviews = await (0, review_services_1.getUserReviews)(userid);
        return res.status(200).json({
            status: true,
            reviews
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProductReviews = getUserProductReviews;
const getReview = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const id = req.params.id;
        const review = await (0, review_services_1.getsingleReview)(id);
        return res.status(200).json({
            status: true,
            review
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReview = getReview;
