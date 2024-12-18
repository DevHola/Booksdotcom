import express from 'express'
import { forgetPassword, register, login, ResetPassword, authUser, activateAccount, assignRole, initActivation } from '../controllers/auth.controllers'
import passport from 'passport'
const AuthRouter = express.Router()
AuthRouter.post('/register', register)
AuthRouter.post('/login', login)
AuthRouter.get('/forget', forgetPassword)
AuthRouter.put('/reset', ResetPassword)
AuthRouter.get('/user', passport.authenticate('jwt', { session: false }),  authUser)
AuthRouter.patch('/activation', activateAccount)
AuthRouter.patch('/assignrole', assignRole)
AuthRouter.post('/init/verify', initActivation)
AuthRouter.get('/', (req, res) => {
    res.send("<button><a href='/api/v1/auth/google'>Login With Google</a></button>")
});
AuthRouter.get('/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ]
  }));
AuthRouter.get('/google/callback', passport.authenticate( 'google', {
     session: false,
     failureRedirect: '/callback/failure'
  }), (req, res) => {
    res.json({
        accesstoken: req.user
    })
  });
AuthRouter.get('/callback/failure' , (req , res) => {
    res.status(401).json({
        message: 'Authentication failed'
    });
})

export default AuthRouter
