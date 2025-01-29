"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const RatingSchema = new mongoose_1.Schema({
    rateNumber: {
        type: Number,
        required: true,
        default: 0,
        index: true
    },
    review: {
        type: String
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'products',
        index: true
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users',
        index: true
    }
}, { timestamps: true });
// act on model directly
RatingSchema.statics.addAndUpdateReview = async function (rateNumber, review, product, user) {
    const rating = await this.create({
        rateNumber: rateNumber,
        review: review,
        product: product,
        user: user
    });
    await rating.save();
    const ratings = await this.find({ product: product });
    // const totalreview = ratings.length + 1
    const averageRatingtotal = ratings.reduce((sum, rating) => sum + rating.rateNumber, 0) / ratings.length;
    await mongoose_1.default.model('products').findByIdAndUpdate(product, {
        $set: {
            averageRating: averageRatingtotal
        },
        $inc: {
            numberOfReviews: 1
        }
    });
    return rating;
};
RatingSchema.statics.editAndUpdateReview = async function (reviewid, rateNumber, text) {
    const rating = await this.findByIdAndUpdate(reviewid, {
        $set: {
            rateNumber: rateNumber,
            review: text
        }
    });
    const ratings = await this.find({ product: rating.product });
    const averageRatingtotal = ratings.reduce((sum, rating) => sum + rating.rateNumber, 0) / ratings.length;
    await mongoose_1.default.model('products').findByIdAndUpdate(rating.product, {
        $set: {
            averageRating: averageRatingtotal
        }
    });
    return rating;
};
const RateModel = (0, mongoose_1.model)('ratings', RatingSchema);
exports.default = RateModel;
