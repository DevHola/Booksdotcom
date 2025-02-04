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
/**
 * @swagger
 * components:
 *   schemas:
 *     Format:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [ebook, physical, audiobook]
 *           description: The format type of the product (e.g., ebook, physical, audiobook)
 *         price:
 *           type: number
 *           description: The price of the product format
 *         downloadLink:
 *           type: string
 *           description: The download link for ebook formats (required for ebook & audiobooks formats)
 *         stock:
 *           type: number
 *           description: The stock count for physical formats (required for physical formats)
 *         product:
 *           type: string
 *           description: The ID of the associated product
 *       example:
 *         type: "ebook"
 *         price: 9.99
 *         downloadLink: "http://example.com/ebook-download"
 *         product: "60f7c1b2f1a6f63461d4e9ac"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the product (book)
 *         description:
 *           type: string
 *           description: A detailed description of the product
 *         ISBN:
 *           type: string
 *           description: The ISBN number of the product (book)
 *         author:
 *           type: array
 *           items:
 *             type: string
 *           description: List of authors of the product
 *         publisher:
 *           type: string
 *           description: The publisher of the product
 *         published_Date:
 *           type: string
 *           format: date
 *           description: The publication date of the product
 *         noOfPages:
 *           type: number
 *           description: The total number of pages in the product
 *         img:
 *           type: array
 *           items:
 *             type: string
 *           description: List of URLs to cover images for the product
 *         previewFileurl:
 *           type: string
 *           description: URL for the preview file of the product (e.g., sample chapter)
 *         averageRating:
 *           type: number
 *           description: The average rating of the product based on reviews
 *         numberOfReviews:
 *           type: number
 *           description: The number of reviews for the product
 *         totalSold:
 *           type: number
 *           description: The total number of units sold for the product
 *         isDiscounted:
 *           type: boolean
 *           description: Whether the product is discounted or not
 *         language:
 *           type: string
 *           description: The language of the product
 *         categoryid:
 *           type: object
 *           description: The ID is an object that holds the category name the product belongs to
 *         user:
 *           type: string
 *           description: The ID of the user who created the product
 *         formats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Format'
 *           description: List of available formats for the product (e.g., ebook, physical, audiobook)
 *       example:
 *         title: "The Great Book"
 *         description: "An exciting adventure story set in a fantasy world."
 *         ISBN: "978-1234567890"
 *         author: ["John Doe", "Jane Smith"]
 *         publisher: "Fantasy Books"
 *         published_Date: "2025-01-01"
 *         noOfPages: 350
 *         coverImage: ["http://example.com/images/cover1.jpg"]
 *         previewFileurl: "http://example.com/files/preview.pdf"
 *         averageRating: 4.5
 *         numberOfReviews: 100
 *         totalSold: 5000
 *         isDiscounted: true
 *         language: "English"
 *         categoryid: "12345"
 *         user: "67890"
 *         formats:
 *           - type: "ebook"
 *             price: 9.99
 *             downloadLink: "http://example.com/ebook-download"
 *             product: "60f7c1b2f1a6f63461d4e9ac"
 *           - type: "physical"
 *             price: 19.99
 *             stock: 50
 *             product: "60f7c1b2f1a6f63461d4e9ac"
 */
/**
 * @swagger
 * /products/:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the product (book)
 *               description:
 *                 type: string
 *                 description: A detailed description of the product
 *               isbn:
 *                 type: string
 *                 description: The ISBN number of the product (book)
 *               author:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of authors of the product
 *               publisher:
 *                 type: string
 *                 description: The publisher of the product
 *               published_Date:
 *                 type: string
 *                 format: date
 *                 description: The publication date of the product
 *               noOfPages:
 *                 type: number
 *                 description: The total number of pages in the product
 *               img:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of images product cover
 *               language:
 *                 type: string
 *                 description: The language of the product
 *               categoryid:
 *                 type: string
 *                 description: The ID of the category the product belongs to
 *             required:
 *               - title
 *               - description
 *               - isbn
 *               - author
 *               - publisher
 *               - published_Date
 *               - noOfPages
 *               - img
 *               - language
 *               - categoryid
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 */
productRouter.post('/', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), cloudinary_1.upload.array('img', 4), product_controllers_1.createProduct);
productRouter.get('/', product_controllers_1.getproductAll);
/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: Edit product details
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               author:
 *                 type: array
 *                 items:
 *                   type: string
 *               publisher:
 *                 type: string
 *               published_Date:
 *                 type: string
 *                 format: date
 *               noOfPages:
 *                 type: integer
 *               language:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *               - ISBN
 *               - author
 *               - publisher
 *               - published_Date
 *               - noOfPages
 *               - language
 *     responses:
 *       200:
 *         description: Successfully updated the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request, missing fields or invalid data
 *       401:
 *         description: Unauthorized, authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
