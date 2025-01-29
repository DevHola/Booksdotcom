"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uri = process.env.MONGOURI;
const connection = async (uri) => {
    await mongoose_1.default.connect(uri, {}).then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('Connection to MongoDB failed', err);
    });
};
exports.default = connection;
