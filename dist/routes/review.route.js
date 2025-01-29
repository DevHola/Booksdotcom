"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const review_controllers_1 = require("../controllers/review.controllers");
const validation_1 = require("../middlewares/validation");
const passport_2 = require("../middlewares/passport");
const reviewRouter = express_1.default.Router();
reviewRouter.post('/', validation_1.reviewValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), review_controllers_1.addReview);
reviewRouter.get('/product/:id', validation_1.productReviewsValidation, review_controllers_1.getProductReviews);
reviewRouter.patch('/', validation_1.editReviewValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), review_controllers_1.editProductReview);
reviewRouter.get('/user/:id', validation_1.getUserReviewsValidation, review_controllers_1.getUserProductReviews);
reviewRouter.get('/:id', validation_1.getReviewValidation, review_controllers_1.getReview);
exports.default = reviewRouter;
