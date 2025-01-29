"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }
}, { timestamps: true });
const CategoryModel = (0, mongoose_1.model)('Categories', CategorySchema);
exports.default = CategoryModel;
