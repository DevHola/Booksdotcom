"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewValidation = exports.getUserReviewsValidation = exports.editReviewValidation = exports.productReviewsValidation = exports.reviewValidation = exports.previewFileValidation = exports.updatePriceValidation = exports.StockValidation = exports.removeformatValidation = exports.formatValidation = exports.categoryNameOrIdValidation = exports.categoryValidation = exports.removeAchievementValidation = exports.achievementValidation = exports.profileValidation = exports.preferenceValidation = exports.wishlistValidation = exports.authTokenValidation = exports.initVerifyValidation = exports.assignroleValidation = exports.otpValidation = exports.resetPasswordValidation = exports.verifyValidation = exports.forgetValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const auth_services_1 = require("../services/auth.services");
const category_services_1 = require("../services/category.services");
exports.registerValidation = [
    (0, express_validator_1.body)('name')
        .exists({ checkFalsy: true })
        .withMessage('name is required')
        .isString()
        .withMessage('name should be a string')
        .isLength({ min: 3 })
        .withMessage('name must be at least 3 characters long'),
    (0, express_validator_1.body)('email')
        .exists({ checkFalsy: true })
        .withMessage('email is required')
        .isEmail()
        .withMessage('Provide a valid email')
        .normalizeEmail()
        .custom(async (email) => {
        const user = await (0, auth_services_1.UserExist)(email);
        if (user) {
            throw new Error('Account already exists');
        }
    }),
    (0, express_validator_1.body)('password')
        .exists({ checkFalsy: true })
        .withMessage('password is required')
        .isString()
        .withMessage('password should be a string')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters long')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .exists({ checkFalsy: true })
        .withMessage('email is required')
        .isEmail()
        .withMessage('Provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .exists({ checkFalsy: true })
        .withMessage('password is required')
        .isString()
        .withMessage('password should be a string')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters long')
];
exports.forgetValidation = [
    (0, express_validator_1.body)('email')
        .exists({ checkFalsy: true })
        .withMessage('email is required')
        .isEmail()
        .withMessage('Provide a valid email')
        .normalizeEmail()
        .custom(async (email) => {
        const user = await (0, auth_services_1.UserByEmail)(email);
        if (user.provider !== 'local')
            throw new Error('Proceed to login via socials login');
    })
];
exports.verifyValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>')
];
exports.resetPasswordValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('password')
        .exists({ checkFalsy: true })
        .withMessage('password is required')
        .isString()
        .withMessage('password should be a string')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters long')
];
exports.otpValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('otp')
        .exists({ checkFalsy: true })
        .withMessage('otp is required')
        .isString()
        .withMessage('otp should be a string')
        .isLength({ max: 6, min: 6 })
        .withMessage('otp must be at least 6 characters long')
];
exports.assignroleValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('role')
        .exists({ checkFalsy: true })
        .withMessage('role is required')
        .isString()
        .withMessage('Provide a valid email')
];
exports.initVerifyValidation = [
    (0, express_validator_1.body)('email')
        .exists({ checkFalsy: true })
        .withMessage('email is required')
        .isEmail()
        .withMessage('Provide a valid email')
        .normalizeEmail()
        .custom(async (email) => {
        const user = await (0, auth_services_1.UserExist)(email);
        if (!user)
            throw new Error('User does not exist');
        if (user.isverified !== false)
            throw new Error('Account already Active');
        if (user.provider !== 'local')
            throw new Error('Proceed to login via socials login');
    })
];
exports.authTokenValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
];
// wishlist
exports.wishlistValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.query)('product')
        .exists({ checkFalsy: true })
        .withMessage('Product ID is required')
        .isString()
        .withMessage('Product ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Product ID cannot be empty'),
];
// preferences
exports.preferenceValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('preferences')
        .exists({ checkFalsy: true })
        .withMessage('preferences array is required')
        .isArray()
        .withMessage('preferences must be an array'),
    (0, express_validator_1.body)('preferences.*')
        .isString()
        .withMessage('Each category ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Category ID cannot be empty')
];
// profile
exports.profileValidation = [
    (0, express_validator_1.header)('Authorization')
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
    (0, express_validator_1.body)('img')
        .optional()
        .isArray({ max: 1 })
        .withMessage('img must be an array with a maximum of 1 image'),
    (0, express_validator_1.body)('img.*')
        .optional()
        .isString()
        .withMessage('Each image must be a string (e.g., URL or file path)')
];
// achievements
exports.achievementValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('title')
        .exists({ checkFalsy: true })
        .withMessage('title is required')
        .isString()
        .withMessage('Provide a valid title'),
    (0, express_validator_1.body)('description')
        .exists({ checkFalsy: true })
        .withMessage('description is required')
        .isString()
        .withMessage('Provide a valid description')
];
exports.removeAchievementValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.query)('achievement')
        .exists({ checkFalsy: true })
        .withMessage('achievement ID is required')
        .isString()
        .withMessage('Provide a valid achievement')
];
// category validation
exports.categoryValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('name')
        .exists({ checkFalsy: true })
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Category name cannot be empty')
        .custom(async (name) => {
        const category = await (0, category_services_1.getCategoryByName)(name);
        if (category)
            throw new Error('Category already exists');
    }),
    (0, express_validator_1.param)('id')
        .optional()
        .isString()
        .withMessage('Category ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Category ID cannot be empty'),
];
exports.categoryNameOrIdValidation = [
    (0, express_validator_1.body)('name')
        .optional()
        .isString()
        .withMessage('Category name must be a string')
        .isLength({ min: 1 })
        .withMessage('Category name cannot be empty'),
    (0, express_validator_1.param)('id')
        .optional()
        .isString()
        .withMessage('Category ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Category ID cannot be empty'),
];
//Products
//Format
exports.formatValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('type')
        .exists({ checkFalsy: true })
        .withMessage('Format type is required')
        .isString()
        .withMessage('Format type must be string')
        .trim(),
    (0, express_validator_1.body)('price')
        .exists({ checkFalsy: true })
        .withMessage('price is required')
        .isString()
        .withMessage('price must be string')
        .trim(),
    (0, express_validator_1.body)('stock')
        .optional()
        .isString()
        .withMessage('stock must be a string')
        .trim(),
    (0, express_validator_1.body)('product')
        .exists({ checkFalsy: true })
        .withMessage('Product ID is required')
        .isString()
        .withMessage('Product ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Product ID cannot be empty'),
    (0, express_validator_1.body)('file')
        .optional()
        .isArray({ max: 1 })
        .withMessage('file must be an array with a maximum of 1 image'),
    (0, express_validator_1.body)('file.*')
        .optional()
        .isString()
        .withMessage('Each file must be a string (e.g., URL or file path)')
];
exports.removeformatValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('productid')
        .exists({ checkFalsy: true })
        .withMessage('Product ID is required')
        .isString()
        .withMessage('Product ID must be string')
        .trim(),
    (0, express_validator_1.body)('formatid')
        .exists({ checkFalsy: true })
        .withMessage('Format ID required')
        .isString()
        .withMessage('Format ID must be string')
        .trim()
];
exports.StockValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('productid')
        .exists({ checkFalsy: true })
        .withMessage('Product ID is required')
        .isString()
        .withMessage('Product ID must be string')
        .trim(),
    (0, express_validator_1.body)('formatid')
        .exists({ checkFalsy: true })
        .withMessage('Format ID required')
        .isString()
        .withMessage('Format ID must be string')
        .trim(),
    (0, express_validator_1.body)('stock')
        .exists({ checkFalsy: true })
        .withMessage('stock is required')
        .isString()
        .withMessage('stock must be a string')
        .trim(),
];
exports.updatePriceValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('productid')
        .exists({ checkFalsy: true })
        .withMessage('Product ID is required')
        .isString()
        .withMessage('Product ID must be string')
        .trim(),
    (0, express_validator_1.body)('formatid')
        .exists({ checkFalsy: true })
        .withMessage('Format ID required')
        .isString()
        .withMessage('Format ID must be string')
        .trim(),
    (0, express_validator_1.body)('price')
        .exists({ checkFalsy: true })
        .withMessage('Price is required')
        .isString()
        .withMessage('stock must be a string')
        .trim()
];
exports.previewFileValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.query)('productid')
        .exists({ checkFalsy: true })
        .withMessage('Product ID is required')
        .isString()
        .withMessage('Product ID must be string')
        .trim(),
    (0, express_validator_1.body)('file')
        .optional()
        .isArray({ max: 1 })
        .withMessage('file must be an array with a maximum of 1 image'),
    (0, express_validator_1.body)('file.*')
        .optional()
        .isString()
        .withMessage('Each file must be a string (e.g., URL or file path)')
];
//Order
//Review
exports.reviewValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('rateNumber')
        .exists({ checkFalsy: true })
        .withMessage('Rating Number is required')
        .isNumeric()
        .withMessage('Rating Number must be numeric')
        .trim(),
    (0, express_validator_1.body)('review')
        .optional()
        .isString()
        .withMessage('Review text must be string')
        .isLength({ min: 4 })
        .withMessage('Review text must be a minumum of 4 letters.'),
    (0, express_validator_1.body)('product')
        .exists({ checkFalsy: true })
        .withMessage('Product ID is required')
        .isString()
        .withMessage('Product ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Product ID cannot be empty')
];
exports.productReviewsValidation = [
    (0, express_validator_1.param)('id')
        .exists({ checkFalsy: true })
        .withMessage('Product ID is required')
        .isString()
        .withMessage('Product ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Product ID cannot be empty')
];
exports.editReviewValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.body)('rateNumber')
        .exists({ checkFalsy: true })
        .withMessage('Rating Number is required')
        .isNumeric()
        .withMessage('Rating Number must be numeric')
        .trim(),
    (0, express_validator_1.body)('review')
        .optional()
        .isString()
        .withMessage('Review text must be string')
        .isLength({ min: 4 })
        .withMessage('Review text must be a minumum of 4 letters.'),
    (0, express_validator_1.body)('reviewid')
        .exists({ checkFalsy: true })
        .withMessage('Review ID is required')
        .isString()
        .withMessage('Review ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Review ID cannot be empty')
];
exports.getUserReviewsValidation = [
    (0, express_validator_1.param)('id')
        .exists({ checkFalsy: true })
        .withMessage('User ID is required')
        .isString()
        .withMessage('User ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('User ID cannot be empty')
];
exports.getReviewValidation = [
    (0, express_validator_1.param)('id')
        .exists({ checkFalsy: true })
        .withMessage('Review ID is required')
        .isString()
        .withMessage('Review ID must be a string')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Review ID cannot be empty')
];
