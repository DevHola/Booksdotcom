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
/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: Unique coupon code
 *           example: "SUMMER50"
 *         type:
 *           type: string
 *           enum: ["fixed", "percentage"]
 *           description: Type of discount the coupon offers
 *           example: "percentage"
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Expiration date of the coupon
 *           example: "2025-12-31T23:59:59Z"
 *         isActive:
 *           type: boolean
 *           description: Indicates if the coupon is active
 *           example: true
 *         usageCount:
 *           type: integer
 *           description: Number of times the coupon has been used
 *           example: 15
 *         discount:
 *           type: number
 *           description: Discount amount or percentage
 *           example: 20.5
 *         ruleType:
 *           type: string
 *           enum: ["none", "month-specific", "day-specific-in-month", "day-specific-in-week", "month-and-day-specific", "month-and-days-of-week-specific", "day-range-specific", "time-period-specific"]
 *           description: Rule type for applying the coupon
 *           example: "month-specific"
 *         product:
 *           type: array
 *           items:
 *             type: string
 *           description: List of product IDs applicable for the coupon
 *           example: ["product1", "product2"]
 *         vendor:
 *           type: string
 *           description: Vendor ID who issued the coupon
 *           example: "vendor123"
 *         isDeleted:
 *           type: boolean
 *           description: Indicates if the coupon has been deleted
 *           example: false
 *
 *     Rules:
 *       type: object
 *       properties:
 *         couponId:
 *           type: string
 *           description: Coupon ID associated with the rules
 *           example: "60b8d7d1a24f1a001f9f53b2"
 *         limit:
 *           type: integer
 *           description: Maximum times a coupon can be used
 *           example: 100
 *         month:
 *           type: array
 *           items:
 *             type: string
 *           description: List of months applicable for the coupon
 *           example: ["January", "February"]
 *         day:
 *           type: array
 *           items:
 *             type: integer
 *           description: Specific days in a month the coupon is valid
 *           example: [1, 15, 30]
 *         daysOfWeek:
 *           type: array
 *           items:
 *             type: string
 *           description: Days of the week the coupon is valid
 *           example: ["Monday", "Friday"]
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date for the coupon validity
 *           example: "2025-06-01T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: End date for the coupon validity
 *           example: "2025-06-30T23:59:59Z"
 */
/**
 * @swagger
 * /coupon/:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - type
 *               - expiresAt
 *               - discount
 *               - ruleType
 *               - product
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SUMMER50"
 *               type:
 *                 type: string
 *                 enum: ["fixed", "percentage"]
 *                 example: "percentage"
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *               discount:
 *                 type: number
 *                 example: 20.5
 *               ruleType:
 *                 type: string
 *                 enum: ["none", "month-specific", "day-specific-in-month", "day-specific-in-week", "month-and-day-specific", "month-and-days-of-week-specific", "day-range-specific", "time-period-specific"]
 *                 example: "month-specific"
 *               product:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["product1", "product2"]
 *               rules:
 *                 type: object
 *                 properties:
 *                   limit:
 *                     type: integer
 *                     example: 100
 *                   month:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["January", "February"]
 *                   day:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     example: [1, 15, 30]
 *                   daysOfWeek:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Monday", "Friday"]
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-01T00:00:00Z"
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-30T23:59:59Z"
 *     responses:
 *       201:
 *         description: Successfully created a coupon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 coupon:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60b8d7d1a24f1a001f9f53b2"
 *                     code:
 *                       type: string
 *                       example: "SUMMER50"
 *                     type:
 *                       type: string
 *                       example: "percentage"
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-31T23:59:59Z"
 *                     discount:
 *                       type: number
 *                       example: 20.5
 *                     ruleType:
 *                       type: string
 *                       example: "month-specific"
 *                     product:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["product1", "product2"]
 *       400:
 *         description: Bad request, validation error
 *       401:
 *         description: Unauthorized, user authentication failed
 *       500:
 *         description: Internal server error
 */
couponRouter.post('/', validation_1.validateCoupon, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.createCoupon);
/**
 * @swagger
 * /coupons/:
 *   get:
 *     summary: Retrieve all coupons created by the authenticated creator
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of coupons per page for pagination
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved the creator's coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coupons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       couponId:
 *                         type: string
 *                         example: "60b8d7d1a24f1a001f9f53b2"
 *                       code:
 *                         type: string
 *                         example: "SAVE20"
 *                       discount:
 *                         type: number
 *                         example: 20.0
 *                       expiryDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-12T23:59:59Z"
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPage:
 *                   type: integer
 *                   example: 5
 *                 totalResult:
 *                   type: integer
 *                   example: 50
 *                 status:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       500:
 *         description: Internal server error
 */
couponRouter.get('/', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.getAllCoupons);
/**
 * @swagger
 * /coupon/single:
 *   get:
 *     summary: Get a single coupon by code
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique coupon code
 *     responses:
 *       200:
 *         description: Successfully retrieved the coupon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 coupon:
 *                   type: object
 *                   example: { "code": "DISCOUNT50", "discount": 50, "expiresAt": "2025-12-31" }
 *       400:
 *         description: Validation error (missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Coupon code is required"
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "coupon not found"
 *       500:
 *         description: Internal server error
 */
couponRouter.get('/single/', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.getSingleCoupon);
/**
 * @swagger
 * /coupon/check:
 *   get:
 *     summary: Check the validity of a coupon
 *     tags:
 *       - Coupons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: coupon
 *         required: true
 *         schema:
 *           type: string
 *         description: The coupon code to validate
 *       - in: query
 *         name: product
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID to check against the coupon
 *     responses:
 *       200:
 *         description: Coupon is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: string
 *                   example: "SAVE10"
 *                 formats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "ebook"
 *                       original_price:
 *                         type: number
 *                         example: 600
 *                       discount:
 *                         type: string
 *                         example: "20"
 *                       final_prize:
 *                         type: number
 *                         example: 580
 *       400:
 *         description: Invalid coupon request or expired coupon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "coupon has expired"
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "coupon not found"
 *       409:
 *         description: Coupon max usage reached
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "coupon reached max usage"
 */
couponRouter.get('/check', validation_1.validateCouponChecker, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), coupon_controllers_1.checkACoupon);
/**
 * @swagger
 * /coupon:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: coupon
 *         required: true
 *         description: The coupon code to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the coupon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "coupon deleted"
 *       400:
 *         description: Bad request, validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Coupon code is required"
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, insufficient permissions
 *       500:
 *         description: Internal server error
 */
couponRouter.delete('/', validation_1.validateCouponDelete, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.couponDelete);
/**
 * @swagger
 * /coupon/status:
 *   patch:
 *     summary: Change coupon status (activate/deactivate)
 *     description: Updates the status of a coupon by activating or deactivating it.
 *     tags:
 *       - Coupons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [activate, deactivate]
 *         required: true
 *         description: The new status of the coupon (activate or deactivate).
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The coupon code to be updated.
 *     responses:
 *       200:
 *         description: Coupon status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Coupon status updated successfully"
 *       400:
 *         description: Invalid request or coupon status already set.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Coupon status already set"
 *       401:
 *         description: Unauthorized - JWT token missing or invalid.
 *       500:
 *         description: Internal server error.
 */
couponRouter.patch('/status', passport_1.default.authenticate('jwt', { session: false }), coupon_controllers_1.changeCouponStatus);
exports.default = couponRouter;
