import express from 'express'
import { forgetPassword, register, login, ResetPassword, authUser } from '../controllers/auth.controllers'
import passport from 'passport'
const AuthRouter = express.Router()
AuthRouter.post('/register', register)
AuthRouter.post('/login', login)
AuthRouter.get('/forget', forgetPassword)
AuthRouter.put('/reset', ResetPassword)
AuthRouter.get('/user', passport.authenticate('jwt', { session: false }),  authUser)
export default AuthRouter
