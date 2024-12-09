import express from 'express'
import passport from 'passport'
import { addReview, editProductReview, getProductReviews, getReview, getUserProductReviews } from '../controllers/review.controllers'
const reviewRouter = express.Router()
reviewRouter.post('/', passport.authenticate('jwt', { session: false }), addReview)
reviewRouter.get('/product/:id', getProductReviews)
reviewRouter.patch('/', passport.authenticate('jwt', { session: false }) , editProductReview)
reviewRouter.get('/user/:id', getUserProductReviews)
reviewRouter.get('/:id', getReview)

export default reviewRouter