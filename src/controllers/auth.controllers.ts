import { type Request, type Response, type NextFunction } from 'express'
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
    const { name, email, password } = req.body
    const data = {
      name,
      email,
      password
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
        return res.status(400).json({
          message: 'User already exist'
        })
      } else if (error.message === 'name already inuse'){

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
      const token = await generateToken(user, 'reset')
    if(token){
      const data = await Resetpasswordmail(token, email)
      await reusableMail(data)
      return res.status(200).json({
        status: true,
        message: `Reset mail sent to ${email}`
      })
    }
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Account not found') {
        return res.status(404).json({
          message: 'account not found'
        })
      } else if (error.message === 'jwt expired'){
        return res.status(401).json({
          message: 'Token expired'
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
          message: 'Unauthorized'
        })
      } else if (error.message === 'jwt expired'){
        return res.status(401).json({
          message: 'Token expired'
        })
      } else {
        next(error)
      }
    }
  }
}
export const authUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    if(req.user){
      const userdata = req.user as DecodedToken
      const id = userdata.id
      const user = await getUserById(id)
      return res.status(200).json({
        status: true,
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
    const token = await generateToken(user, 'verification')
    console.log(token)
    if(token){
      const otp = await otpgen(user._id as string)
      const data = await verificationmail(token, email, otp)
      await reusableMail(data)
      return res.status(200).json({
        status: true,
        message: `Verification mail sent to ${email}`
      })
    }
  } catch (error) {
    if(error instanceof Error){
      if (error.message === 'jwt expired'){
        return res.status(401).json({
          message: 'Token expired'
        })
      } else {
        next(error)
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
          status: true,
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
      }  else if (error.message === 'jwt expired'){
        return res.status(401).json({
          message: 'Token expired'
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
        status: true,
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
      }  else if (error.message === 'jwt expired'){
        return res.status(401).json({
          message: 'Token expired'
        })
      } else {
        next(error)
      }
    }
  }
}
export const preRecommendation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const category = req.body.preferences 
    const token = await extractor(req)
    const userId = await verifyVerificationToken(token)
    const list = await addToPreference(userId, category as string[])
    if(!list){
      return res.status(400).json({
        status: false,
        message: "Category not added to wishlist",
      })
    }
    return res.status(200).json({
      status: true,
      preferences: list.preferences
    })
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
export const addToWish = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const productid = req.query.product
    const user = req.user as DecodedToken
    const userid = user.id
    const add = await addToWishlist(userid, productid as string)
    if(!add){
      return res.status(400).json({
        status: false,
        message: "Product not added to wishlist",
      })
    }
    return res.status(200).json({
      status: true,
      wishlist: add.wishlist
    })
    
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
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const productid = req.query.product
    const user = req.user as DecodedToken
    const userid = user.id
    const remove = await removeFromWishlist(userid, productid as string)
    if(!remove) {
      return res.status(400).json({
        status: false,
        message: "Product not removed from wishlist",
      })
    }
    return res.status(200).json({
      status: true,
      productid
    })
  } catch (error) {
    next(error)
  }
}
export const userwishlist = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const user = req.user as DecodedToken
    const userid = user.id
    const product = await getUserWishlist(userid)
    if(product){
      return res.status(200).json({
        status: true,
        product
      })
    }
  } catch (error) {
    next(error)
  }
}
export const addPreference = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const category = req.body.preferences 
    const user = req.user as DecodedToken
    const userid = user.id
    
    const list = await addToPreference(userid, category as string[])
    if(!list){
      return res.status(400).json({
        status: false,
        message: "Category not added to wishlist",
      })
    }
    return res.status(200).json({
      status: true,
      preferences: list.preferences
    })
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
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const categoryid = req.body.preferences 
    const user = req.user as DecodedToken
    const userid = user.id
    const list = await removeFromPreference(userid, categoryid as string[])
    if(!list){
      return res.status(400).json({
        status: false,
        message: "Category not removed from wishlist",
      })
    }
    return res.status(200).json({
      status: true,
      preference: list.preferences
    })
  } catch (error) {
    next(error)
  }
}
export const userPreference = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
  }
  try {
    const user = req.user as DecodedToken
    const userid = user.id
    const preferences = await getUserPreference(userid)
    if(preferences){
      return res.status(200).json({
        status: true,
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
        status: true,
        authors
      })
    }
  } catch (error) {
    next(error)
  }
}