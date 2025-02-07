import { body, header, query, param } from 'express-validator'
import { UserByEmail, UserExist, nameExist } from '../services/auth.services';
import { getCategoryByName } from '../services/category.services';
import { checkTypeExist } from '../services/format.services';
import mime from 'mime-types';
export const registerValidation = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('name is required')
    .isString()
    .withMessage('name should be a string')
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters long'),
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
  body('biography')
    .exists({ checkFalsy: true })
    .withMessage('biography is required')
    .isString()
    .withMessage('biography must be a string'),
  body('img')
    .optional()
    .isArray({ max: 1 })
    .withMessage('img must be an array with a maximum of 1 image'),
  body('img.*')
    .optional()
    .isString()
    .withMessage('Each image must be a string (e.g., URL or file path)')
    .custom(async (img) => {
      const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const mimeType = mime.lookup(img)
      if(mimeType && !allowedMimeTypes.includes(mimeType)){
        throw new Error('invalid file type')
      }
      return true
    })
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
    .withMessage('Category name cannot be empty')
    .custom(async (name)=> {
      const category = await getCategoryByName(name)
      if(category) throw new Error('Category already exists')
    }),

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
export const createproductValidation = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string"),

  body("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("isbn")
    .exists({ checkFalsy: true })
    .withMessage("ISBN is required")
    .isString()
    .withMessage("ISBN must be a string"),
    // .isISBN()
    // .withMessage("ISBN must be a valid ISBN"),

  body("author")
    .exists({ checkFalsy: true })
    .withMessage("Author is required"),

  body("publisher")
    .exists({ checkFalsy: true })
    .withMessage("Publisher is required")
    .isString()
    .withMessage("Publisher must be a string"),

  body("published_Date")
    .exists({ checkFalsy: true })
    .withMessage("Published Date is required")
    .isISO8601()
    .withMessage("Published Date must be a valid date"),

  body("noOfPages")
    .exists({ checkFalsy: true })
    .withMessage("Number of Pages is required")
    .isInt()
    .withMessage("Number of Pages must be an integer"),
  
  body("img.*")
    .exists({ checkFalsy: true })
    .withMessage("Each image is required")
    .custom(async (img)=> {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
      const mimeType = mime.lookup(img)
      if(mimeType && !allowedMimeTypes.includes(mimeType)) {
        throw new Error('Invalid image type')
      }
      return true
    }),

  body("language")
    .exists({ checkFalsy: true })
    .withMessage("Language is required")
    .isString()
    .withMessage("Language must be a string"),

  body("categoryid")
    .exists({ checkFalsy: true })
    .withMessage("Category ID is required")
    .isString()
    .withMessage("Category ID must be a string"),
]
export const editproductValidation = [
  header("Authorization")
    .exists({ checkFalsy: true })
    .withMessage("Authorization header is required")
    .isString()
    .withMessage("Authorization header must be a string")
    .matches(/^Bearer\s.+$/)
    .withMessage("Authorization header must be in the format: Bearer <token>"),

  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("isbn")
    .exists({ checkFalsy: true })
    .withMessage("ISBN is required")
    .isString()
    .withMessage("ISBN must be a string"),
    // .isISBN()
    // .withMessage("ISBN must be a valid ISBN"),

  body("author")
    .exists({ checkFalsy: true })
    .withMessage("Author is required")
    .isArray()
    .withMessage("Author must be an array of strings"),

  body("publisher")
    .exists({ checkFalsy: true })
    .withMessage("Publisher is required")
    .isString()
    .withMessage("Publisher must be a string"),

  body("published_Date")
    .exists({ checkFalsy: true })
    .withMessage("Published Date is required")
    .isISO8601()
    .withMessage("Published Date must be a valid date"),

  body("noOfPages")
    .exists({ checkFalsy: true })
    .withMessage("Number of Pages is required")
    .isInt()
    .withMessage("Number of Pages must be an integer"),

  body("language")
    .exists({ checkFalsy: true })
    .withMessage("Language is required")
    .isString()
    .withMessage("Language must be a string")
]
export const editProductImgValidation = [
  body("file")
    .isArray({ max: 4, min: 1 })
    .withMessage("file must be an array with a maximum of 4 images"),
  body("file.*")
    .exists({ checkFalsy: true })
    .withMessage("Each image is required")
    .custom(async (img)=> {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
      const mimeType = mime.lookup(img)
      if(mimeType && !allowedMimeTypes.includes(mimeType)) {
        throw new Error('Invalid image type')
      }
    })

]
export const getProductbyTitleV =[
  param('title')
    .exists({ checkFalsy: true })
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')  
]
//Coupon
export const validateCoupon = [
  body("code")
    .exists({ checkFalsy: true })
    .withMessage("Coupon code is required")
    .isString()
    .withMessage("Coupon code must be string"),
  body("type")
    .exists({ checkFalsy: true })
    .withMessage("Coupon discount type is required")
    .isIn(["fixed", "percentage"])
    .withMessage("Type must be either 'fixed' or 'percentage'"),
  body("expiresAt")
    .exists({ checkFalsy: true })
    .withMessage("Coupon expiration date is required")
    .isISO8601()
    .toDate()
    .withMessage("Expiration date must be a valid date"),
  body("discount")
    .exists({ checkFalsy: true })
    .withMessage("Coupon discount is required")
    .isFloat({ gt: 0 })
    .withMessage("Discount must be a positive number"),
  body("ruleType")
    .exists({ checkFalsy: true })
    .withMessage("Coupon ruletype is required")
    .isIn([
        "none", "month-specific", "day-specific-in-month", "day-specific-in-week", "month-and-day-specific", "month-and-days-of-week-specific", "day-range-specific", "time-period-specific"
    ])
    .withMessage("Invalid ruleType value"),
  body("product")
    .isArray()
    .withMessage("Product must be an array of product IDs"),
  body("rules.limit")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Limit must be a positive integer"),
  body("rules.month")
    .optional()
    .isArray()
    .withMessage("Month must be an array"),
  body("rules.day")
    .optional()
    .isArray()
    .withMessage("Day must be an array of numbers"),
  body("rules.daysOfWeek")
    .optional()
    .isArray()
    .withMessage("Days of week must be an array of strings"),
  body("rules.startDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),
  body("rules.endDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date"),
]
export const validateCouponChecker = [
  query('coupon')
    .exists({ checkFalsy:true })
    .withMessage('Coupon code is required')
    .isString()
    .withMessage('Coupon code must be a string'),
  query('coupon')
    .exists({ checkFalsy:true })
    .withMessage('Coupon code is required')
    .isString()
    .withMessage('Coupon code must be a string')
]
export const validateCouponDelete = [
  query('coupon')
    .exists({ checkFalsy:true })
    .withMessage('Coupon code is required')
    .isString()
    .withMessage('Coupon code must be a string')
]
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
    .isInt()
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
    .exists({ checkFalsy: true })
    .withMessage('file is required')
    .isArray({ max: 1 })
    .withMessage('file must be an array with a maximum of 1 image'),
  body('file.*')
    .exists({ checkFalsy: true })
    .withMessage('Each file is required')
    .custom(async (file) => {
      const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const mimeType = mime.lookup(file)
      if(mimeType && !allowedMimeTypes.includes(mimeType)){
        throw new Error('invalid file type')
      }
      return true
    })
]
//Order

