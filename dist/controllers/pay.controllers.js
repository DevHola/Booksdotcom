"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.payment = void 0;
const paystack_sdk_1 = require("paystack-sdk");
const paystack = new paystack_sdk_1.Paystack(process.env.PAYSTACKSECRET);
const auth_services_1 = require("../services/auth.services");
const payment = async (req, res, next) => {
    try {
        const { email, total, trackingCode } = req.body;
        const product = req.body.products;
        const user = await (0, auth_services_1.UserByEmail)(email);
        const orderdata = {
            user: user._id,
            total: (total * 100).toString(),
            trackingCode,
            products: product
        };
        const stringify = JSON.stringify(orderdata);
        const payment = await paystack.transaction.initialize({
            email,
            amount: (total * 100).toString(),
            metadata: {
                custom_fields: [
                    {
                        display_name: "Order Details",
                        variable_name: "order_details",
                        value: stringify
                    }
                ]
            }
        });
        return res.status(200).json({
            payment
        });
    }
    catch (error) {
        next(error);
    }
};
exports.payment = payment;
const verify = async (req, res, next) => {
    try {
        const ref = req.query.ref;
        const paymentdata = await paystack.transaction.verify(ref);
        if (paymentdata) {
            const string = paymentdata.data;
            const meta = JSON.parse(string.metadata.custom_fields[0].value);
            console.log(meta);
            return res.status(200).json({
                paymentdata
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.verify = verify;
