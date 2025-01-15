import { body, header, query, param } from 'express-validator'
import { UserByEmail, UserExist, UsernameExist } from '../services/auth.services';

export const registerValidation = [
  body('username')
    .exists({ checkFalsy: true })
    .withMessage('username is required')
    .isString()
    .withMessage('username should be a string')
    .trim()
    .custom(async (username) => {
      const user = await UsernameExist(username)
      if(user){
        throw new Error('Username already in use')
      }
    })
    .isLength({ min: 3 })
    .withMessage('username must be at least 3 characters long'),
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('email is required')
    .isEmail()
    .withMessage('Provide a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      const user = await UserExist(email)
      if(user){
        throw new Error('Account already exists')
      }
    }),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('password is required')
    .isString()
    .withMessage('password should be a string')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters long')
];
export const loginValidation = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('email is required')
    .isEmail()
    .withMessage('Provide a valid email')
    .normalizeEmail(),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('password is required')
    .isString()
    .withMessage('password should be a string')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long')
]
export const forgetValidation = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('email is required')
    .isEmail()
    .withMessage('Provide a valid email')
    .normalizeEmail()
    .custom(async (email) => { 
      const user = await UserByEmail(email)
      if(user.provider !== 'local') throw new Error('Proceed to login via socials login')
    })
]
export const verifyValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>')
];
export const resetPasswordValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('password is required')
    .isString()
    .withMessage('password should be a string')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long')
]
export const otpValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('otp')
    .exists({ checkFalsy: true })
    .withMessage('otp is required')
    .isString()
    .withMessage('otp should be a string')
    .isLength({ max: 6, min: 6 })
    .withMessage('otp must be at least 6 characters long')
]
export const assignroleValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('role')
    .exists({ checkFalsy: true })
    .withMessage('role is required')
    .isString()
    .withMessage('Provide a valid email')
  ]
export const initVerifyValidation = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('email is required')
    .isEmail()
    .withMessage('Provide a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      const user = await UserExist(email)
      if(!user) throw new Error('User does not exist')
      if(user.isverified !== false) throw new Error('Account already Active')
      if(user.provider !== 'local' ) throw new Error('Proceed to login via socials login')
    })
  ]
export const authTokenValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  ]
// wishlist
export const wishlistValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  query('product')
      .exists({ checkFalsy: true })
      .withMessage('Product ID is required')
      .isString()
      .withMessage('Product ID must be a string')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Product ID cannot be empty'),
  ]
// preferences
export const preferenceValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('preferences')
    .exists({ checkFalsy: true })
    .withMessage('preferences array is required')
    .isArray()
    .withMessage('preferences must be an array'),
  body('preferences.*')
    .isString()
    .withMessage('Each category ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category ID cannot be empty')
    ];
// profile
export const profileValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  // body('biography')
  //   .exists({ checkFalsy: true })
  //   .withMessage('biography is required')
  //   .isString()
  //   .withMessage('biography must be a string'),
  body('img')
    .optional()
    .isArray({ max: 1 })
    .withMessage('img must be an array with a maximum of 1 image'),
  body('img.*')
    .optional()
    .isString()
    .withMessage('Each image must be a string (e.g., URL or file path)')
  ]
// achievements
export const achievementValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('title is required')
    .isString()
    .withMessage('Provide a valid title'),
  body('description')
    .exists({ checkFalsy: true })
    .withMessage('description is required')
    .isString()
    .withMessage('Provide a valid description')
]
export const removeAchievementValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  query('achievement')
    .exists({ checkFalsy: true })
    .withMessage('achievement ID is required')
    .isString()
    .withMessage('Provide a valid achievement')
]
  // category validation
