"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDiscountStatus = exports.updateDiscountStatus = exports.updateStockOrderInitiation = exports.groupProducts = exports.getProductAuthoor = exports.addPreviewFile = exports.recentlySold = exports.bestSellers = exports.bestBooksFromGenre = exports.newArrivals = exports.searchProducts = exports.EditProduct = exports.getProductsByPublisher = exports.getProductsByAuthor = exports.getProductsByCategory = exports.getProductByIsbn = exports.getProductByTitle = exports.getAllProduct = exports.getProductById = exports.newProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const suborder_model_1 = __importDefault(require("../models/suborder.model"));
const newProduct = async (data) => {
    const product = await product_model_1.default.create({
        title: data.title,
        description: data.description,
        ISBN: data.ISBN,
        author: data.author,
        publisher: data.publisher,
        published_Date: data.published_Date,
        noOfPages: data.noOfPages,
        coverImage: data.coverImage,
        language: data.language,
        categoryid: data.categoryid,
        user: data.user
    });
    return await product.save();
};
exports.newProduct = newProduct;
const getProductById = async (id) => {
    return await product_model_1.default.findById(id);
    // Book preview is required so we would not return format.url for all   
};
exports.getProductById = getProductById;
const getAllProduct = async (page, limit) => {
    return await product_model_1.default.find().skip((page - 1) * limit).limit(limit);
    // Book preview is required so we would not return format.url for all
};
exports.getAllProduct = getAllProduct;
const getProductByTitle = async (title) => {
    return await product_model_1.default.findOne({ title: title });
};
exports.getProductByTitle = getProductByTitle;
const getProductByIsbn = async (Isbn) => {
    return await product_model_1.default.findOne({ ISBN: Isbn });
};
exports.getProductByIsbn = getProductByIsbn;
const getProductsByCategory = async (category, page, limit) => {
    return await product_model_1.default.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryid',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $match: { 'category.name': category }
        },
        {
            $project: {
                title: 1,
                description: 1,
                ISBN: 1,
                author: 1,
                publisher: 1,
                published_Date: 1,
                noOfPages: 1,
                coverImage: 1,
                averageRating: 1,
                numberOfReviews: 1,
                totalSold: 1,
                isDiscounted: 1,
                formats: 1,
                user: 1,
                category: '$category.name'
            }
        }
    ]).skip((page - 1) * limit).limit(limit).exec();
};
exports.getProductsByCategory = getProductsByCategory;
const getProductsByAuthor = async (author, page, limit) => {
    return product_model_1.default.find({ author: { $in: author } }).skip((page - 1) * limit).limit(limit).populate('categoryid', 'user').exec();
};
exports.getProductsByAuthor = getProductsByAuthor;
const getProductsByPublisher = async (publisher, page, limit) => {
    return await product_model_1.default.find({ publisher: publisher }).skip((page - 1) * limit).limit(limit).populate('categoryid').exec();
};
exports.getProductsByPublisher = getProductsByPublisher;
const EditProduct = async (id) => {
    return product_model_1.default.findByIdAndUpdate(id, {}, { upsert: true });
};
exports.EditProduct = EditProduct;
// modify price is now in format
const searchProducts = async (filter, page, limit) => {
    const query = {};
    if (filter.title) {
        query.title = { $regex: new RegExp(filter.title, 'i') };
    }
    if (filter.author) {
        query.author = { $in: filter.author };
    }
    if (filter.publisher) {
        query.publisher = filter.publisher;
    }
    if (filter.minPublishedDate) {
        query.published_Date = { ...query.published_Date, $gte: filter.minPublishedDate };
    }
    if (filter.maxPublishedDate) {
        query.published_Date = { ...query.published_Date, $lte: filter.maxPublishedDate };
    }
    if (filter.minAverageRating !== undefined) {
        query.averageRating = { $gte: filter.minAverageRating };
    }
    if (filter.minNumberOfReviews !== undefined) {
        query.numberOfReviews = { $gte: filter.minNumberOfReviews };
    }
    if (filter.minTotalSold !== undefined) {
        query.totalSold = { $gte: filter.minTotalSold };
    }
    if (filter.isDiscounted !== undefined) {
        query.isDiscounted = filter.isDiscounted;
    }
    if (filter.language !== undefined) {
        query.language = filter.language;
    }
    if (filter.categoryid !== undefined) {
        query.categoryid = filter.categoryid;
    }
    const products = await product_model_1.default.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const producttotal = await product_model_1.default.find(query).countDocuments();
    return { products, currentPage: page, totalPage: Math.ceil(producttotal / limit), totalProducts: producttotal };
};
exports.searchProducts = searchProducts;
const newArrivals = async (page, limit) => {
    const [products, totalProducts] = await Promise.all([
        await product_model_1.default.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        await product_model_1.default.countDocuments()
    ]);
    return { products, currentPage: page, totalPage: Math.ceil(totalProducts / limit), totalProducts: totalProducts };
};
exports.newArrivals = newArrivals;
const bestBooksFromGenre = async (category, page, limit) => {
    const searchcategory = await category_model_1.default.findOne({ name: category });
    if (!searchcategory) {
        throw new Error('Category not found');
    }
    const [products, totalproduct] = await Promise.all([
        await product_model_1.default.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryid',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $match: {
                    'averageRating': { $gte: 4 },
                    'category.name': category
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    ISBN: 1,
                    author: 1,
                    price: 1,
                    publisher: 1,
                    published_Date: 1,
                    noOfPages: 1,
                    coverImage: 1,
                    averageRating: 1,
                    numberOfReviews: 1,
                    totalSold: 1,
                    isDiscounted: 1,
                    formats: 1,
                    user: 1,
                    category: '$category.name'
                }
            }
        ]).sort({ averageRating: -1, numberOfReviews: -1 }).skip((page - 1) * limit).limit(limit).exec(),
        await product_model_1.default.find({ categoryid: searchcategory }).countDocuments()
    ]);
    return { products, currentPage: page, totalPage: Math.ceil(totalproduct / limit), totalProducts: totalproduct };
};
exports.bestBooksFromGenre = bestBooksFromGenre;
const bestSellers = async (page, limit) => {
    const [products, totalproduct] = await Promise.all([
        await product_model_1.default.find().sort({ totalSold: -1 }).skip((page - 1) * limit).limit(limit).exec(),
        await product_model_1.default.countDocuments()
    ]);
    return { products, currentPage: page, totalPage: Math.ceil(totalproduct / limit), totalProducts: totalproduct };
};
exports.bestSellers = bestSellers;
const recentlySold = async (page, limit) => {
    const getRecentOrder = await order_model_1.default.find().sort({ createdAt: -1 }).limit(50);
    const getSubOrder = await suborder_model_1.default.find({ orderid: { $in: getRecentOrder } });
    // NEEDS REFACTORING & Testing
    let productarray = [];
    for (let product of getSubOrder) {
        productarray = productarray.concat(product.products);
    }
    //remove duplicates
    productarray = [...new Set(productarray)];
    const products = await product_model_1.default.find({ _id: { $in: productarray } }).skip((page - 1) * limit).limit(limit);
    return { products, currentPage: page, totalPage: Math.ceil(productarray.length / limit), totalProducts: productarray.length };
};
exports.recentlySold = recentlySold;
const addPreviewFile = async (url, productid) => {
    const product = await product_model_1.default.findById(productid);
    if (!product) {
        throw new Error('Product not found');
    }
    const addpreviewfile = await product_model_1.default.findByIdAndUpdate(product._id, {
        $set: {
            previewFileurl: url
        }
    }, { new: true });
    if (!addpreviewfile) {
        throw new Error('error updating preview file');
    }
    return addpreviewfile;
};
exports.addPreviewFile = addPreviewFile;
const getProductAuthoor = async (productid) => {
    const user = await product_model_1.default.findById(productid, { user: 1, _id: 0 });
    if (!user) {
        throw new Error('Product not found');
    }
    return user;
};
exports.getProductAuthoor = getProductAuthoor;
const groupProducts = async (products) => {
    const grouped = {};
    for (const product of products) {
        const author = (await (0, exports.getProductAuthoor)(product.product)).user;
        if (!grouped[author])
            grouped[author] = [];
        grouped[author].push(product);
    }
    return grouped;
};
exports.groupProducts = groupProducts;
const updateStockOrderInitiation = async (productId, quantity, session) => {
    const value = quantity * -1;
    await product_model_1.default.updateOne({ _id: productId, 'formats.type': 'physical' }, {
        $inc: {
            'formats.$.stock': value
        }
    }, { upsert: true }).session(session);
};
exports.updateStockOrderInitiation = updateStockOrderInitiation;
const updateDiscountStatus = async (ids, session) => {
    const products = await product_model_1.default.updateMany({ _id: { $in: ids } }, {
        $set: {
            isDiscounted: true
        }
    }, { upsert: true }).session(session);
    if (!products) {
        throw new Error('error occurred updating product discount');
    }
};
exports.updateDiscountStatus = updateDiscountStatus;
const removeDiscountStatus = async (ids, status, session) => {
    const products = await product_model_1.default.updateMany({ _id: { $in: ids } }, {
        $set: {
            isDiscounted: status
        }
    }, { upsert: true }).session(session);
};
exports.removeDiscountStatus = removeDiscountStatus;
