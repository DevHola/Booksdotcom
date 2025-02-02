"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCoverImages = exports.addProductPreviewFile = exports.recentlySoldBooks = exports.bestSellersProducts = exports.bestBooksByGenre = exports.newArrivalsProduct = exports.updatePriceFormat = exports.IncreaseStockForPhysicalFormat = exports.removeFormat = exports.addFormat = exports.search = exports.productEdit = exports.productByPublisher = exports.productByAuthor = exports.ProductByCategory = exports.productByIsbn = exports.getproductAll = exports.productByTitle = exports.productById = exports.createProduct = void 0;
const express_validator_1 = require("express-validator");
const product_services_1 = require("../services/product.services");
const format_services_1 = require("../services/format.services");
const cloudinary_1 = require("../middlewares/cloudinary");
const createProduct = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const urls = await (0, cloudinary_1.cloudinaryImageUploadMethod)(req.files, process.env.PRODUCTIMGFOLDER);
        const { title, description, isbn, language, author, publisher, published_Date, noOfPages, categoryid } = req.body;
        const user = req.user;
        const id = user.id;
        if (!req.files) {
            return res.status(400).json({
                message: 'No files uploaded!',
            });
        }
        const data = {
            title: title,
            description: description,
            ISBN: isbn,
            author: author,
            publisher: publisher,
            published_Date: new Date(published_Date),
            noOfPages: noOfPages,
            coverImage: urls,
            language: language,
            categoryid: categoryid,
            user: id
        };
        const product = await (0, product_services_1.newProduct)(data);
        if (product) {
            return res.status(201).json({
                status: true,
                product
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            next(error);
        }
    }
};
exports.createProduct = createProduct;
const productById = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { id } = req.params;
        const product = await (0, product_services_1.getProductById)(id);
        return res.status(200).json({
            status: true,
            product
        });
    }
    catch (error) {
        next(error);
    }
};
exports.productById = productById;
const productByTitle = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const title = req.params.title || String;
        const product = await (0, product_services_1.getProductByTitle)(title);
        return res.status(200).json({
            status: true,
            product
        });
    }
    catch (error) {
        next(error);
    }
};
exports.productByTitle = productByTitle;
const getproductAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const products = await (0, product_services_1.getAllProduct)(page, limit);
        return res.status(200).json({
            status: true,
            products
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getproductAll = getproductAll;
const productByIsbn = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { Isbn } = req.params;
        const product = await (0, product_services_1.getProductByIsbn)(Isbn);
        return res.status(200).json({
            status: true,
            product
        });
    }
    catch (error) {
        next(error);
    }
};
exports.productByIsbn = productByIsbn;
const ProductByCategory = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { category } = req.params;
        const product = await (0, product_services_1.getProductsByCategory)(category, page, limit);
        return res.status(200).json({
            status: true,
            product
        });
    }
    catch (error) {
        next(error);
    }
};
exports.ProductByCategory = ProductByCategory;
const productByAuthor = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { author } = req.params;
        const product = await (0, product_services_1.getProductsByAuthor)(author, page, limit);
        return res.status(200).json({
            status: true,
            product
        });
    }
    catch (error) {
        next(error);
    }
};
exports.productByAuthor = productByAuthor;
const productByPublisher = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { publisher } = req.params;
        const product = await (0, product_services_1.getProductsByPublisher)(publisher, page, limit);
        return res.status(200).json({
            status: true,
            product
        });
    }
    catch (error) {
        next(error);
    }
};
exports.productByPublisher = productByPublisher;
const productEdit = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const productid = req.params.id;
        const { title, description, isbn, language, author, publisher, published_Date, noOfPages } = req.body;
        const user = req.user;
        const id = user.id;
        const data = {
            title: title,
            description: description,
            ISBN: isbn,
            author: author,
            publisher: publisher,
            published_Date: new Date(published_Date),
            noOfPages: noOfPages,
            language: language
        };
        const product = (0, product_services_1.EditProduct)(id, productid, data);
        return res.status(200).json({
            status: true,
            message: 'product updated'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.productEdit = productEdit;
const search = async (req, res, next) => {
    try {
        const query = req.query.q || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.page) || 10;
        const filters = {
            title: req.query.title,
            author: req.query.author,
            publisher: req.query.publisher,
            minPublishedDate: req.query.minPublishedDate,
            maxPublishedDate: req.query.maxPublishedDate,
            minAverageRating: req.query.minAverageRating,
            minNumberOfReviews: req.query.minNumberOfReviews,
            minTotalSold: req.query.minTotalSold,
            isDiscounted: req.query.isDiscounted,
            language: req.query.language,
            category: req.query.category,
            isbn: req.query.isbn
        };
        const products = await (0, product_services_1.searchProducts)(filters, page, limit);
        return res.status(200).json({
            status: true,
            products
        });
    }
    catch (error) {
        next(error);
    }
};
exports.search = search;
const addFormat = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { type, product, stock, price } = req.body;
        const data = {};
        if (type === 'physical') {
            data.type = type;
            data.price = price;
            data.stock = stock;
            data.product = product;
        }
        if (type !== 'physical') {
            if (Array.isArray(req.files) && req.files.length > 0) {
                const urls = await (0, cloudinary_1.cloudinaryImageUploadMethod)(req.files, process.env.PRODUCTFILEDOWNLOADFOLDER);
                data.downloadLink = urls[0];
                data.type = type;
                data.price = price;
                data.product = product;
            }
        }
        // if format type exist already 
        const format = await (0, format_services_1.addFormatToProduct)(data, product);
        return res.status(200).json({
            status: true,
            format
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'product not found') {
                return res.status(404).json({
                    message: 'product not found'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.addFormat = addFormat;
const removeFormat = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { productid, formatid } = req.body;
        const format = await (0, format_services_1.removeFormatFromProduct)(productid, formatid);
        return res.status(200).json({
            status: true,
            format
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'product not found') {
                return res.status(404).json({
                    message: 'product not found'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.removeFormat = removeFormat;
const IncreaseStockForPhysicalFormat = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { stock, productid, formatid } = req.body;
        const data = {
            stock
        };
        const format = await (0, format_services_1.updateStockInProduct)(data, productid, formatid);
        return res.status(200).json({
            status: true,
            format
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'product not found') {
                return res.status(404).json({
                    message: 'product not found'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.IncreaseStockForPhysicalFormat = IncreaseStockForPhysicalFormat;
const updatePriceFormat = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { price, productid, formatid } = req.body;
        const data = {
            price
        };
        const format = await (0, format_services_1.updateFormatPrice)(data, productid, formatid);
        return res.status(200).json({
            status: true,
            format
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'product not found') {
                return res.status(404).json({
                    message: 'product not found'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.updatePriceFormat = updatePriceFormat;
const newArrivalsProduct = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const products = await (0, product_services_1.newArrivals)(page, limit);
        if (products) {
            return res.status(200).json({
                status: true,
                products
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.newArrivalsProduct = newArrivalsProduct;
const bestBooksByGenre = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const products = await (0, product_services_1.bestBooksFromGenre)(category, page, limit);
        if (products) {
            return res.status(200).json({
                status: true,
                products
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Category not found') {
                return res.status(200).json({
                    message: 'category does not exist'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.bestBooksByGenre = bestBooksByGenre;
const bestSellersProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const products = await (0, product_services_1.bestSellers)(page, limit);
        if (products) {
            return res.status(200).json({
                status: true,
                products
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.bestSellersProducts = bestSellersProducts;
const recentlySoldBooks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const products = await (0, product_services_1.recentlySold)(page, limit);
        if (products) {
            return res.status(200).json({
                status: true,
                products
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.recentlySoldBooks = recentlySoldBooks;
const addProductPreviewFile = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const productid = req.query.productid;
        if (Array.isArray(req.files) && req.files.length > 0) {
            const urls = await (0, cloudinary_1.cloudinaryImageUploadMethod)(req.files, process.env.PRODUCTBOOKPREVIEWFOLDER);
            const preview = await (0, product_services_1.addPreviewFile)(urls[0], productid);
            return res.status(200).json({
                message: 'preview added',
                status: true
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Product not found') {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.addProductPreviewFile = addProductPreviewFile;
const updateCoverImages = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const productid = req.query.productid;
        const user = req.user;
        const userid = user.id;
        if (Array.isArray(req.files) && req.files.length > 0) {
            const urls = await (0, cloudinary_1.cloudinaryImageUploadMethod)(req.files, process.env.PRODUCTBOOKPREVIEWFOLDER);
            const preview = await (0, product_services_1.updateCoverImgs)(urls, productid, userid);
            return res.status(200).json({
                message: 'cover images uploaded',
                status: true
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Product not found') {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            else {
                next(error);
            }
        }
    }
};
exports.updateCoverImages = updateCoverImages;
