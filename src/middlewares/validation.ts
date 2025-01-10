import { body, header } from 'express-validator'

export const registerValidation = [
  body('username')
    .exists({ checkFalsy: true })
    .withMessage('username is required')
    .isString()
    .withMessage('username should be a string')
    .trim()
    .isLength({ min: 3 })
    .withMessage('username must be at least 3 characters long'),
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
    .exists()
    .withMessage('Token is required'),
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
  ]