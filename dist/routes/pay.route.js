"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pay_controllers_1 = require("../controllers/pay.controllers");
const passport_1 = __importDefault(require("passport"));
const validation_1 = require("../middlewares/validation");
const passport_2 = require("../middlewares/passport");
const payRouter = express_1.default.Router();
/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Initialize a payment transaction
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total:
 *                 type: number
 *                 example: 10000
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "67927df747908ab4f63f4f66"
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *                     format:
 *                       type: string
 *                       example: "physical"
 *                     price:
 *                       type: number
 *                       example: 100
 *               email:
 *                 type: string
 *                 example: "connectola@yahoo.com"
 *               trackingCode:
 *                 type: string
 *                 example: "gijones"
 *     responses:
 *       200:
 *         description: Payment transaction initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   type: object
 *                   description: Payment initialization response from Paystack
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized, invalid authentication
 *       500:
 *         description: Internal server error
 */
payRouter.post('/', validation_1.validatePayment, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), pay_controllers_1.payment);
payRouter.get('/', passport_1.default.authenticate('jwt', { session: false }), pay_controllers_1.verify);
exports.default = payRouter;
