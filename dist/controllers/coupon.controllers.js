"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponDelete = exports.checkACoupon = exports.getSingleCoupon = exports.getAllCoupons = exports.createCoupon = void 0;
const coupon_services_1 = require("../services/coupon.services");
const createCoupon = async (req, res, next) => {
    try {
        const { code, type, expiresAt, discount, ruleType, product, rules } = req.body;
        const data = {
            code,
            type,
            discount,
            expiresAt,
            ruleType,
            product,
            rules: rules
        };
        const coupon = await (0, coupon_services_1.couponCreation)(data);
        return res.status(200).json({
            status: true,
            code: coupon.code
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCoupon = createCoupon;
const getAllCoupons = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const user = req.user;
        const userid = user.id;
        const coupons = await (0, coupon_services_1.getAllCreatorCoupons)(userid, page, limit);
        return res.status(200).json({
            status: true,
            coupons
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCoupons = getAllCoupons;
const getSingleCoupon = async (req, res, next) => {
    try {
        const code = req.params.id;
        const coupon = await (0, coupon_services_1.singleCoupon)(code);
        return res.status(200).json({
            status: true,
            coupon
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'coupon not found') {
                return res.status(404).json({
                    status: false,
                    message: 'coupon not found'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.getSingleCoupon = getSingleCoupon;
const checkACoupon = async (req, res, next) => {
    try {
        const couponCode = req.query.coupon;
        const product = req.query.product;
        const coupon = await (0, coupon_services_1.checkCoupon)(couponCode, product);
        return res.status(200).json({
            status: true,
            coupon
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'coupon not found')
                return res.status(404).json({ status: false, message: 'coupon not found' });
            else if (error.message === 'coupon expired')
                return res.status(400).json({ status: false, message: 'coupon has expired' });
            else if (error.message === 'coupon is currently inactive')
                return res.status(400).json({ status: false, message: 'coupon has been disengaged' });
            else if (error.message === 'coupon is not valid')
                return res.status(400).json({ status: false, message: 'coupon does not meet criteria' });
            else if (error.message === 'Coupon max usage reached')
                return res.status(409).json({ status: false, message: 'coupon reached max usage' });
            else
                next(error);
        }
    }
};
exports.checkACoupon = checkACoupon;
const couponDelete = async (req, res, next) => {
    try {
        const couponCode = req.query.coupon;
        await (0, coupon_services_1.deleteCoupon)(couponCode);
        return res.status(200).json({
            status: true,
            message: 'coupon deleted'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.couponDelete = couponDelete;
