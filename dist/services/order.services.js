"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vBS = exports.addOrderCreators = exports.genTrackingCode = exports.webHook = exports.getCreatorSingleOrder = exports.getCreatorOrders = exports.getSingleOrderData = exports.getAuthUserOrder = exports.newSubOrder = exports.createOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = __importDefault(require("../models/order.model"));
const suborder_model_1 = __importDefault(require("../models/suborder.model"));
const auth_services_1 = require("./auth.services");
const product_services_1 = require("./product.services");
const createOrder = async (data, session) => {
    const order = await order_model_1.default.create([data], { session });
    return order[0];
};
exports.createOrder = createOrder;
const newSubOrder = async (data, session) => {
    console.log(data);
    const subOrder = await suborder_model_1.default.create([data], { session });
    if (!subOrder) {
        throw new Error('Error creating suborder');
    }
    console.log(subOrder);
    return subOrder[0];
};
exports.newSubOrder = newSubOrder;
const getAuthUserOrder = async (userid, page, limit) => {
    const [orders, ordercount] = await Promise.all([await order_model_1.default.find({ user: userid }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        await order_model_1.default.find({ user: userid }).countDocuments()
    ]);
    return { orders, currentPage: page, totalPage: Math.ceil(ordercount / limit), totalOrders: ordercount };
};
exports.getAuthUserOrder = getAuthUserOrder;
const getSingleOrderData = async (id) => {
    return await suborder_model_1.default.find({ orderid: id }, { products: 1 }).populate({
        path: 'products.product',
        select: 'title coverImage'
    }).exec();
};
exports.getSingleOrderData = getSingleOrderData;
const getCreatorOrders = async (userid, page, limit) => {
    const [orders, ordersCount] = await Promise.all([await order_model_1.default.find({ creators: {
                $in: userid
            } }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).exec(), await order_model_1.default.find({ creators: {
                $in: userid
            } }).countDocuments()]);
    return { orders: orders, currentPage: page, totalPage: Math.ceil(ordersCount / limit), totalOrders: ordersCount };
};
exports.getCreatorOrders = getCreatorOrders;
const getCreatorSingleOrder = async (userid, orderid) => {
    return await suborder_model_1.default.find({ orderid: orderid, author: userid }).populate({
        path: 'products.product',
        select: 'title coverImage'
    });
};
exports.getCreatorSingleOrder = getCreatorSingleOrder;
const webHook = async (data) => {
    const orderinformation = data.metadata;
    const newOrder = JSON.parse(orderinformation);
    const orderExist = await order_model_1.default.findOne({ trackingCode: newOrder.trackingCode });
    if (orderExist) {
        throw new Error('tracking code exist');
    }
    // need to review this
    //const order = await createOrder(data)
    // if(!order){
    //     throw new Error('Error creating order')
    // }
    // return order
};
exports.webHook = webHook;
const genTrackingCode = async (name) => {
    const date = Date.now();
    return date + '-' + name;
};
exports.genTrackingCode = genTrackingCode;
const addOrderCreators = async (orderid, creatorid, session) => {
    const order = await order_model_1.default.updateOne({ _id: orderid }, {
        $push: {
            creators: creatorid
        }
    }).session(session);
    if (!order) {
        throw new Error('Error adding creators');
    }
};
exports.addOrderCreators = addOrderCreators;
const vBS = async (groupProductslist, data) => {
    const session = await mongoose_1.default.startSession();
    return session.withTransaction(async () => {
        try {
            const order = await (0, exports.createOrder)(data, session);
            const orderid = order._id;
            for (const [author, products] of Object.entries(groupProductslist)) {
                const total = products.reduce((sum, product) => sum + product.price, 0);
                const subdata = {
                    orderid: orderid.toString(),
                    author: author,
                    products: products,
                    total: total,
                    status: 'pending',
                };
                await (0, exports.newSubOrder)(subdata, session);
                await (0, exports.addOrderCreators)(subdata.orderid, subdata.author, session);
                await (0, auth_services_1.creditAuthorAccount)(author, total, session);
                const product = products.filter((product) => product.format === 'physical');
                for (const item of product) {
                    await (0, product_services_1.updateStockOrderInitiation)(item.product, item.quantity, session);
                }
            }
            return order;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error in creating order');
        }
    }).finally(() => {
        session.endSession();
    });
};
exports.vBS = vBS;
