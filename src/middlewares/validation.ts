import { body, header } from 'express-validator'
export const registerValidation = [
  body('username')
    .exists()
    .withMessage('username is required')
    .isString()
    .withMessage('username should be string'),
  body('email')
    .exists()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Provide valid email'),
  body('password')
    .exists()
    .withMessage('password is required')
    .isString()
    .withMessage('password should be string')
]
export const loginValidation = [
  body('email')
    .exists()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Provide valid email'),
  body('password')
    .exists()
    .withMessage('password is required')
    .isString()
    .withMessage('password should be string')
]
export const forgetValidation = [
  body('email')
    .exists()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Provide valid email')
]
export const verifyValidation = [
  header('Authorization')
    .exists()
    .withMessage('Token is required')
]
export const resetPasswordValidation = [
  header('Authorization')
    .exists()
    .withMessage('Token is required'),
  body('password')
    .exists()
    .withMessage('password is required')
    .isString()
    .withMessage('password should be string')
]
export const otpValidation = [
    header('Authorization')
      .exists()
      .withMessage('Token is required'),
    body('otp')
      .exists()
      .withMessage('otp is required')
      .isString()
      .withMessage('otp should be string')
]
export const assignroleValidation = [
    header('Authorization')
      .exists()
      .withMessage('Token is required'),
    body('role')
      .exists()
      .withMessage('role is required')
      .isString()
      .withMessage('role should be string')
  ]
  export const initVerifyValidation = [
    body('email')
      .exists()
      .withMessage('email is required')
      .isString()
      .withMessage('email should be string')
  ]