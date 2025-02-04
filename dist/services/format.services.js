"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTypeExist = exports.updateFormatPrice = exports.updateStockInProduct = exports.removeFormatFromProduct = exports.addFormatToProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const addFormatToProduct = async (data, id) => {
    const product = await product_model_1.default.findById(id);
    if (!product) {
        throw new Error('product not found');
    }
    product.formats.push(data);
    return await product.save();
};
exports.addFormatToProduct = addFormatToProduct;
const removeFormatFromProduct = async (productid, formatid) => {
    const product = await product_model_1.default.findById(productid);
    if (!product) {
        throw new Error('product not found');
    }
    const format = await product_model_1.default.updateOne({ _id: productid, 'formats._id': formatid }, {
        $pull: {
            formats: { _id: formatid }
        }
    });
    if (!format) {
        throw new Error('Update failed');
    }
};
exports.removeFormatFromProduct = removeFormatFromProduct;
const updateStockInProduct = async (data, productid, formatid) => {
    const product = await product_model_1.default.findById(productid);
    if (!product) {
        throw new Error('product not found');
    }
    const format = await product_model_1.default.updateOne({ _id: product._id, 'formats._id': formatid, 'formats.type': 'physical' }, {
        $inc: {
            "formats.$.stock": data.stock
        }
    }, { upsert: true });
    if (!format) {
        throw new Error('Error updating price');
    }
};
exports.updateStockInProduct = updateStockInProduct;
const updateFormatPrice = async (data, productid, formatid) => {
    const product = await product_model_1.default.findById(productid);
    if (!product) {
        throw new Error('product not found');
    }
    const format = await product_model_1.default.updateOne({ _id: product._id, 'formats._id': formatid }, {
        $set: {
            "formats.$.price": data.price
        }
    }, { upsert: true });
    if (!format) {
        throw new Error('Error updating price');
    }
    return format;
};
exports.updateFormatPrice = updateFormatPrice;
const checkTypeExist = async (type, product) => {
    const productdata = await product_model_1.default.find({ _id: product, 'formats.$.type': type });
    if (productdata.length > 0) {
        return true;
    }
    else {
        return false;
    }
};
exports.checkTypeExist = checkTypeExist;
