import { Request, Response, NextFunction } from "express"
import { IUser } from "../models/User.model"
import { changePassword, extractor, generateToken, registerUser, UserByEmail, ValidateUserPassword, verifyResetToken } from "../services/auth.services"
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {username, email, role, password } = req.body
        const data = {
            username,
            email,
            role,
            password
        }
        const token = await registerUser(data as IUser)
        res.status(200).json({
            status: 'true',
            token
        })
    } catch (error) {
        next(error)
    }
    
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        const token = await ValidateUserPassword(email as string, password as string)
        res.status(200).json({
            status: true,
            token
        })
    } catch (error) {
        if(error instanceof Error) {
            if(error.message === 'authentication failed'){
               return res.status(401).json({
                    message: 'Incorrect credentials'
                })
            } else {
                next(error)
            }
        }
    }
    
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        const user = await UserByEmail(email as string)
        const token = await generateToken(user, 'reset')
        // mail function here

    } catch (error) {
        if(error instanceof Error){
            if(error.message === 'Account not found'){
                return res.status(404).json({
                    message: 'account not found'
                })
            } else {
                next(error)
            }
        }
    }
    
}
export const ResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password } = req.body
        const token = await extractor(req)
        const userId = await verifyResetToken(token)
        if(userId) {
            await changePassword(userId, password)
            res.status(200).json({
                message: 'Password Resetted'
            })
        }
    } catch (error) {
        if(error instanceof Error) {
            if(error.message === 'authentication failed'){
               return res.status(401).json({
                    message: 'Incorrect credentials'
                })
            } else {
                next(error)
            }
        }
    }    
}