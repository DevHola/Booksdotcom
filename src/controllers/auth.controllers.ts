import { type Request, type Response, type NextFunction } from 'express'
import { type IUser } from '../models/User.model'
import { changePassword, extractor, generateToken, getUserById, registerUser, Resetpasswordmail, UserByEmail, ValidateUserPassword, verifyResetToken } from '../services/auth.services'
import { validationResult } from 'express-validator'
import { DecodedToken } from '../middlewares/passport'
import { reusableMail } from '../configs/delivermail'
export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const { username, email, role, password } = req.body
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

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const { email, password } = req.body
    const token = await ValidateUserPassword(email as string, password as string)

    if (token.length > 0) {
       return res.status(200).json({
        status: true,
        token
      })
    } else {
      return res.status(401).json({
        message: 'Incorrect credentials'
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'authentication failed') {
        return res.status(401).json({
          message: 'Incorrect credentials'
        })
      } else {
        next(error)
      }
    }
  }
}
export const forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const { email } = req.body
    const user = await UserByEmail(email as string)
    const token = await generateToken(user, 'reset')
    if(token){
      const data = await Resetpasswordmail(token, email)
      reusableMail(data)
      return res.status(200).json({
        message: `Reset mail sent to ${email}`
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Account not found') {
        return res.status(404).json({
          message: 'account not found'
        })
      } else {
        next(error)
      }
    }
  }
}
export const ResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const { password } = req.body
    const token = await extractor(req)
    const userId = await verifyResetToken(token)
    if (userId.length > 0) {
      await changePassword(userId, password as string)
      return res.status(200).json({
        message: 'Password Resetted'
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'authentication failed') {
        return res.status(401).json({
          message: 'Incorrect credentials'
        })
      } else {
        next(error)
      }
    }
  }
}
const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(req.user){
      const userdata = req.user as DecodedToken
      const id = userdata.id
      const user = getUserById(id)
      return res.status(200).json(user)
    }
  } catch (error) {
    next(error)
  }
  
}