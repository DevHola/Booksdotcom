"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const passport_1 = __importDefault(require("passport"));
const profile_controllers_1 = require("../controllers/profile.controllers");
const cloudinary_1 = require("../middlewares/cloudinary");
const validation_1 = require("../middlewares/validation");
const passport_2 = require("../middlewares/passport");
const AuthRouter = express_1.default.Router();
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
 *           type: array
 *           items:
 *             type: string
 *           description: The ID of the product in the wishlist
 *
 *     Preference:
 *       type: object
 *       properties:
 *         category:
 *           type: array
 *           items:
 *             type: string
 *           description: The ID of category in preference
 *
 *     Profile:
 *       type: object
 *       properties:
 *         bio:
 *           type: string
 *           description: The author biography
 *         img:
 *           type: string
 *           description: The author image link
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
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
AuthRouter.post('/register', validation_1.registerValidation, auth_controllers_1.register);
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
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: I
 */
AuthRouter.post('/login', validation_1.loginValidation, auth_controllers_1.login);
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
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Reset token sent to email
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
AuthRouter.post('/forget', validation_1.forgetValidation, auth_controllers_1.forgetPassword);
/**
 * @swagger
 * /auth/reset:
 *   put:
 *     summary: Reset the user's password
 *     tags: [User]
 *     security:
 *       - BearerAuth: [] # Reference the security scheme correctly
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for password reset authorization - Get from forget password email sent to user
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
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 */
AuthRouter.put('/reset', validation_1.resetPasswordValidation, auth_controllers_1.ResetPassword);
/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get authenticated user's information
 *     tags: [User]
 *     security:
 *       - BearerAuth: [] # Correct security scheme
 *     parameters:
 *       - in: header  # Fixed from "headers" to "header"
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
AuthRouter.get('/user', validation_1.authTokenValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user', 'creator', 'admin'] }), auth_controllers_1.authUser);
/**
 * @swagger
 * /auth/activation:
 *   patch:
 *     summary: Activate a user account
 *     tags: [User]
 *     security:
 *       - BearerAuth: [] # Corrected security scheme
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization - Get from register response (short-lived token)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: One-time password (OTP) for account activation
 *             required:
 *               - otp
 *     responses:
 *       200:
 *         description: Account activated successfully
 *       400:
 *         description: Bad request
 */
AuthRouter.patch('/activation', validation_1.otpValidation, auth_controllers_1.activateAccount);
/**
 * @swagger
 * /auth/assignrole:
 *   patch:
 *     summary: A user chooses a role
 *     tags: [User]
 *     security:
 *       - BearerAuth: [] # Corrected security scheme
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization - Get from register response (short-lived token)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: The role to be assigned to the user
 *             required:
 *               - role
 *     responses:
 *       200:
 *         description: Account role assigned successfully
 *       400:
 *         description: Bad request
 */
AuthRouter.patch('/assignrole', validation_1.assignroleValidation, auth_controllers_1.assignRole);
/**
 * @swagger
 * /auth/init/verify:
 *   patch:
 *     summary: User initiates verification
 *     tags: [User]
 *     security:
 *       - BearerAuth: [] # Corrected security scheme
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization - Get from register response (short-lived token)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email to receive the verification link
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Account verification mail successfully sent
 *       400:
 *         description: Bad request
 */
AuthRouter.post('/init/verify', validation_1.initVerifyValidation, auth_controllers_1.initActivation);
AuthRouter.get('/', (req, res) => {
    res.send("<button><a href='/api/v1/auth/google'>Login With Google</a></button>");
});
/**
 * @swagger
 * /auth/google:
 *   patch:
 *     summary: Google OAuth authentication
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleToken:
 *                 type: string
 *                 description: The Google OAuth token provided by the client
 *     responses:
 *       200:
 *         description: Account authentication successful
 *       400:
 *         description: Bad request
 */
AuthRouter.get('/google', passport_1.default.authenticate('google', { scope: ['email', 'profile']
}));
AuthRouter.get('/google/callback', passport_1.default.authenticate('google', {
    session: false,
    failureRedirect: '/callback/failure'
}), (req, res) => {
    const { token, action } = req.user;
    if (action === 'login') {
        return res.redirect(`http://yourfrontend.com/login-success?token=${token}`);
    }
    else if (action === 'register') {
        return res.redirect(`http://yourfrontend.com/register-success?token=${token}`);
    }
});
AuthRouter.get('/callback/failure', (req, res) => {
    res.status(401).json({
        message: 'Authentication failed'
    });
});
/**
 * @swagger
 * /auth/user/wishlist:
 *   post:
 *     summary: Add an item to the user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: [] # Corrected security scheme
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
 *                 description: The product ID to add to the wishlist
 *     responses:
 *       200:
 *         description: Item successfully added to wishlist
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
AuthRouter.post('/user/wishlist', validation_1.wishlistValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), auth_controllers_1.addToWish);
/**
 * @swagger
 * /auth/user/wishlist:
 *   patch:
 *     summary: Remove an item from the user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: [] # Updated security to match Bearer token scheme
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
 *                 description: The product ID to remove from the wishlist
 *     responses:
 *       200:
 *         description: Item successfully removed from wishlist
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
AuthRouter.patch('/user/wishlist', validation_1.wishlistValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), auth_controllers_1.removewishlist);
/**
 * @swagger
 * /auth/user/wishlist:
 *   get:
 *     summary: Get the authenticated user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: [] # Updated security to match Bearer token scheme
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization
 *     responses:
 *       200:
 *         description: Successfully retrieved authenticated user's wishlist
 *       401:
 *         description: Unauthorized
 */
AuthRouter.get('/user/wishlist', validation_1.authTokenValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), auth_controllers_1.userwishlist);
/**
 * @swagger
 * /auth/user/preference:
 *   post:
 *     summary: Add a user preference - preference(categoryid)
 *     tags: [Preferences]
 *     security:
 *       - BearerAuth: []
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
AuthRouter.post('/user/preference', validation_1.preferenceValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), auth_controllers_1.addPreference);
/**
 * @swagger
 * /auth/user/preference:
 *   patch:
 *     summary: Remove items from the user's category preference
 *     tags: [Preferences]
 *     security:
 *       - BearerAuth: []
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
AuthRouter.patch('/user/preference', validation_1.preferenceValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), auth_controllers_1.removePreference);
/**
 * @swagger
 * /auth/user/preference:
 *   get:
 *     summary: Get authenticated user's preferences
 *     tags: [Preferences]
 *     security:
 *       - BearerAuth: []
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
AuthRouter.get('/user/preference', validation_1.authTokenValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), auth_controllers_1.userPreference);
/**
 * @swagger
 * /auth/featured/authors:
 *   get:
 *     summary: Get a list of featured authors
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: List of featured authors
 */
