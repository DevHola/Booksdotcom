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
categoryRouter.post('/', validation_1.categoryValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['admin'] }), category_controllers_1.createCategory);
categoryRouter.patch('/:id', validation_1.categoryValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['admin'] }), category_controllers_1.editACategory);
categoryRouter.get('/name', validation_1.categoryNameOrIdValidation, category_controllers_1.GetCategoryByName);
categoryRouter.get('/:id', validation_1.categoryNameOrIdValidation, category_controllers_1.GetCategoryById);
categoryRouter.get('/', category_controllers_1.GetCategories);
exports.default = categoryRouter;
