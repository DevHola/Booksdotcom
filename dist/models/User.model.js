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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Userschema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        lowercase: true
    },
    isverified: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    provider_id: {
        type: String,
    },
    otp: {
        type: String,
        default: null
    },
    wishlist: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'products'
        }],
    preferences: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Categories'
        }],
    profile: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'profiles'
    },
    lastLogin: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });
Userschema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        try {
            user.password = await bcrypt_1.default.hash(user.password, 10);
            next();
        }
        catch (err) {
            if (err instanceof Error) {
                next(err);
            }
        }
    }
    else {
        next();
    }
});
const UserModel = (0, mongoose_1.model)('users', Userschema);
exports.default = UserModel;