export const categoryValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Category name is required')
    .isString()
    .withMessage('Category name must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category name cannot be empty'),

  param('id')
    .optional()
    .isString()
    .withMessage('Category ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category ID cannot be empty'),  
]
export const categoryNameOrIdValidation = [
  body('name')
    .optional()
    .isString()
    .withMessage('Category name must be a string')
    .isLength({ min: 1 })
    .withMessage('Category name cannot be empty'),

  param('id')
    .optional()
    .isString()
    .withMessage('Category ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category ID cannot be empty'),  
]
//Products
//Format
export const formatValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('type')
    .exists({ checkFalsy: true })
    .withMessage('Format type is required')
    .isString()
    .withMessage('Format type must be string')
    .trim(),
  body('price')
    .exists({ checkFalsy: true })
    .withMessage('price is required')
    .isString()
    .withMessage('price must be string')
    .trim(),
  body('stock')
    .optional()
    .isString()
    .withMessage('stock must be a string')
    .trim(),
  body('product')
    .exists({ checkFalsy: true })
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Product ID cannot be empty'),
  body('file')
    .optional()
    .isArray({ max: 1 })
    .withMessage('file must be an array with a maximum of 1 image'),
  body('file.*')
    .optional()
    .isString()
    .withMessage('Each file must be a string (e.g., URL or file path)')
]
export const removeformatValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('productid')
    .exists({ checkFalsy: true })
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be string')
    .trim(),
  body('formatid')
    .exists({ checkFalsy: true })
    .withMessage('Format ID required')
    .isString()
    .withMessage('Format ID must be string')
    .trim()
]
export const StockValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('productid')
    .exists({ checkFalsy: true })
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be string')
    .trim(),
  body('formatid')
    .exists({ checkFalsy: true })
    .withMessage('Format ID required')
    .isString()
    .withMessage('Format ID must be string')
    .trim(),
  body('stock')
    .exists({ checkFalsy: true })
    .withMessage('stock is required')
    .isString()
    .withMessage('stock must be a string')
    .trim(),
]
export const updatePriceValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('productid')
    .exists({ checkFalsy: true })
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be string')
    .trim(),
  body('formatid')
    .exists({ checkFalsy: true })
    .withMessage('Format ID required')
    .isString()
    .withMessage('Format ID must be string')
    .trim(),
  body('price')
    .exists({ checkFalsy: true })
    .withMessage('Price is required')
    .isString()
    .withMessage('stock must be a string')
    .trim()
]
export const previewFileValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  query('productid')
    .exists({ checkFalsy: true })
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be string')
    .trim(),
  body('file')
    .optional()
    .isArray({ max: 1 })
    .withMessage('file must be an array with a maximum of 1 image'),
  body('file.*')
    .optional()
    .isString()
    .withMessage('Each file must be a string (e.g., URL or file path)')
]
//Order
//Review
export const reviewValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('rateNumber')
    .exists({ checkFalsy: true })
    .withMessage('Rating Number is required')
    .isNumeric()
    .withMessage('Rating Number must be numeric')
    .trim(),
  body('review')
    .optional()
    .isString()
    .withMessage('Review text must be string')
    .isLength({min: 4})
    .withMessage('Review text must be a minumum of 4 letters.'),
  body('product')
    .exists({ checkFalsy: true })
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Product ID cannot be empty')
]
export const productReviewsValidation = [
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Product ID cannot be empty')
]
export const editReviewValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  body('rateNumber')
    .exists({ checkFalsy: true })
    .withMessage('Rating Number is required')
    .isNumeric()
    .withMessage('Rating Number must be numeric')
    .trim(),
  body('review')
    .optional()
    .isString()
    .withMessage('Review text must be string')
    .isLength({min: 4})
    .withMessage('Review text must be a minumum of 4 letters.'),
  body('reviewid')
    .exists({ checkFalsy: true })
    .withMessage('Review ID is required')
    .isString()
    .withMessage('Review ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Review ID cannot be empty') 
]
export const getUserReviewsValidation = [
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('User ID cannot be empty')
]
export const getReviewValidation = [
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('Review ID is required')
    .isString()
    .withMessage('Review ID must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Review ID cannot be empty')
]