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
// incorporate formats into controlleers
const mongoose_1 = __importStar(require("mongoose"));
const format_model_1 = require("./format.model");
const ProductSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        lowercase: true
    },
    ISBN: {
        type: String,
        unique: true,
        index: true,
        required: true,
        lowercase: true
    },
    author: [{
            type: String,
            required: true,
            lowercase: true
        }],
    publisher: {
        type: String,
        index: true,
        required: true
    },
    published_Date: {
        type: Date,
        required: true
    },
    noOfPages: {
        type: Number,
        required: true
    },
    coverImage: [{
            type: String,
            required: true
        }],
    previewFileurl: {
        type: String
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    totalSold: {
        type: Number,
        default: 0
    },
    isDiscounted: {
        type: Boolean,
        required: true,
        default: false
    },
    language: {
        type: String,
        required: true
    },
    categoryid: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users'
    },
    formats: {
        type: [format_model_1.formatSchema]
    }
}, { timestamps: true });
const productModel = (0, mongoose_1.model)('products', ProductSchema);
exports.default = productModel;
