"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerWebhook = exports.creatorUpdateSuborder = exports.allCreatorOrderSuborder = exports.allCreatorOrder = exports.orderSingleData = exports.getUserOrder = exports.createUserOrder = void 0;
const order_services_1 = require("../services/order.services");
const crypto_1 = __importDefault(require("crypto"));
const product_services_1 = require("../services/product.services");
const paystack_sdk_1 = require("paystack-sdk");
const paystack = new paystack_sdk_1.Paystack(process.env.PAYSTACKSECRET);
// // Online Javascript Editor for free
// // Write, Edit and Run your Javascript code using JS Online Compiler
// const order = {
//     "total": 10000,
//     "products":[{"product":"67927df747908ab4f63f4f66","quantity":1,"format":"physical","price":100},{"product":"67927df747908ab4f63f4f68","quantity":1,"format":"physical","price":100}],
//     "status":true,
//     "paymentHandler":"paystack",
//     "ref":"854hjdjfd"
// }
// const str = JSON.stringify(order, null, 2)
// console.log(str)
// const parse = JSON.parse(str)
// console.log(parse)
const createUserOrder = async (req, res, next) => {
    try {
        const user = req.user;
        const id = user.id;
        const trackingCode = await (0, order_services_1.genTrackingCode)(user.name);
        const products = req.body.products;
        const status = req.body.status;
        const paymentHandler = req.body.paymentHandler;
        const ref = req.body.ref;
        const total = req.body.total;
        const data = {
            trackingCode: trackingCode,
            user: id,
            total: total,
            status: status,
            paymentHandler: paymentHandler,
            ref: ref
        };
        // CREATE ORDER
        // GROUP PRODUCTS BY USER - returns an object with key as user id and value as array of products  
        const [groupProductslist, verify] = await Promise.all([await (0, product_services_1.groupProducts)(products), await paystack.transaction.verify(ref)]);
        if (verify && verify.data?.status !== 'success') {
            throw new Error('Payment not successful');
        }
        const distribute = await (0, order_services_1.vBS)(groupProductslist, data);
        return res.status(200).json({
            status: true,
            distribute
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Error in creating order') {
                return res.status(400).json({
                    message: 'Error in creating order'
                });
            }
            else if (error.message === 'Payment not successful') {
                return res.status(401).json({
                    message: 'Payment not successful'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.createUserOrder = createUserOrder;
const getUserOrder = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.page) || 10;
        const user = req.user;
        const id = user.id;
        const orders = await (0, order_services_1.getAuthUserOrder)(id, page, limit);
        return res.status(200).json({
            status: true,
            orders
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserOrder = getUserOrder;
const orderSingleData = async (req, res, next) => {
    try {
        const orderid = req.params.id;
        const productarray = [];
        const order = await (0, order_services_1.getSingleOrderData)(orderid);
        if (!order) {
            throw new Error('order does not exist');
        }
        order.map((items) => {
            items.products.map((item) => {
                productarray.push(item);
            });
        });
        return res.status(200).json({
            status: true,
            order: productarray
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'order does not exist') {
                return res.status(404).json({
                    message: 'order not found'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.orderSingleData = orderSingleData;
const allCreatorOrder = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const user = req.user;
        const id = user.id;
        const orders = await (0, order_services_1.getCreatorOrders)(id, page, limit);
        return res.status(200).json({
            status: true,
            orders
        });
    }
    catch (error) {
        next(error);
    }
};
exports.allCreatorOrder = allCreatorOrder;
const allCreatorOrderSuborder = async (req, res, next) => {
    try {
        const orderid = req.query.orderid;
        const user = req.user;
        const id = user.id;
        console.log(user);
        const suborders = await (0, order_services_1.getCreatorSingleOrder)(id, orderid);
        return res.status(200).json({
            status: true,
            suborders
        });
    }
    catch (error) {
        next(error);
    }
};
exports.allCreatorOrderSuborder = allCreatorOrderSuborder;
const creatorUpdateSuborder = async (req, res, next) => {
    try {
        const orderid = req.query.orderid;
        const suborderid = req.query.suborderid;
        const status = req.body.status;
        const suborder = await (0, order_services_1.updateSubOrderStatus)(orderid, suborderid, status);
        return res.status(200).json({
            status: true,
            suborder
        });
    }
    catch (error) {
        next(error);
    }
};
exports.creatorUpdateSuborder = creatorUpdateSuborder;
const handlerWebhook = async (req, res, next) => {
    try {
        const hash = crypto_1.default.createHmac('sha512', process.env.PAYSTACKSECRET).update(JSON.stringify(req.body)).digest('hex');
        if (hash === req.headers['x-paystack-signature']) {
            const data = req.body;
            console.log(data);
            if (data.event === 'charge.success') {
                await (0, order_services_1.webHook)(data);
            }
            return res.sendStatus(200);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.handlerWebhook = handlerWebhook;
