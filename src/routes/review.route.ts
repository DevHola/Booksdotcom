import express from 'express'
import passport from 'passport'
import { addReview, editProductReview, getProductReviews, getReview, getUserProductReviews } from '../controllers/review.controllers'
import { editReviewValidation, getReviewValidation, getUserReviewsValidation, productReviewsValidation, reviewValidation } from '../middlewares/validation'
const reviewRouter = express.Router()
reviewRouter.post('/', reviewValidation, passport.authenticate('jwt', { session: false }), addReview)
reviewRouter.get('/product/:id', productReviewsValidation, getProductReviews)
reviewRouter.patch('/', editReviewValidation, passport.authenticate('jwt', { session: false }) , editProductReview)
reviewRouter.get('/user/:id', getUserReviewsValidation, getUserProductReviews)
reviewRouter.get('/:id', getReviewValidation, getReview)

export default reviewRouter