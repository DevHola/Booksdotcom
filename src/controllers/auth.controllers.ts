import e, { type Request, type Response, type NextFunction } from 'express'
import { type IUser } from '../models/User.model'
import { activate, addToPreference, addToWishlist, assignUserRole, changePassword, checkOTP, extractor, generateToken, getFeaturedAuthors, getUserById, getUserPreference, getUserWishlist, otpgen, registerUser, Regverificationmail, removeFromPreference, removeFromWishlist, Resetpasswordmail, UserByEmail, UserExist, ValidateUserPassword, verificationmail, verifyResetToken, verifyVerificationToken } from '../services/auth.services'
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
    await reusableMail(maildata)
    return res.status(200).json({
      status: 'true',
      token
    })
  } catch (error) {
    if(error instanceof Error){
      if(error.message === 'Account already exists'){
        return res.status(409).json({
          message: 'User already exist'
        })
      } else {
        next(error)
      }
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
export const addToWish = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const productid = req.query.product
    const user = req.user as DecodedToken
    const userid = user.id
    const add = await addToWishlist(userid, productid as string)
    if(add){
      return res.status(200).json({
        status: true
      })
    }
    
  } catch (error) {
    if(error instanceof Error){
      if(error.message === 'user not found'){
        return res.status(404).json({
          message: 'user not found'
        })
      } else if (error.message === 'Product already in wishlist'){
        return res.status(400).json({
          message: 'product already in wishlist'
        })
      }
      else {
        next(error)
      }
    }
  }
}
export const removewishlist = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const productid = req.query.product
    const user = req.user as DecodedToken
    const userid = user.id
    const remove = await removeFromWishlist(userid, productid as string)
    if(remove) {
      return res.status(200).json({
        status: true,
        productid
      })
    }
  } catch (error) {
    next(error)
  }
}
export const userwishlist = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = req.user as DecodedToken
    const userid = user.id
    const product = await getUserWishlist(userid)
    if(product){
      return res.status(200).json({
        product
      })
    }
  } catch (error) {
    next(error)
  }
}
export const addPreference = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const category = req.body.preferences 
    const user = req.user as DecodedToken
    const userid = user.id
    
    const add = await addToPreference(userid, category as string[])
    if(add){
      return res.status(200).json({
        status: true
      })
    }
  } catch (error) {
    if(error instanceof Error){
      if(error.message === 'user not found'){
        return res.status(404).json({
          message: 'user not found'
        })
      } else {
        next(error)
      }
    }
  }
}
export const removePreference = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const categoryid = req.body.preferences 
    const user = req.user as DecodedToken
    const userid = user.id
    const list = await removeFromPreference(userid, categoryid as string[])
    if(list){
      return res.status(200).json({
        status: true
      })
    }
  } catch (error) {
    next(error)
  }
}
export const userPreference = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = req.user as DecodedToken
    const userid = user.id
    const preferences = await getUserPreference(userid)
    if(preferences){
      return res.status(200).json({
        preferences
      })
    }
  } catch (error) {
    next(error)
  }
}
export const featuredAuthors = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const authors = await getFeaturedAuthors(page, limit)
    if(authors){
      return res.status(200).json({
        authors
      })
    }
  } catch (error) {
    next(error)
  }
}