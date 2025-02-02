"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategories = exports.GetCategoryById = exports.GetCategoryByName = exports.editACategory = exports.createCategory = void 0;
const category_services_1 = require("../services/category.services");
const express_validator_1 = require("express-validator");
const createCategory = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { name } = req.body;
        const category = await (0, category_services_1.NewCategory)(name);
        return res.status(200).json({
            status: true,
            category,
            message: 'category created'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCategory = createCategory;
const editACategory = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { name } = req.body;
        const id = req.params.id;
        await (0, category_services_1.editCategory)(id, name);
        return res.status(200).json({
            status: true,
            message: 'category edited'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.editACategory = editACategory;
const GetCategoryByName = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { name } = req.body;
        const category = await (0, category_services_1.getCategoryByName)(name);
        return res.status(200).json({
            status: true,
            category
        });
    }
    catch (error) {
        next(error);
    }
};
exports.GetCategoryByName = GetCategoryByName;
const GetCategoryById = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const id = req.params.id;
        const category = await (0, category_services_1.getCategoryByID)(id);
        return res.status(200).json({
            status: true,
            category
        });
    }
    catch (error) {
        next(error);
    }
};
exports.GetCategoryById = GetCategoryById;
const GetCategories = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const categories = await (0, category_services_1.Categories)(page, limit);
        return res.status(200).json({
            status: true,
            categories
        });
    }
    catch (error) {
        next(error);
    }
};
exports.GetCategories = GetCategories;
