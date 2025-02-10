"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pay_controllers_1 = require("../controllers/pay.controllers");
const passport_1 = __importDefault(require("passport"));
const payRouter = express_1.default.Router();
payRouter.post('/', passport_1.default.authenticate('jwt', { session: false }), pay_controllers_1.payment);
payRouter.get('/', passport_1.default.authenticate('jwt', { session: false }), pay_controllers_1.verify);
exports.default = payRouter;
