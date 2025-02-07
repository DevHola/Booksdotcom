import express from 'express'
import { validateCoupon, validateCouponChecker, validateCouponDelete } from '../middlewares/validation'
import passport from 'passport'
import { authorization } from '../middlewares/passport'
import { checkACoupon, couponDelete, createCoupon, getAllCoupons, getSingleCoupon } from '../controllers/coupon.controllers'
const couponRouter = express.Router()
couponRouter.post('/', validateCoupon, passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), createCoupon)
couponRouter.get('/', passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), getAllCoupons)
couponRouter.get('/single/', passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), getSingleCoupon)
couponRouter.get('/check', validateCouponChecker, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), checkACoupon)
couponRouter.delete('/', validateCouponDelete, passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), couponDelete)
export default couponRouter