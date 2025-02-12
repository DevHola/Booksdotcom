import express from 'express'
import { payment, verify } from '../controllers/pay.controllers'
import passport from 'passport'
import { validatePayment } from '../middlewares/validation'
import { authorization } from '../middlewares/passport'
const payRouter = express.Router()
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

payRouter.post('/', validatePayment, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), payment)
payRouter.get('/',passport.authenticate('jwt', { session: false }),verify)
export default payRouter