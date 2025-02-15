import { Strategy as JWTStrategy } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { NextFunction, Request, Response } from 'express'
import { CheckUserExist, generateToken, limitUser, registerUser } from '../services/auth.services'
import { IUser } from '../models/User.model'

export interface DecodedToken {
    id: string
    name: string  
    email: string
    role:  'user' | 'creator' | 'admin'| undefined
}

const authorizationExtractor = function (req: Request): string | null {
  if ((req.headers.authorization != null) && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1]
    return token
  }
  return null
}
const secret = process.env.AUTH_ACCESS_TOKEN_PUBLIC_SECRET as string
if (!secret) {
  throw new Error('AUTH_ACCESS_TOKEN_SECRET is not defined')
}
export default new JWTStrategy(
  {
    jwtFromRequest: authorizationExtractor,
    secretOrKey: secret,
    algorithms: ['RS256']
  }, async (payload: DecodedToken, done): Promise<void> => {
    try {
      const user: IUser = await limitUser(payload.email)
      if (user !== null) {
        done(null, user)
      } else {
        done(null, false)
      }
    } catch (error) {
      done(error, false)
    }
  }
)

const clientID = process.env.GOOGLE_CLIENT_ID as string
if (!clientID) {
  throw new Error('GOOGLE_CLIENT_ID is not defined')
}
const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string
if (!clientSecret) {
  throw new Error('GOOGLE_CLIENT_SECRET is not defined')
}
export const GGstrategy =  new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL: process.env.CALLBACKURL as string,
    passReqToCallback   : true

}, async function( request, accessToken, refreshToken, profile: any, done){

  const data = {
    provider: profile.provider,
    provider_id: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    }
    const user = await CheckUserExist(data.provider_id)
    if(user){
      const token = await generateToken(user as IUser, 'login')
      return done(null, {token: token, action: 'login', role: user.role});
    } else{
     const token = await registerUser(data as IUser, 'verification')
     return done(null, {token: token, action: 'register', role: 'none'});
    }

}) 
export interface IRole {
  role: string[]
}
export const authorization = (roles: IRole): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as DecodedToken;
    const userRole = user.role ? [user.role] : [];
    
    const hasPermission = userRole.some((role) => roles.role.includes(role));
    
    if (!hasPermission) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }
    
    next(); 
  };
};