export const validateOrder = [
  body('total')
    .exists({ checkFalsy: true }).withMessage('Total is required')
    .isInt({ min: 1 }).withMessage('Total must be a positive integer'),

  body('products')
    .isArray({ min: 1 }).withMessage('Products must be an array with at least one item'),

  body('products.*.product')
    .exists({ checkFalsy: true }).withMessage('Product ID is required')
    .isString().withMessage('Product ID must be a string')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),

  body('products.*.quantity')
    .exists({ checkFalsy: true }).withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  body('products.*.format')
    .exists({ checkFalsy: true }).withMessage('Format is required')
    .isIn(['ebook', 'physical','audiobook']).withMessage('Format must be either "physical" or "digital"'),

  body('products.*.price')
    .exists({ checkFalsy: true }).withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('status')
    .isBoolean().withMessage('Status must be a boolean'),

  body('paymentHandler')
    .exists({ checkFalsy: true }).withMessage('Payment handler is required')
    .isString().withMessage('Payment handler must be a string')
    .isIn(['paystack', 'stripe', 'paypal']).withMessage('Invalid payment handler'),

  body('ref')
    .exists({ checkFalsy: true }).withMessage('Reference is required')
    .isString().withMessage('Reference must be a string'),
];
export const orderidValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('Order ID is required')
]
export const orderidqueryValidation = [
  header('Authorization')
    .exists({ checkFalsy: true })
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s.+$/)
    .withMessage('Authorization header must be in the format: Bearer <token>'),
  query('id')
    .exists({ checkFalsy: true })
    .withMessage('Order ID is required')
]
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