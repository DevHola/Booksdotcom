import express from 'express'
import { forgetPassword, register, login, ResetPassword, authUser, activateAccount, assignRole, initActivation, addToWish, removewishlist, userwishlist, addPreference, removePreference, featuredAuthors, userPreference } from '../controllers/auth.controllers'
import passport from 'passport'
import { addAuthorAchievement, createUserProfile, editUserProfile, getAuthorProfile, removeAuthorAchievement } from '../controllers/profile.controllers'
import { upload } from '../middlewares/cloudinary'
import { achievementValidation, assignroleValidation, authTokenValidation, forgetValidation, initVerifyValidation, loginValidation, otpValidation, preferenceValidation, profileValidation, registerValidation, removeAchievementValidation, resetPasswordValidation, wishlistValidation } from '../middlewares/validation'
import { authorization } from '../middlewares/passport'
const AuthRouter = express.Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 * 
 *     WishlistItem:
 *       type: object
 *       properties:
 *         itemId:
 *           type: string[]
 *           description: The ID of the product in the wishlist
 * 
 *     Preference:
 *       type: object
 *       properties:
 *         category:
 *           type: string[]
 *           description: The id of category in preference
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
AuthRouter.post('/register', registerValidation, register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: Incorrect credentials
 */
AuthRouter.post('/login', loginValidation, login)

/**
 * @swagger
 * /auth/forget:
 *   post:
 *     summary: Request a password reset
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset token sent to email
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
AuthRouter.post('/forget', forgetValidation, forgetPassword)

/**
 * @swagger
 * /auth/reset:
 *   put:
 *     summary: Reset the user's password
 *     tags: [User]
 *     security:
 *       - Authorization: [] # Use Bearer Token for authorization
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for rest authorization - Get from forget password mail sent to user email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 */

AuthRouter.put('/reset', resetPasswordValidation, ResetPassword)

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get authenticated user's information
 *     tags: [User]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: headers
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     responses:
 *       200:
 *         description: Authenticated user's information
 *       401:
 *         description: Unauthorized
 */
AuthRouter.get('/user', authTokenValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user','creator','admin']}), authUser)

/**
 * @swagger
 * /auth/activation:
 *   patch:
 *     summary: Activate a user account
 *     tags: [User]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization - GET FROM REGISTER RESPONSE SHORT TIME TOKEN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account activated successfully
 *       400:
 *         description: Bad request
 */
AuthRouter.patch('/activation', otpValidation, activateAccount)
/**
 * @swagger
 * /auth/assignrole:
 *   patch:
 *     summary: a user choose a role
 *     tags: [User]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization - GET FROM REGISTER RESPONSE SHORT TIME TOKEN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account role assigned successfully
 *       400:
 *         description: Bad request
 */
AuthRouter.patch('/assignrole', assignroleValidation, assignRole)
/**
 * @swagger
 * /auth/init/verify:
 *   patch:
 *     summary: user initiate verification
 *     tags: [User]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization - GET FROM REGISTER RESPONSE SHORT TIME TOKEN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account verification mail successfully sent
 *       400:
 *         description: Bad request
 */
AuthRouter.post('/init/verify', initVerifyValidation, initActivation)
AuthRouter.get('/', (req, res) => {
    res.send("<button><a href='/api/v1/auth/google'>Login With Google</a></button>")
});
/**
 * @swagger
 * /auth/google:
 *   patch:
 *     summary: google 0Auth
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       200:
 *         description: Account Auth successful
 *       400:
 *         description: Bad request
 */
AuthRouter.get('/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ]
  }));
AuthRouter.get('/google/callback', passport.authenticate( 'google', {
     session: false,
     failureRedirect: '/callback/failure'
  }), (req, res) => {
    const {token, action} = req.user as {token: string, action: string}
    if (action === 'login'){  
     return res.redirect(`http://yourfrontend.com/login-success?token=${token}`);
    } else if (action === 'register'){
      return res.redirect(`http://yourfrontend.com/register-success?token=${token}`);
    }
    // res.json({
    //     accesstoken: req.user
    // })
  });
AuthRouter.get('/callback/failure' , (req , res) => {
    res.status(401).json({
        message: 'Authentication failed'
    });
})
/**
 * @swagger
 * /auth/user/wishlist:
 *   post:
 *     summary: Add an item to the user's wishlist - product(id)
 *     tags: [Wishlist]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     requestBody:
 *       required: true
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item added to wishlist
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized

 */
AuthRouter.post('/user/wishlist', wishlistValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), addToWish)

/**
 * @swagger
 * /auth/user/wishlist:
 *   patch:
 *     summary: Remove an item from the user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
AuthRouter.patch('/user/wishlist', wishlistValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), removewishlist)
/**
 * @swagger
 * /auth/user/wishlist:
 *   get:
 *     summary: Get authenticated user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     responses:
 *       200:
 *         description: Authenticated user's wishlist information
 *       401:
 *         description: Unauthorized
 */
AuthRouter.get('/user/wishlist', authTokenValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), userwishlist)
/**
 * @swagger
 * /auth/user/preference:
 *   post:
 *     summary: Add a user preference - preference(categoryid) 
 *     tags: [Preferences]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Preference added
 *       401:
 *         description: Unauthorized
 */
AuthRouter.post('/user/preference', preferenceValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), addPreference)
/**
 * @swagger
 * /auth/user/preference:
 *   patch:
 *     summary: Remove items from the user's category preference
 *     tags: [Preferences]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Item removed from preferences
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
AuthRouter.patch('/user/preference', preferenceValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), removePreference)
/**
 * @swagger
 * /auth/user/preference:
 *   get:
 *     summary: Get authenticated user's preferences
 *     tags: [Preferences]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     responses:
 *       200:
 *         description: Authenticated user's Preference information
 *       401:
 *         description: Unauthorized
 */
AuthRouter.get('/user/preference', authTokenValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), userPreference)
/**
 * @swagger
 * /auth/featured/authors:
 *   get:
 *     summary: Get a list of featured authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of featured authors
 */
AuthRouter.get('/featured/authors', featuredAuthors)
  
// author profile
/**
 * @swagger
 * /auth/author/profile:
 *   post:
 *     summary: create a author profile  
 *     tags: [Authors]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               biography:
 *                 type: string
 *               img:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile created
 *       401:
 *         description: Unauthorized
 */
AuthRouter.post('/author/profile', profileValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), upload.array('img',1), createUserProfile)
/**
 * @swagger
 * /auth/author/profile:
 *   patch:
 *     summary: Edit author's profile
 *     tags: [Authors]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               biography:
 *                 type: string
 *               img:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
AuthRouter.patch('/author/profile/edit', passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), editUserProfile)
/**
 * @swagger
 * /auth/author/profile:
 *   get:
 *     summary: Get an author profile
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Author's profile
 */

AuthRouter.get('/author/profile', getAuthorProfile)  
/**
 * @swagger
 * /auth/author/achievement:
 *   post:
 *     summary: create a author achievement  
 *     tags: [Authors]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: author achievement created
 *       401:
 *         description: Unauthorized
 */
AuthRouter.post('/author/achievement', achievementValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), addAuthorAchievement)
/**
 * @swagger
 * /auth/author/achievement:
 *   patch:
 *     summary: Edit author's achievement
 *     tags: [Authors]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: achivement updated
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

AuthRouter.patch('/author/achievement', removeAchievementValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), removeAuthorAchievement)
export default AuthRouter
