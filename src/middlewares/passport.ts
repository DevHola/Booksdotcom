import { Strategy as JWTStrategy } from 'passport-jwt'
import { type Request } from 'express'
import { UserByEmail } from '../services/auth.services'
import { IUser } from '../models/User.model'

export interface DecodedToken {
    id: string
    email: string
    role: string
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
