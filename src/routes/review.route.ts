import express from 'express'
import passport from 'passport'
import { addReview, editProductReview, getProductReviews, getReview, getUserProductReviews } from '../controllers/review.controllers'
import { editReviewValidation, getReviewValidation, getUserReviewsValidation, productReviewsValidation, reviewValidation } from '../middlewares/validation'
import { authorization } from '../middlewares/passport'
const reviewRouter = express.Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       properties:
 *         rateNumber:
 *           type: number
 *           description: The rating number, e.g., 1-5 scale
 *         review:
 *           type: string
 *           description: The review text (optional)
 *         product:
 *           type: string
 *           description: The ID of the product being rated
 *       required:
 *         - rateNumber
 *       example:
 *         rateNumber: 4
 *         review: "Great product!"
 *         product: "product-id-123"
 */

/**
 * @swagger
 * /reviews/:
 *   post:
 *     summary: Add or update a review for a product
 *     tags: [Rating]
 *     security:
 *       - BearerAuth: [] # Reference the security scheme correctly
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token authorization - Get from Authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       200:
 *         description: Review added or updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
reviewRouter.post('/', reviewValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), addReview)
/**
 * @swagger
 * /reviews/product/{id}:
 *   get:
 *     summary: Get reviews for a specific product
 *     tags: [Rating]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve reviews for
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rating'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

reviewRouter.get('/product/:id', productReviewsValidation, getProductReviews)
/**
 * @swagger
 * /reviews/:
 *   patch:
 *     summary: Edit a product review
 *     tags: [Rating]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewid:
 *                 type: string
 *                 description: The ID of the review to edit
 *               ratenumber:
 *                 type: number
 *                 description: The rating number (1-5) for the product
 *               review:
 *                 type: string
 *                 description: The edited review text
 *             required:
 *               - reviewid
 *               - ratenumber
 *     responses:
 *       200:
 *         description: Successfully edited the product review
 *       400:
 *         description: Bad request, missing required fields or invalid data
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       403:
 *         description: Forbidden, user not authorized to edit the review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
reviewRouter.patch('/', editReviewValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), editProductReview)
/**
 * @swagger
 * /reviews/user/{id}:
 *   get:
 *     summary: Get all reviews for a specific user
 *     tags: [Rating]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose reviews to fetch
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reviewid:
 *                     type: string
 *                     description: The ID of the review
 *                   ratenumber:
 *                     type: number
 *                     description: The rating number given by the user
 *                   review:
 *                     type: string
 *                     description: The review text written by the user
 *                   product:
 *                     type: string
 *                     description: The ID of the product being reviewed
 *       400:
 *         description: Bad request, invalid user ID format
 *       404:
 *         description: User not found or no reviews found for the user
 *       500:
 *         description: Server error
 */

reviewRouter.get('/user/:id', getUserReviewsValidation, getUserProductReviews)
/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a specific review by its ID
 *     tags: [Rating]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to fetch
 *     responses:
 *       200:
 *         description: Successfully retrieved the review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewid:
 *                   type: string
 *                   description: The unique ID of the review
 *                 ratenumber:
 *                   type: number
 *                   description: The rating given to the product
 *                 review:
 *                   type: string
 *                   description: The text of the review
 *                 product:
 *                   type: string
 *                   description: The ID of the product being reviewed
 *       400:
 *         description: Bad request, invalid review ID format
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
reviewRouter.get('/:id', getReviewValidation, getReview)

export default reviewRouter