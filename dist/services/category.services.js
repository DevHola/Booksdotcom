"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = exports.getCategoryByID = exports.getCategoryByName = exports.editCategory = exports.NewCategory = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const NewCategory = async (data) => {
    const category = await category_model_1.default.create({ name: data });
    await category.save();
};
exports.NewCategory = NewCategory;
const editCategory = async (id, name) => {
    await category_model_1.default.findOneAndUpdate({ _id: id }, { $set: { name: name } }, { upsert: true });
};
exports.editCategory = editCategory;
const getCategoryByName = async (data) => {
    const category = await category_model_1.default.findOne({ name: data });
    return category;
};
exports.getCategoryByName = getCategoryByName;
const getCategoryByID = async (id) => {
    const category = await category_model_1.default.findById(id);
    return category;
};
exports.getCategoryByID = getCategoryByID;
const Categories = async () => {
    const category = await category_model_1.default.find();
    return category;
};
exports.Categories = Categories;