AuthRouter.get('/featured/authors', auth_controllers_1.featuredAuthors);
// author profile
/**
 * @swagger
 * /auth/author/profile:
 *   post:
 *     summary: create a author profile
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
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
AuthRouter.post('/author/profile', validation_1.profileValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), cloudinary_1.upload.array('img', 1), profile_controllers_1.createUserProfile);
/**
 * @swagger
 * /auth/author/profile:
 *   patch:
 *     summary: Edit author's profile
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
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
AuthRouter.patch('/author/profile/edit', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), profile_controllers_1.editUserProfile);
/**
 * @swagger
 * /auth/author/profile:
 *   get:
 *     summary: Get an author profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Author's profile
 */
AuthRouter.get('/author/profile', profile_controllers_1.getAuthorProfile);
/**
 * @swagger
 * /auth/author/achievement:
 *   post:
 *     summary: create a author achievement
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
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
AuthRouter.post('/author/achievement', validation_1.achievementValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), profile_controllers_1.addAuthorAchievement);
/**
 * @swagger
 * /auth/author/achievement:
 *   patch:
 *     summary: Edit author's achievement
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
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
AuthRouter.patch('/author/achievement', validation_1.removeAchievementValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), profile_controllers_1.removeAuthorAchievement);
exports.default = AuthRouter;