productRouter.patch('/:id', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.productEdit);
/**
 * @swagger
 * /product/edit/coverimage:
 *   patch:
 *     summary: Update cover images for a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of images to be uploaded as cover images (max 4 images)
 *     responses:
 *       200:
 *         description: Successfully updated cover images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedImages:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of URLs of the updated cover images
 *       400:
 *         description: Invalid request, file upload failed
 *       401:
 *         description: Unauthorized, authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       500:
 *         description: Internal server error
 */
productRouter.patch('/edit/coverimage', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), cloudinary_1.upload.array('file', 4), product_controllers_1.updateCoverImages);
/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search for products based on various filters
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: The search query term (for general search across fields)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number to paginate results (defaults to 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of results per page (defaults to 10)
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by product title
 *       - in: query
 *         name: author
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by product author
 *       - in: query
 *         name: publisher
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by product publisher
 *       - in: query
 *         name: minPublishedDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter products published after this date
 *       - in: query
 *         name: maxPublishedDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter products published before this date
 *       - in: query
 *         name: minAverageRating
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *         description: Filter products with a minimum average rating
 *       - in: query
 *         name: minNumberOfReviews
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter products with a minimum number of reviews
 *       - in: query
 *         name: minTotalSold
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter products with a minimum number of total sales
 *       - in: query
 *         name: isDiscounted
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter products by whether they are discounted
 *       - in: query
 *         name: language
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by product language
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by product category
 *       - in: query
 *         name: isbn
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by product ISBN
 *     responses:
 *       200:
 *         description: A list of products matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
productRouter.get('/search', product_controllers_1.search);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product details by product ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid product ID format
 */
productRouter.get('/:id', product_controllers_1.productById);
/**
 * @swagger
 * /products/single/{title}:
 *   get:
 *     summary: Get product details by product title
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the product to retrieve
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid product title format
 */
productRouter.get('/single/:title', product_controllers_1.productByTitle);
// format
productRouter.post('/format', validation_1.formatValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), cloudinary_1.upload.array('file', 1), product_controllers_1.addFormat);
productRouter.delete('/format/delete', validation_1.removeformatValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.removeFormat);
productRouter.patch('/format/stock', validation_1.StockValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.IncreaseStockForPhysicalFormat);
productRouter.patch('/format/price', validation_1.updatePriceValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.updatePriceFormat);
productRouter.patch('/book/preview', validation_1.previewFileValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), cloudinary_1.upload.array('file', 1), product_controllers_1.addProductPreviewFile);
// homepage
/**
 * @swagger
 * /products/new/arrival:
 *   get:
 *     summary: Get a list of new arrival products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items to retrieve per page
 *     responses:
 *       200:
 *         description: A list of new arrival products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   description: Total number of products available
 *       400:
 *         description: Bad request
 */
productRouter.get('/new/arrival', product_controllers_1.newArrivalsProduct);
/**
 * @swagger
 * /products/best/category:
 *   get:
 *     summary: Get a list of best books by genre/category
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items to retrieve per page
 *     responses:
 *       200:
 *         description: A list of best books by genre/category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   description: Total number of books available in this category
 *       400:
 *         description: Bad request
 */
productRouter.get('/best/category', product_controllers_1.bestBooksByGenre);
/**
 * @swagger
 * /products/best/sellers:
 *   get:
 *     summary: Get a list of best-selling products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items to retrieve per page
 *     responses:
 *       200:
 *         description: A list of best-selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   description: Total number of best-selling products
 *       400:
 *         description: Bad request
 */
productRouter.get('/best/sellers', product_controllers_1.bestSellersProducts);
/**
 * @swagger
 * /product/recently/sold:
 *   get:
 *     summary: Get a list of recently sold products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items to retrieve per page
 *     responses:
 *       200:
 *         description: A list of recently sold products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   description: Total number of recently sold products
 *       400:
 *         description: Bad request
 */
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
