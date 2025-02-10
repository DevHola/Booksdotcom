"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = require("../middlewares/validation");
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("../middlewares/passport");
const coupon_controllers_1 = require("../controllers/coupon.controllers");
const couponRouter = express_1.default.Router();
couponRouter.post('/', validation_1.validateCoupon, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.createCoupon);
couponRouter.get('/', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.getAllCoupons);
couponRouter.get('/single/', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.getSingleCoupon);
couponRouter.get('/check', validation_1.validateCouponChecker, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), coupon_controllers_1.checkACoupon);
couponRouter.delete('/', validation_1.validateCouponDelete, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.couponDelete);
exports.default = couponRouter;
