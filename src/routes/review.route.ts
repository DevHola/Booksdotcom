import express from 'express'
import passport from 'passport'
import { addReview, editProductReview, getProductReviews, getReview, getUserProductReviews } from '../controllers/review.controllers'
import { editReviewValidation, getReviewValidation, getUserReviewsValidation, productReviewsValidation, reviewValidation } from '../middlewares/validation'
import { authorization } from '../middlewares/passport'
const reviewRouter = express.Router()
reviewRouter.post('/', reviewValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), addReview)
reviewRouter.get('/product/:id', productReviewsValidation, getProductReviews)
reviewRouter.patch('/', editReviewValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), editProductReview)
reviewRouter.get('/user/:id', getUserReviewsValidation, getUserProductReviews)
reviewRouter.get('/:id', getReviewValidation, getReview)

export default reviewRouter