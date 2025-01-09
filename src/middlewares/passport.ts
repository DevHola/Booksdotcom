import { Strategy as JWTStrategy } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { type Request } from 'express'
import { CheckUserExist, generateToken, registerUser, UserByEmail } from '../services/auth.services'
import { IUser } from '../models/User.model'

export interface DecodedToken {
    id: string
    email: string
    role: string | null
}

const authorizationExtractor = function (req: Request): string | null {
  if ((req.headers.authorization != null) && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
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
      const user: IUser = await UserByEmail(payload.email)
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
    callbackURL: "http://localhost:8000/api/auth/google/callback",
    passReqToCallback   : true

}, async function( request, accessToken, refreshToken, profile: any, done){

  const data = {
    provider: profile.provider,
    provider_id: profile.id,
    username: profile.displayName,
    email: profile.emails[0].value,
    }
    const user = await CheckUserExist(data.provider_id)
    if(user){
      const token = await generateToken(user as IUser, 'login')
      return done(null, {token: token});
    } else{
     const token = await registerUser(data as IUser, 'verification')
      return done(null, {token: token});
    }

}) 