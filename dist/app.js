"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../', '.env') });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importStar(require("./middlewares/passport"));
const connection_1 = __importDefault(require("./configs/connection"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const review_route_1 = __importDefault(require("./routes/review.route"));
const coupon_route_1 = __importDefault(require("./routes/coupon.route"));
const pay_route_1 = __importDefault(require("./routes/pay.route"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const docs_1 = require("./configs/docs");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.disable('x-powered-by');
app.use(passport_1.default.initialize());
passport_1.default.use(passport_2.default);
passport_1.default.use(passport_2.GGstrategy);
app.use((error, req, res, next) => {
    const isProduction = process.env.NODE_ENV === 'production';
    return res.status(500).json({
        message: isProduction ? 'An error occured' : error.stack,
        ...(isProduction ? null : { stack: error.stack })
    });
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../', 'uploads')));
// console.log(path.join(__dirname, '../', 'uploads'));
app.use('/api/v1/auth', auth_route_1.default);
app.use('/api/v1/category', category_route_1.default);
app.use('/api/v1/products', product_route_1.default);
app.use('/api/v1/review', review_route_1.default);
app.use('/api/v1/coupons', coupon_route_1.default);
app.use('/api/v1/pay', pay_route_1.default);
const specs = (0, swagger_jsdoc_1.default)(docs_1.options);
app.use("/api/v1/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
const startApp = async () => {
    try {
        const uri = process.env.MONGOURI ?? '';
        if (!uri) {
            console.error('MONGOURI is not defined.');
            return;
        }
        await (0, connection_1.default)(uri);
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
    }
    // await seedcategory()
    // await seedproducts()
    // await populateFormats()
    // await populateReviews()
};
startApp();
exports.default = app;
