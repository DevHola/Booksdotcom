import UserModel, { IUser } from "../models/User.model"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { mail } from "../configs/delivermail"
import ProfileModel from "../models/profile.model"
export interface ISearchResult{
    authors: any ,
    currentPage: number,
    totalPage: number,
    totalauthors: number
  }
export const registerUser = async (data: IUser, type: string): Promise<string> => {
    if(type === 'local'){
        const user = await UserModel.create({
            username: data.username,
            email: data.email,
            password: data.password
        })
        await user.save()
    } else {
        const user = await UserModel.create({
            username: data.username,
            email: data.email,
            provider: data.provider,
            provider_id: data.provider_id
        })
        await user.save()
    }
    const authtoken = await generateToken(data, 'verification')   
    if (authtoken) {
        return authtoken;
    } else {
        throw new Error('Token generation failed');
    }
}
export const UserByEmail = async (email:string): Promise<IUser> => {
    const user = await UserModel.findOne({email: email})
    if(!user) {
        throw new Error('Account not found')
    }
    return user as IUser
}
export const UserExist = async (email:string): Promise<IUser> => {
    const user = await UserModel.findOne({email: email})
    return user as IUser
} 

export const CheckUserExist = async (id:string): Promise<IUser> => {
    const user = await UserModel.findOne({provider_id: id})
    return user as IUser
} 
export const ValidateUserPassword = async (email: string, password:string): Promise<string> => {
    const result  = await UserModel.findOne({email})
    if(!result){
        throw new Error('authentication failed')
    }
    if(result.isverified === false) {
        throw new Error('Account not verified')
    }
    const user = result as IUser
    const hash = user.password as string
    const verify = await bcrypt.compare(password, hash)
    if(!verify)  {
        throw new Error('authentication failed');
    }
    const data = { _id:user._id, email, role: user.role } as IUser
    const token = await generateToken(data, 'login')   
    if (token) {
        return token;
    } else {
        throw new Error('Token generation failed');
    }
}
export const getUserById = async (id: string): Promise<IUser> => {
    const user = await UserModel.findOne({ _id: id }, { _id: 1, username: 1, email: 1, role: 1, isverified: 1 })
    return user as IUser 
}
export const generateToken = async (data:IUser, type: string): Promise<string | null> => {
    const userdata = {id: data._id,email: data.email,role: data.role}
    const verifydata = {id: data._id,email: data.email}    
    switch (type) {
        case 'verification':
            return await jwt.sign(verifydata, process.env.VERIFY_PRIVATE_SECRET as string, { algorithm: 'RS256', expiresIn: process.env.AUTH_TOKEN_EXPIRY as string })
            break;
        case 'login':
            return await jwt.sign(userdata, process.env.AUTH_ACCESS_PRIVATE_SECRET as string, { algorithm: 'RS256', expiresIn: process.env.AUTH_TOKEN_EXPIRY as string })
            break;
        case 'reset':
            return await jwt.sign(userdata, process.env.RESET_PRIVATE_SECRET as string, { algorithm: 'RS256', expiresIn: process.env.AUTH_TOKEN_EXPIRY as string })
            break;
        default:
            return null
            break;
    }
}
export const changePassword = async (id: string, password: string) => {
    const hash = await bcrypt.hash(password, 10)
    await UserModel.findOneAndUpdate({ _id: id }, { $set: { password: hash }}, { upsert: true }) 
}
export const verifyResetToken = async (token:string): Promise<string> => {
    const decoded = await jwt.verify(token, process.env.RESET_PUBLIC_SECRET as string, {  algorithms:['RS256'] }) as IUser
    const user = await UserByEmail(decoded.email)
    if(!user) {
        throw new Error('authentication failed');
    }
    const id = user._id as string
    return id
    
}
export const verifyVerificationToken = async (token:string): Promise<string> => {
    const decoded = await jwt.verify(token, process.env.VERIFY_PUBLIC_SECRET as string, {  algorithms:['RS256'] }) as IUser
    const user = await UserByEmail(decoded.email)
    if(!user) {
        throw new Error('authentication failed');
    }
    const id = user._id as string
    return id
    
}
export const checkOTP = async (otpdata:string, id: string): Promise<boolean> => {
    const user = await UserModel.findOne({_id: id}) as IUser
    const verify = user.otp === otpdata
    return verify
}
export const activate = async (id: string) => {
    const user = await UserModel.findByIdAndUpdate(id, { isverified: true, otp: null })    
    return user as IUser
}
export const assignUserRole = async (id:string, role: string) => {
    const user = await UserModel.findByIdAndUpdate(id, { role:role } )
    return user as IUser
    // add if user role is creator create a profile for the user which they would need to update to be able to use the platform
}
export const addToWishlist = async (userid: string, productid: string) => {
    const user = await UserModel.findById(userid)
    if(!user){
        throw new Error('user not found')
    }
    if (user.wishlist.includes(productid)) {
        throw new Error('Product already in wishlist');
    }
    user.wishlist.push(productid)
    return await user.save()
}
export const removeFromWishlist = async (userid: string, productid: string): Promise<IUser> => {
    return await UserModel.findByIdAndUpdate(userid, {
        $pull: {
            wishlist: productid
        }
    }, {new: true}) as IUser  
}
export const getUserWishlist = async (userid: string): Promise<IUser> => {
    return await UserModel.findOne({_id: userid}, {
        wishlist: 1
    }).populate("wishlist").exec() as IUser
}
export const addToPreference = async (userid: string, categoryid: string[]) => {
    const user = await UserModel.findById(userid)
    if(!user){
        throw new Error('user not found')
    }
    const updated = await UserModel.findByIdAndUpdate(user._id, {
        $addToSet: {
            preferences: {
                $each: categoryid
            }
        }
    }, { new: true })
    if(!updated){
        throw new Error('Error updating user preferences')
    }
    return updated as IUser
}
export const removeFromPreference = async (userid: string, category: string[]): Promise<IUser> => {
    console.log(category)
    return await UserModel.findByIdAndUpdate(userid, {
        $pull: {
            preferences: {
                $in: category
            }
        }
    }, {new: true}) as IUser  
}
export const getUserPreference = async (userid: string): Promise<IUser> => {
    return await UserModel.findOne({_id: userid}, {
        preferences: 1
    }).populate("preferences").exec() as IUser
}
export const getFeaturedAuthors = async (page: number, limit: number): Promise<ISearchResult> => {
    const [authors, totalauthors] = await Promise.all([
        await UserModel.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField:'profile',
                    foreignField:'_id',
                    as: 'profile'
                }
            },
            {
                $unwind: '$profile'
            },
            {
                $match: {
                    'type': 'creator',
                    'profile.isFeatured': true
                }
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    img:'$profile.imgsrc',
    
                }
            }
        ]).skip((page - 1 ) * limit).limit(limit).exec(),
        await ProfileModel.find({isFeatured: true}).countDocuments()
    ])
     
    return { authors, currentPage: page, totalPage: Math.ceil(totalauthors/limit), totalauthors }
}
export const extractor = async (req:any): Promise<string> => {
    const headers = req.headers['authorization']
        if(headers){
            const [ header, token ] = headers.split(' ')
            if (header !== 'Bearer' || (token.length === 0)) {
                throw new Error('Invalid Access Token' )
              }
              return token
        } else {
            throw new Error('Missing Access Credentials')
        }
    
}
export const otpgen = async (id: string): Promise<string> => {
    const code = Math.floor(Math.random() * 600000) + 100000;
    await storeOTP(code.toString(), id)
    return code.toString()
}
const storeOTP = async (otpdata: string, id: string) => {
    await UserModel.findByIdAndUpdate(id, {otp: otpdata})
}
export const Resetpasswordmail = async (resettoken: string, email: string): Promise<mail> => {
    const url = `${process.env.FRONTEND_URL}/auth/token=${resettoken}`
    const content = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #007bff;
                      color: #ffffff;
                  }
                  .content {
                      padding: 20px;
                  }
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      color: #ffffff;
                      background-color: #007bff;
                      text-decoration: none;
                      border-radius: 4px;
                      text-align: center;
                  }
                  .footer {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #f4f4f4;
                      color: #777777;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Password Reset Request</h1>
                  </div>
                  <div class="content">
                      <p>Hello,</p>
                      <p>We received a request to reset your password. Click the button below to reset your password:</p>
                      <p>
                          <a href="${url}" class="button">Reset Password</a>
                      </p>
                      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                      <p>Thank you,<br>The Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2024 Booksdotcom. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`
    const subject = 'ACCOUNT PASSWORD RESET'
    const from = process.env.FROM ?? 'no-reply@yourcompany.com'
    const data: mail = {
      to: email,
      content,
      subject,
      from
    }
    return data
  }
  export const verificationmail = async (resettoken: string, email: string, otp: string): Promise<mail> => {
    const url = `${process.env.FRONTEND_URL}/auth/verify/token=${resettoken}`
    const content = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #007bff;
                      color: #ffffff;
                  }
                  .content {
                      padding: 20px;
                  }
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      color: #ffffff;
                      background-color: #007bff;
                      text-decoration: none;
                      border-radius: 4px;
                      text-align: center;
                  }
                  .footer {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #f4f4f4;
                      color: #777777;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Verification Request</h1>
                  </div>
                  <div class="content">
                      <p>Hello,</p>
                      <p>We received a request to verify your Account. Click the button below to reset your password:</p>
                      <p>
                          <a href="${url}" class="button">Verify</a>
                      </p>
                      <h1> Verification code </h1>
                      <p>${otp}</p>
                      <p>Thank you,<br>The Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2024 Booksdotcom. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`
    const subject = 'ACCOUNT VERIFICATION'
    const from = process.env.FROM ?? 'no-reply@yourcompany.com'
    const data: mail = {
      to: email,
      content,
      subject,
      from
    }
    return data
  }
  export const Regverificationmail = async ( email: string, otp: string): Promise<mail> => {
    const content = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #007bff;
                      color: #ffffff;
                  }
                  .content {
                      padding: 20px;
                  }
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      color: #ffffff;
                      background-color: #007bff;
                      text-decoration: none;
                      border-radius: 4px;
                      text-align: center;
                  }
                  .footer {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #f4f4f4;
                      color: #777777;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Verification</h1>
                  </div>
                  <div class="content">
                      <p>Hello,</p>
                      <p>We received a request to verify your Account. </p>
                      <h1> Verification code </h1>
                      <p>${otp}</p>
                      <p>Thank you,<br>The Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2024 Booksdotcom. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`
    const subject = 'ACCOUNT VERIFICATION'
    const from = process.env.FROM ?? 'no-reply@yourcompany.com'
    const data: mail = {
      to: email,
      content,
      subject,
      from
    }
    return data
  }
// LOGIN:
// REGISTER:
// FORGET:
// RESET:
// MAIL:
// REQUEST: VERIFICICATION
// VERIFICATION:-
// PROFILE:-