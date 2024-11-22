import UserModel, { IUser } from "../models/User.model"
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
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
    await UserModel.findByIdAndUpdate(id, { password: hash}) 
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
// LOGIN:
// REGISTER:
// FORGET:
// RESET:
// MAIL: FOR RESET FORGET TOKEN 