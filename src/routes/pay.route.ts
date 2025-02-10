import express from 'express'
import { payment, verify } from '../controllers/pay.controllers'
import passport from 'passport'
const payRouter = express.Router()
payRouter.post('/',passport.authenticate('jwt', { session: false }), payment)
payRouter.get('/',passport.authenticate('jwt', { session: false }),verify)
export default payRouter