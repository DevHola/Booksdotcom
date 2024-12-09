import { type Request, type Response, type NextFunction } from 'express'
import { type IUser } from '../models/User.model'
import { activate, assignUserRole, changePassword, checkOTP, extractor, generateToken, getUserById, otpgen, registerUser, Regverificationmail, Resetpasswordmail, UserByEmail, UserExist, ValidateUserPassword, verificationmail, verifyResetToken, verifyVerificationToken } from '../services/auth.services'
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
    const { username, email, password } = req.body
    const data = {
      username,
      email,
      password
    }
    const user = await UserExist(email)
    if(user){
      throw new Error('Account already exists')
    }
    const token = await registerUser(data as IUser, 'local')
    const account = await UserExist(email) 
    const otp = await otpgen(account._id as string)
    const maildata = await Regverificationmail(email, otp)
    console.log(otp)
    res.status(200).json({
      status: 'true',
      token
    })
  } catch (error) {
    if(error instanceof Error){
      return res.status(401).json({
        message: 'User account already exist'
      })
    } else {
      next(error)
    }
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
        token: token
      })
    } else {
      throw new Error('authentication failed')
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'authentication failed') {
        return res.status(401).json({
          message: 'authentication failed'
        })
      } else if (error.message === 'Account not verified') {
        return res.status(401).json({
          message: 'Account not verified. Initiate verification process'
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
    if(user.provider ==='local') {
      const token = await generateToken(user, 'reset')
    if(token){
      const data = await Resetpasswordmail(token, email)
      // reusableMail(data)
      return res.status(200).json({
        message: `Reset mail sent to ${email}`
      })
    }
    } else {
      return res.status(200).json({
        message: `Proceed to login via social logins`
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
    if (userId) {
      await changePassword(userId.toString(), password)
      return res.status(200).json({
        message: 'Password Resetted',
        status: true
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
export const authUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if(req.user){
      const userdata = req.user as DecodedToken
      const id = userdata.id
      const user = await getUserById(id)
      return res.status(200).json({
        user
      })
    }
  } catch (error) {
    next(error)
  } 
}

export const initActivation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const { email } = req.body
    const user = await UserByEmail(email)
    console.log(user)
    if(user.isverified !== false) {
      throw new Error('Account already Active')
    }
    if(user.provider !== 'local'){
      throw new Error('not local')
    }
    const token = await generateToken(user, 'verification')
    if(token){
      const otp = await otpgen(user._id as string)
      const data = await verificationmail(token, email, otp)
      // reusableMail(data)
      return res.status(200).json({
        message: `Verification mail sent to ${email}`
      })
    }
  } catch (error) {
    if(error instanceof Error){
      if(error.message === 'Account not found'){
        return res.status(404).json({
          message: 'Account not found'
        })
      } else if (error.message === 'Account already Active'){
        return res.status(401).json({
          message: 'Account is already Active'
        })
      } else if(error.message === 'not local'){
        return res.status(401).json({
          message: 'Proceed to login via socials'
        })
      }
    }
  }
  
}

export const activateAccount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const { otp } = req.body
    const token = await extractor(req)
    const userId = await verifyVerificationToken(token)
    if (userId) {
      const verifyotp = await checkOTP(otp, userId.toString())
      if(!verifyotp) {
        throw new Error('Incorrect OTP')
      }
        const user = await activate(userId)
        return res.status(200).json({
          message: 'Account activated',
          provider: user.provider,
          role: user.role
        })
    }
  } catch (error) {
    if(error instanceof Error){
      if(error.message === 'authentication failed'){
        return res.status(401).json({
          message: 'Authentication failed'
        })
      } else if (error.message === 'Incorrect OTP'){
        return res.status(401).json({
          message: 'incorrect otp'
        })
      }  else{
        next(error)
      }
    }
  }
}
export const assignRole = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const { role } = req.body
    const token = await extractor(req)
    const userId = await verifyVerificationToken(token)
    if(userId){
      const user = await assignUserRole(userId, role)
      return res.status(200).json({
        message: 'Role assigned',
        provider: user.provider,
        role: user.role
      })
    }

    
  } catch (error) {
    if(error instanceof Error){
      if(error.message === 'authentication failed'){
        return res.status(401).json({
          message: 'Authentication failed'
        })
      } else {
        next(error)
      }
    }
  }
}
