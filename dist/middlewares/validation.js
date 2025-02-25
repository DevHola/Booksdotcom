"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewValidation = exports.getUserReviewsValidation = exports.editReviewValidation = exports.productReviewsValidation = exports.reviewValidation = exports.orderidqueryValidation = exports.orderidValidation = exports.validateOrder = exports.validatePayment = exports.previewFileValidation = exports.updatePriceValidation = exports.StockValidation = exports.removeformatValidation = exports.formatValidation = exports.validateCouponDelete = exports.validateCouponChecker = exports.validateCoupon = exports.getProductbyTitleV = exports.editProductImgValidation = exports.editproductValidation = exports.createproductValidation = exports.categoryNameOrIdValidation = exports.categoryValidation = exports.removeAchievementValidation = exports.achievementValidation = exports.profileValidation = exports.preferenceValidation = exports.wishlistValidation = exports.authTokenValidation = exports.initVerifyValidation = exports.assignroleValidation = exports.otpValidation = exports.resetPasswordValidation = exports.verifyValidation = exports.forgetValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const auth_services_1 = require("../services/auth.services");
const category_services_1 = require("../services/category.services");
const mime_types_1 = __importDefault(require("mime-types"));
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
    (0, express_validator_1.body)('biography')
        .exists({ checkFalsy: true })
        .withMessage('biography is required')
        .isString()
        .withMessage('biography must be a string'),
    (0, express_validator_1.body)('img')
        .optional()
        .isArray({ max: 1 })
        .withMessage('img must be an array with a maximum of 1 image'),
    (0, express_validator_1.body)('img.*')
        .optional()
        .isString()
        .withMessage('Each image must be a string (e.g., URL or file path)')
        .custom(async (img) => {
        const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const mimeType = mime_types_1.default.lookup(img);
        if (mimeType && !allowedMimeTypes.includes(mimeType)) {
            throw new Error('invalid file type');
        }
        return true;
    })
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
exports.createproductValidation = [
    (0, express_validator_1.body)("title")
        .exists({ checkFalsy: true })
        .withMessage("title is required")
        .isString()
        .withMessage("title must be a string"),
    (0, express_validator_1.body)("description")
        .exists({ checkFalsy: true })
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string"),
    (0, express_validator_1.body)("isbn")
        .exists({ checkFalsy: true })
        .withMessage("ISBN is required")
        .isString()
        .withMessage("ISBN must be a string"),
    // .isISBN()
    // .withMessage("ISBN must be a valid ISBN"),
    (0, express_validator_1.body)("author")
        .exists({ checkFalsy: true })
        .withMessage("Author is required"),
    (0, express_validator_1.body)("publisher")
        .exists({ checkFalsy: true })
        .withMessage("Publisher is required")
        .isString()
        .withMessage("Publisher must be a string"),
    (0, express_validator_1.body)("published_Date")
        .exists({ checkFalsy: true })
        .withMessage("Published Date is required")
        .isISO8601()
        .withMessage("Published Date must be a valid date"),
    (0, express_validator_1.body)("noOfPages")
        .exists({ checkFalsy: true })
        .withMessage("Number of Pages is required")
        .isInt()
        .withMessage("Number of Pages must be an integer"),
    (0, express_validator_1.body)("img.*")
        .exists({ checkFalsy: true })
        .withMessage("Each image is required")
        .custom(async (img) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        const mimeType = mime_types_1.default.lookup(img);
        if (mimeType && !allowedMimeTypes.includes(mimeType)) {
            throw new Error('Invalid image type');
        }
        return true;
    }),
    (0, express_validator_1.body)("language")
        .exists({ checkFalsy: true })
        .withMessage("Language is required")
        .isString()
        .withMessage("Language must be a string"),
    (0, express_validator_1.body)("categoryid")
        .exists({ checkFalsy: true })
        .withMessage("Category ID is required")
        .isString()
        .withMessage("Category ID must be a string"),
];
exports.editproductValidation = [
    (0, express_validator_1.header)("Authorization")
        .exists({ checkFalsy: true })
        .withMessage("Authorization header is required")
        .isString()
        .withMessage("Authorization header must be a string")
        .matches(/^Bearer\s.+$/)
        .withMessage("Authorization header must be in the format: Bearer <token>"),
    (0, express_validator_1.body)("title")
        .exists({ checkFalsy: true })
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string"),
    (0, express_validator_1.body)("description")
        .exists({ checkFalsy: true })
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string"),
    (0, express_validator_1.body)("isbn")
        .exists({ checkFalsy: true })
        .withMessage("ISBN is required")
        .isString()
        .withMessage("ISBN must be a string"),
    // .isISBN()
    // .withMessage("ISBN must be a valid ISBN"),
    (0, express_validator_1.body)("author")
        .exists({ checkFalsy: true })
        .withMessage("Author is required")
        .isArray()
        .withMessage("Author must be an array of strings"),
    (0, express_validator_1.body)("publisher")
        .exists({ checkFalsy: true })
        .withMessage("Publisher is required")
        .isString()
        .withMessage("Publisher must be a string"),
    (0, express_validator_1.body)("published_Date")
        .exists({ checkFalsy: true })
        .withMessage("Published Date is required")
        .isISO8601()
        .withMessage("Published Date must be a valid date"),
    (0, express_validator_1.body)("noOfPages")
        .exists({ checkFalsy: true })
        .withMessage("Number of Pages is required")
        .isInt()
        .withMessage("Number of Pages must be an integer"),
    (0, express_validator_1.body)("language")
        .exists({ checkFalsy: true })
        .withMessage("Language is required")
        .isString()
        .withMessage("Language must be a string")
];
exports.editProductImgValidation = [
    (0, express_validator_1.body)("file")
        .isArray({ max: 4, min: 1 })
        .withMessage("file must be an array with a maximum of 4 images"),
    (0, express_validator_1.body)("file.*")
        .exists({ checkFalsy: true })
        .withMessage("Each image is required")
        .custom(async (img) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        const mimeType = mime_types_1.default.lookup(img);
        if (mimeType && !allowedMimeTypes.includes(mimeType)) {
            throw new Error('Invalid image type');
        }
    })
];
exports.getProductbyTitleV = [
    (0, express_validator_1.param)('title')
        .exists({ checkFalsy: true })
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string')
];
//Coupon
exports.validateCoupon = [
    (0, express_validator_1.body)("code")
        .exists({ checkFalsy: true })
        .withMessage("Coupon code is required")
        .isString()
        .withMessage("Coupon code must be string"),
    (0, express_validator_1.body)("type")
        .exists({ checkFalsy: true })
        .withMessage("Coupon discount type is required")
        .isIn(["fixed", "percentage"])
        .withMessage("Type must be either 'fixed' or 'percentage'"),
    (0, express_validator_1.body)("expiresAt")
        .exists({ checkFalsy: true })
        .withMessage("Coupon expiration date is required")
        .isISO8601()
        .toDate()
        .withMessage("Expiration date must be a valid date"),
    (0, express_validator_1.body)("discount")
        .exists({ checkFalsy: true })
        .withMessage("Coupon discount is required")
        .isFloat({ gt: 0 })
        .withMessage("Discount must be a positive number"),
    (0, express_validator_1.body)("ruleType")
        .exists({ checkFalsy: true })
        .withMessage("Coupon ruletype is required")
        .isIn([
        "none", "month-specific", "day-specific-in-month", "day-specific-in-week", "month-and-day-specific", "month-and-days-of-week-specific", "day-range-specific", "time-period-specific"
    ])
        .withMessage("Invalid ruleType value"),
    (0, express_validator_1.body)("product")
        .isArray()
        .withMessage("Product must be an array of product IDs"),
    (0, express_validator_1.body)("rules.limit")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("Limit must be a positive integer"),
    (0, express_validator_1.body)("rules.month")
        .optional()
        .isArray()
        .withMessage("Month must be an array"),
    (0, express_validator_1.body)("rules.day")
        .optional()
        .isArray()
        .withMessage("Day must be an array of numbers"),
    (0, express_validator_1.body)("rules.daysOfWeek")
        .optional()
        .isArray()
        .withMessage("Days of week must be an array of strings"),
    (0, express_validator_1.body)("rules.startDate")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("Start date must be a valid date"),
    (0, express_validator_1.body)("rules.endDate")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("End date must be a valid date"),
];
exports.validateCouponChecker = [
    (0, express_validator_1.query)('coupon')
        .exists({ checkFalsy: true })
        .withMessage('Coupon code is required')
        .isString()
        .withMessage('Coupon code must be a string'),
    (0, express_validator_1.query)('coupon')
        .exists({ checkFalsy: true })
        .withMessage('Coupon code is required')
        .isString()
        .withMessage('Coupon code must be a string')
];
exports.validateCouponDelete = [
    (0, express_validator_1.query)('coupon')
        .exists({ checkFalsy: true })
        .withMessage('Coupon code is required')
        .isString()
        .withMessage('Coupon code must be a string')
];
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
        .isInt()
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
        .exists({ checkFalsy: true })
        .withMessage('file is required')
        .isArray({ max: 1 })
        .withMessage('file must be an array with a maximum of 1 image'),
    (0, express_validator_1.body)('file.*')
        .exists({ checkFalsy: true })
        .withMessage('Each file is required')
        .custom(async (file) => {
        const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const mimeType = mime_types_1.default.lookup(file);
        if (mimeType && !allowedMimeTypes.includes(mimeType)) {
            throw new Error('invalid file type');
        }
        return true;
    })
];
exports.validatePayment = [
    (0, express_validator_1.body)("total")
        .isNumeric()
        .withMessage("Total must be a number")
        .isInt({ min: 100 })
        .withMessage("Total amount must be at least 100"),
    (0, express_validator_1.body)("products")
        .isArray({ min: 1 })
        .withMessage("Products must be an array with at least one item"),
    (0, express_validator_1.body)("products.*.product")
        .isString()
        .withMessage("Product ID must be a string"),
    (0, express_validator_1.body)("products.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
    (0, express_validator_1.body)("products.*.format")
        .isString()
        .isIn(["physical", "ebook", "audiobook"])
        .withMessage("Format must be either 'physical' or 'digital(ebook/audiobook)'"),
    (0, express_validator_1.body)("products.*.price")
        .isNumeric()
        .withMessage("Price must be a number")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Invalid email address"),
    (0, express_validator_1.body)("trackingCode")
        .isString()
        .notEmpty()
        .withMessage("Tracking code is required"),
];
exports.validateOrder = [
    (0, express_validator_1.body)('total')
        .exists({ checkFalsy: true }).withMessage('Total is required')
        .isInt({ min: 1 }).withMessage('Total must be a positive integer'),
    (0, express_validator_1.body)('products')
        .isArray({ min: 1 }).withMessage('Products must be an array with at least one item'),
    (0, express_validator_1.body)('products.*.product')
        .exists({ checkFalsy: true }).withMessage('Product ID is required')
        .isString().withMessage('Product ID must be a string')
        .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId'),
    (0, express_validator_1.body)('products.*.quantity')
        .exists({ checkFalsy: true }).withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    (0, express_validator_1.body)('products.*.format')
        .exists({ checkFalsy: true }).withMessage('Format is required')
        .isIn(['ebook', 'physical', 'audiobook']).withMessage('Format must be either "physical" or "digital"'),
    (0, express_validator_1.body)('products.*.price')
        .exists({ checkFalsy: true }).withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('status')
        .isBoolean().withMessage('Status must be a boolean'),
    (0, express_validator_1.body)('paymentHandler')
        .exists({ checkFalsy: true }).withMessage('Payment handler is required')
        .isString().withMessage('Payment handler must be a string')
        .isIn(['paystack', 'stripe', 'paypal']).withMessage('Invalid payment handler'),
    (0, express_validator_1.body)('ref')
        .exists({ checkFalsy: true }).withMessage('Reference is required')
        .isString().withMessage('Reference must be a string'),
];
exports.orderidValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.param)('id')
        .exists({ checkFalsy: true })
        .withMessage('Order ID is required')
];
exports.orderidqueryValidation = [
    (0, express_validator_1.header)('Authorization')
        .exists({ checkFalsy: true })
        .withMessage('Authorization header is required')
        .isString()
        .withMessage('Authorization header must be a string')
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header must be in the format: Bearer <token>'),
    (0, express_validator_1.query)('id')
        .exists({ checkFalsy: true })
        .withMessage('Order ID is required')
];
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
