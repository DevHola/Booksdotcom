"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFormatData = exports.expiredCouponDeletion = exports.updateCouponUsage = exports.deleteCoupon = exports.aDCouponStatus = exports.validityCheck = exports.checkCoupon = exports.singleCoupon = exports.getAllCreatorCoupons = exports.structureSubOrder = exports.data = exports.couponCreation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
const couponrule_model_1 = __importDefault(require("../models/couponrule.model"));
const product_services_1 = require("./product.services");
const moment_1 = __importDefault(require("moment"));
const node_cron_1 = __importDefault(require("node-cron"));
const couponCreation = async (data) => {
    const session = await mongoose_1.default.startSession();
    return session.withTransaction(async () => {
        try {
            const coupon = await newCoupon(data, session);
            await (0, product_services_1.updateDiscountStatus)(data.product, true, session);
            if (data.ruleType !== 'none' && data.rules && coupon) {
                const refined = await (0, exports.structureSubOrder)(data.rules, data.ruleType, coupon._id);
                const rules = await newRules(refined, session);
                await addRulesToCoupon(rules._id, coupon._id, session);
            }
            return coupon;
        }
        catch (error) {
            throw new Error('Error creating coupon');
        }
    }).finally(() => session.endSession());
};
exports.couponCreation = couponCreation;
const newCoupon = async (data, session) => {
    const coupon = await coupon_model_1.default.create([data], { session });
    return coupon[0];
};
const newRules = async (data, session) => {
    const rules = await couponrule_model_1.default.create([data], { session });
    return rules[0];
};
const addRulesToCoupon = async (id, couponid, session) => {
    const coupon = await coupon_model_1.default.updateOne({ _id: couponid }, {
        $set: {
            rules: id
        }
    }).session(session);
};
exports.data = {
    limit: 2000,
    month: ['january', 'feburary'],
    day: [10, 20, 21],
    daysOfWeek: ['monday', 'friday'],
    startDate: '12-12-2025',
    endDate: '12-12-2026'
};
const structureSubOrder = async (data, ruleType, couponid) => {
    let query = { couponid };
    if (data.limit !== undefined)
        query.limit = data.limit;
    let matchStrategy = {};
    matchStrategy = {
        'month-specific': () => query.month = data.month,
        'day-specific-in-month': () => query.day = data.day,
        'day-specific-in-week': () => query.daysOfWeek = data.daysOfWeek,
        'month-and-day-specific': () => { query.month = data.month; query.day = data.day; },
        'month-and-days-of-week-specific': () => { query.month = data.month; query.daysOfWeek = data.daysOfWeek; },
        'day-range-specific': () => query.day = data.day,
        'time-period-specific': () => { query.startDate = data.startDate; query.endDate = data.endDate; }
    };
    if (matchStrategy[ruleType])
        matchStrategy[ruleType]();
    return query;
};
exports.structureSubOrder = structureSubOrder;
const getAllCreatorCoupons = async (vendorid, page, limit) => {
    const [coupons, totalResult] = await Promise.all([await coupon_model_1.default.find({ vendor: vendorid, isDeleted: false }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        await coupon_model_1.default.find({ vendor: vendorid, isDeleted: false }).countDocuments()
    ]);
    return { coupons, currentPage: page, totalPage: Math.ceil(totalResult / limit), totalResult };
};
exports.getAllCreatorCoupons = getAllCreatorCoupons;
const singleCoupon = async (couponCode) => {
    const coupon = await coupon_model_1.default.findOne({ code: couponCode, isDeleted: false }).populate('rules').exec();
    if (!coupon)
        throw new Error('coupon not found');
    return coupon;
};
exports.singleCoupon = singleCoupon;
const checkCoupon = async (couponCode, productid) => {
    const coupon = await coupon_model_1.default.findOne({ code: couponCode, isDeleted: false, product: { $in: productid } }).populate('rules').exec();
    if (!coupon)
        throw new Error('coupon not found');
    const date = (0, moment_1.default)();
    if (date.isAfter(coupon.expiresAt))
        throw new Error('coupon expired');
    if (coupon.isActive === false)
        throw new Error('coupon is currently inactive');
    const validity = await (0, exports.validityCheck)(coupon, date);
    if (!validity.isValid)
        throw new Error('coupon is not valid');
    if (coupon.ruleType === 'none' || (coupon.rules?.limit !== undefined && coupon.usageCount < coupon.rules.limit))
        return coupon;
    throw new Error('Coupon max usage reached');
};
exports.checkCoupon = checkCoupon;
const validityCheck = async (coupon, date) => {
    const rules = coupon.rules;
    switch (coupon.ruleType) {
        case 'none': return { isValid: true, message: "Coupon is valid" };
        case "month-specific":
            return rules?.month?.includes(date.format('MMMM')) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" };
        case "day-specific-in-month":
            return rules?.day?.includes(date.date()) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" };
        case "day-specific-in-week":
            return rules?.daysOfWeek?.includes(date.format('dddd')) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" };
        case "month-and-day-specific":
            return rules?.day?.includes(date.date()) && rules?.month?.includes(date.format('MMMM')) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" };
        case "month-and-days-of-week-specific":
            return rules?.month?.includes(date.format('MMMM')) && rules?.daysOfWeek?.includes(date.format('dddd')) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" };
        case "day-range-specific":
        case "time-period-specific":
            return rules?.startDate && rules.endDate && date.isBetween(rules.startDate, rules.endDate) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" };
        default: return { isValid: false, message: "Invalid rule type" };
    }
};
exports.validityCheck = validityCheck;
const aDCouponStatus = async (type, code) => {
    const coupon = await coupon_model_1.default.findOne({ code: code });
    if (coupon && coupon.isActive === type) {
        throw new Error('coupon status set already');
    }
    const session = await mongoose_1.default.startSession();
    return session.withTransaction(async () => {
        try {
            const update = await coupon_model_1.default.findOneAndUpdate({ code: code }, {
                $set: {
                    isActive: type
                }
            }, { new: true }).session(session);
            if (type === true) {
                await (0, product_services_1.updateDiscountStatus)(coupon?.product, true, session);
            }
            else {
                await (0, product_services_1.updateDiscountStatus)(coupon?.product, false, session);
            }
            return update;
        }
        catch (error) {
            throw new Error('error updating coupon status');
        }
    }).finally(() => session.endSession());
};
exports.aDCouponStatus = aDCouponStatus;
const deleteCoupon = async (couponCode) => {
    const session = await mongoose_1.default.startSession();
    return session.withTransaction(async () => {
        try {
            await coupon_model_1.default.updateOne({ code: couponCode }, {
                $set: {
                    isDeleted: true,
                    isActive: false
                }
            }).session(session);
            const coupondata = await coupon_model_1.default.findOne({ code: couponCode }).session(session);
            await (0, product_services_1.updateDiscountStatus)(coupondata.product, false, session);
        }
        catch (error) {
            throw new Error('error deleting coupon');
        }
    })
        .finally(() => session.endSession());
};
exports.deleteCoupon = deleteCoupon;
const updateCouponUsage = async (code, session) => {
    return await coupon_model_1.default.findOneAndUpdate({ code: code }, {
        $inc: {
            usageCount: 1
        }
    }, { new: true }).session(session);
};
exports.updateCouponUsage = updateCouponUsage;
const expiredCouponDeletion = async (data) => {
    const session = await mongoose_1.default.startSession();
    return session.withTransaction(async () => {
        try {
            const today = (0, moment_1.default)();
            const coupons = await coupon_model_1.default.find({ $expr: {
                    $or: [
                        { $lt: ["$expiresAt", today] },
                        { $eq: ["$usageCount", "$rules.limit"] }
                    ]
                }, isActive: true }).populate('rules').lean().session(session);
            const couponids = await formatCouponIds(coupons);
            const couponProducts = await formatCouponProducts(coupons);
            await Promise.all([await coupon_model_1.default.updateMany({ _id: { $in: couponids } }, {
                    $set: {
                        isActive: false
                    }
                }).session(session), await (0, product_services_1.updateDiscountStatus)(couponProducts, false, session)]);
        }
        catch (error) {
            console.log(error);
            throw new Error('error deleting expired coupons');
        }
    }).finally(() => session.endSession());
};
exports.expiredCouponDeletion = expiredCouponDeletion;
const formatCouponProducts = async (coupons) => {
    let ids = [];
    for (const coupon of coupons) {
        ids.concat(coupon.product);
    }
    return [...new Set(ids)];
};
const formatCouponIds = async (coupons) => {
    let ids = [];
    for (const coupon of coupons) {
        ids.push(coupon._id);
    }
    return [...new Set(ids)];
};
const couponCount = async () => {
    const count = await coupon_model_1.default.countDocuments();
    return count;
};
const processFormatData = async (productdata, coupon) => {
    let data = [];
    const formats = productdata.formats;
    for (const format of formats) {
        if (coupon.type === 'fixed') {
            let detail = {
                name: format.type,
                original_price: (format.price).toString(),
                discount: (coupon.discount).toString(),
                final_prize: (Number(format.price) - Number(coupon.discount)).toString()
            };
            data.push(detail);
        }
        else if (coupon.type === 'percentage') {
            const calculate = (Number(coupon.discount) / 100) * Number(format.price);
            const total = Number(format.price) - calculate;
            let detail = {
                name: format.type,
                original_price: format.price,
                discount: coupon.discount,
                final_prize: (total).toString()
            };
            data.push(detail);
        }
    }
    return data;
};
exports.processFormatData = processFormatData;
node_cron_1.default.schedule('0 0 * * *', async () => {
    const count = await couponCount();
    if (count > 0)
        await (0, exports.expiredCouponDeletion)(exports.data);
});
