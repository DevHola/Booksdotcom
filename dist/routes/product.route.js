"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controllers_1 = require("../controllers/product.controllers");
const passport_1 = __importDefault(require("passport"));
const cloudinary_1 = require("../middlewares/cloudinary");
const order_controllers_1 = require("../controllers/order.controllers");
const validation_1 = require("../middlewares/validation");
const passport_2 = require("../middlewares/passport");
const coupon_controllers_1 = require("../controllers/coupon.controllers");
const productRouter = express_1.default.Router();
productRouter.post('/', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), cloudinary_1.upload.array('img', 4), product_controllers_1.createProduct);
productRouter.get('/', product_controllers_1.getproductAll);
productRouter.patch('/:id', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.productEdit);
productRouter.get('/search', product_controllers_1.search);
productRouter.get('/:id', product_controllers_1.productById);
productRouter.get('/title/:title', product_controllers_1.productByTitle);
productRouter.get('/isbn/:Isbn', product_controllers_1.productByIsbn);
productRouter.get('/category/:category', product_controllers_1.ProductByCategory);
productRouter.get('/author/:author', product_controllers_1.productByAuthor);
productRouter.get('/publisher/:publisher', product_controllers_1.productByPublisher);
// format
productRouter.post('/format', validation_1.formatValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), cloudinary_1.upload.array('file', 1), product_controllers_1.addFormat);
productRouter.delete('/format/delete', validation_1.removeformatValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.removeFormat);
productRouter.patch('/format/stock', validation_1.StockValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.IncreaseStockForPhysicalFormat);
productRouter.patch('/format/price', validation_1.updatePriceValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.updatePriceFormat);
productRouter.patch('/book/preview', validation_1.previewFileValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), cloudinary_1.upload.array('file', 1), product_controllers_1.addProductPreviewFile);
// homepage
productRouter.get('/new/arrival', product_controllers_1.newArrivalsProduct);
productRouter.get('/best/category', product_controllers_1.bestBooksByGenre);
productRouter.get('/best/sellers', product_controllers_1.bestSellersProducts);
productRouter.get('/recently/sold', product_controllers_1.recentlySoldBooks);
// order
productRouter.post('/order', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), order_controllers_1.createUserOrder);
productRouter.get('/user/order', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), order_controllers_1.getUserOrder);
productRouter.get('/order/:id', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), order_controllers_1.orderSingleData);
productRouter.get('/creator/orders', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), order_controllers_1.allCreatorOrder);
productRouter.get('/creator/single/order', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), order_controllers_1.allCreatorOrderSuborder);
// coupon
productRouter.post('/coupon', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.createCoupon);
productRouter.get('/coupons', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.getAllCoupons);
productRouter.get('/coupon/single', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.getSingleCoupon);
productRouter.get('/coupon/check', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), coupon_controllers_1.checkACoupon);
productRouter.delete('/coupon', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), coupon_controllers_1.couponDelete);
// paystack webhook
productRouter.post('/webhook/order', order_controllers_1.handlerWebhook);
exports.default = productRouter;
