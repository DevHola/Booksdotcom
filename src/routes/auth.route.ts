import express from 'express'
import { forgetPassword, register, login, ResetPassword } from '../controllers/auth.controllers'
const AuthRouter = express.Router()
AuthRouter.post('/register', register)
AuthRouter.post('/login', login)
AuthRouter.get('/forget', forgetPassword)
AuthRouter.patch('/reset', ResetPassword)
export default AuthRouter
