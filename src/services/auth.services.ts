import UserModel, { IUser } from "../models/User.model"
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { mail } from "../configs/delivermail"
export const registerUser = async (data: IUser): Promise<string> => {
    const hash = await argon2.hash(data.password)
    const user = await UserModel.create({
        username: data.username,
        email: data.email,
        role: data.role,
        password: hash
    })
    await user.save()
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
export const ValidateUserPassword = async (password:string, email: string): Promise<string> => {
    const result  = await UserModel.findOne({email})
    if(!result){
        throw new Error('authentication failed')
    }
    const user = result as IUser
    const verify = await argon2.verify(user.password, password) 
    if(!verify)  {
        throw new Error('authentication failed');
    }
    const data = { _id:user._id, email, role: user.role } as IUser
    const token = await generateToken(data, 'registration')   
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
    switch (type) {
        case 'verification':
            return await jwt.sign(userdata, process.env.VERIFY_PRIVATE_SECRET as string, { algorithm: 'RS256', expiresIn: '600' })
            break;
        case 'login':
            return await jwt.sign(userdata, process.env.AUTH_ACCESS_PRIVATE_SECRET as string, { algorithm: 'RS256', expiresIn: '900' })
            break;
        case 'reset':
            return await jwt.sign(userdata, process.env.RESET_PRIVATE_SECRET as string, { algorithm: 'RS256', expiresIn: '600' })
            break;
        default:
            return null
            break;
    }
}
export const changePassword = async (id: string, password: string) => {
    const hash = argon2.hash(password)
    await UserModel.findOneAndUpdate({ _id: id }, { $set: { password: hash }}, { upsert: true }) 
}
export const verifyResetToken = async (token:string): Promise<string> => {
    const decoded = await jwt.verify(token, process.env.RESET_PUBLIC_SECRET as string, {  algorithms:['HS256']}) as IUser
    const user = await UserByEmail(decoded.email)
    if(!user) {
        throw new Error('authentication failed');
    }
    const id = user._id as string
    return id
    
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
                      <p>&copy; 2024 Your Company. All rights reserved.</p>
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
// LOGIN:
// REGISTER:
// FORGET:
// RESET:
// MAIL: