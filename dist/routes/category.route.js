"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controllers_1 = require("../controllers/category.controllers");
const passport_1 = __importDefault(require("passport"));
const validation_1 = require("../middlewares/validation");
const passport_2 = require("../middlewares/passport");
const categoryRouter = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The category name
 *       example:
 *         name: Fiction
 */
/**
 * @swagger
 * /category/:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: category created successfully
 *       400:
 *         description: Bad request
 */
categoryRouter.post('/', validation_1.categoryValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['admin'] }), category_controllers_1.createCategory);
categoryRouter.patch('/:id', validation_1.categoryValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['admin'] }), category_controllers_1.editACategory);
categoryRouter.get('/name', validation_1.categoryNameOrIdValidation, category_controllers_1.GetCategoryByName);
categoryRouter.get('/:id', validation_1.categoryNameOrIdValidation, category_controllers_1.GetCategoryById);
/**
 * @swagger
 * /category/:
 *   get:
 *     summary: Get a list of categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           description: The number of categories to return per page
 *         example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           description: The page number to fetch
 *         example: 1
 *     responses:
 *       200:
 *         description: List of categories
 */
categoryRouter.get('/', category_controllers_1.GetCategories);
exports.default = categoryRouter;
