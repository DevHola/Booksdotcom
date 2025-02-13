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
productRouter.post('/', cloudinary_1.upload.array('img', 4), validation_1.createproductValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.createProduct);
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
 *               coverImage:
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
 *               - coverImage
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
productRouter.patch('/:id', cloudinary_1.upload.array('coverImage', 4), validation_1.editproductValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.productEdit);
// /**
//  * @swagger
//  * /product/edit/coverimage:
//  *   patch:
//  *     summary: Update cover images for a product
//  *     tags: [Product]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                   format: binary
//  *                 description: Array of images to be uploaded as cover images (max 4 images)
//  *     responses:
//  *       200:
//  *         description: Successfully updated cover images
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 updatedImages:
//  *                   type: array
//  *                   items:
//  *                     type: string
//  *                   description: Array of URLs of the updated cover images
//  *       400:
//  *         description: Invalid request, file upload failed
//  *       401:
//  *         description: Unauthorized, authentication failed
//  *       403:
//  *         description: Forbidden, user does not have sufficient permissions
//  *       500:
//  *         description: Internal server error
//  */
// productRouter.patch('/edit/coverimage', editProductImgValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['creator','admin']}), upload.array('file',4), updateCoverImages )
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
productRouter.get('/single/:title', validation_1.getProductbyTitleV, product_controllers_1.productByTitle);
// format
/**
 * @swagger
 * /product/format:
 *   post:
 *     summary: Add format to a product
 *     tags: [Format]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ebook, physical, audiobook]
 *                 description: The type of the format (ebook, physical, audiobook)
 *               price:
 *                 type: number
 *                 description: The price of the format
 *               stock:
 *                 type: integer
 *                 description: The stock available for the physical format (required if type is physical)
 *               product:
 *                 type: string
 *                 description: The product ID to associate the format with
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The file to upload for the format (optional, only for ebook or audiobook)
 *     responses:
 *       200:
 *         description: Successfully added format to the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 format:
 *                   type: object
 *                   description: The format object that was added to the product
 *       400:
 *         description: Bad request due to invalid input or missing parameters
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       404:
 *         description: Product not found, invalid product ID
 *       500:
 *         description: Internal server error
 */
productRouter.post('/format', cloudinary_1.upload.array('file', 1), validation_1.formatValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.addFormat);
/**
 * @swagger
 * /product/format/delete:
 *   delete:
 *     summary: Remove format from a product
 *     tags: [Format]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productid:
 *                 type: string
 *                 description: The ID of the product from which the format will be removed
 *               formatid:
 *                 type: string
 *                 description: The ID of the format to remove from the product
 *     responses:
 *       200:
 *         description: Successfully removed the format from the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 format:
 *                   type: object
 *                   description: The format object that was removed
 *       400:
 *         description: Bad request due to invalid input or missing parameters
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       404:
 *         description: Product not found, invalid product ID
 *       500:
 *         description: Internal server error
 */
productRouter.delete('/format/delete', validation_1.removeformatValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.removeFormat);
/**
 * @swagger
 * /product/format/stock:
 *   patch:
 *     summary: Update stock for a physical product format
 *     tags: [Format]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productid:
 *                 type: string
 *                 description: The ID of the product whose format's stock is being updated
 *               formatid:
 *                 type: string
 *                 description: The ID of the format whose stock is being updated
 *               stock:
 *                 type: integer
 *                 description: The amount of stock to add to the format
 *                 example: 50
 *     responses:
 *       200:
 *         description: Successfully updated the stock for the physical format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 format:
 *                   type: object
 *                   description: The updated format object
 *       400:
 *         description: Bad request due to invalid input or missing parameters
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       404:
 *         description: Product not found, invalid product ID
 *       500:
 *         description: Internal server error
 */
productRouter.patch('/format/stock', validation_1.StockValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.IncreaseStockForPhysicalFormat);
/**
 * @swagger
 * /product/format/price:
 *   patch:
 *     summary: Update the price for a specific product format
 *     tags: [Format]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productid:
 *                 type: string
 *                 description: The ID of the product whose format's price is being updated
 *               formatid:
 *                 type: string
 *                 description: The ID of the format whose price is being updated
 *               price:
 *                 type: number
 *                 description: The new price to be set for the format
 *                 example: 29.99
 *     responses:
 *       200:
 *         description: Successfully updated the price for the specified format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the price update
 *                 format:
 *                   type: object
 *                   description: The updated format object with the new price
 *       400:
 *         description: Bad request due to invalid input or missing parameters
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       404:
 *         description: Product not found, invalid product ID
 *       500:
 *         description: Internal server error
 */
productRouter.patch('/format/price', validation_1.updatePriceValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), product_controllers_1.updatePriceFormat);
/**
 * @swagger
 * /product/book/preview:
 *   patch:
 *     summary: Add a preview file (such as a sample chapter or cover image) for a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productid
 *         required: true
 *         description: The ID of the product to which the preview file will be added
 *         schema:
 *           type: string
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
 *                 description: The preview file to be uploaded (e.g., a sample chapter or cover image)
 *     responses:
 *       200:
 *         description: Successfully added the preview file for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "preview added"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request, validation errors in the request body or file upload
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       404:
 *         description: Product not found, invalid product ID
 *       500:
 *         description: Internal server error
 */
productRouter.patch('/book/preview', validation_1.previewFileValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator', 'admin'] }), cloudinary_1.upload.array('file', 1), product_controllers_1.addProductPreviewFile);
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
/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total:
 *                 type: number
 *                 example: 10000
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "67927df747908ab4f63f4f66"
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *                     format:
 *                       type: string
 *                       example: "physical"
 *                     price:
 *                       type: number
 *                       example: 100
 *               status:
 *                 type: boolean
 *                 example: true
 *               paymentHandler:
 *                 type: string
 *                 example: "paystack"
 *               ref:
 *                 type: string
 *                 example: "854hjdjfd"
 *     responses:
 *       200:
 *         description: Order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 distribute:
 *                   type: object
 *                   description: Order distribution details
 *       400:
 *         description: Error in creating order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error in creating order"
 *       500:
 *         description: Internal server error
 */
productRouter.post('/order', validation_1.validateOrder, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), order_controllers_1.createUserOrder);
/**
 * @swagger
 * /product/user/order:
 *   get:
 *     summary: Get all orders for the normal users with pagination
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of orders per page for pagination
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved orders for the creator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                         example: "60b8d7d1a24f1a001f9f53b2"
 *                       totalAmount:
 *                         type: number
 *                         example: 150.0
 *                       orderStatus:
 *                         type: string
 *                         example: "pending"
 *                       orderDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-30T14:00:00Z"
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       500:
 *         description: Internal server error
 */
productRouter.get('/user/order', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), order_controllers_1.getUserOrder);
/**
 * @swagger
 * /product/order/{id}:
 *   get:
 *     summary: Get the details of a specific order by ID for a user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the order data with the product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         example: "60b8d7d1a24f1a001f9f53b2"
 *                       productName:
 *                         type: string
 *                         example: "Product Name"
 *                       quantity:
 *                         type: integer
 *                         example: 1
 *                       price:
 *                         type: number
 *                         example: 50.0
 *       400:
 *         description: Bad request, invalid order ID
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       404:
 *         description: Order not found, invalid or non-existent order ID
 *       500:
 *         description: Internal server error
 */
productRouter.get('/order/:id', validation_1.orderidValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), order_controllers_1.orderSingleData);
/**
 * @swagger
 * /product/creator/orders:
 *   get:
 *     summary: Get all orders for the creator with pagination
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of orders per page for pagination
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved orders for the creator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                         example: "60b8d7d1a24f1a001f9f53b2"
 *                       totalAmount:
 *                         type: number
 *                         example: 150.0
 *                       orderStatus:
 *                         type: string
 *                         example: "pending"
 *                       orderDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-30T14:00:00Z"
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       500:
 *         description: Internal server error
 */
productRouter.get('/creator/orders', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), order_controllers_1.allCreatorOrder);
/**
 * @swagger
 * /product/creator/single/order:
 *   get:
 *     summary: Get the details of a single order and its suborders for a creator
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderid
 *         required: true
 *         description: The ID of the order to fetch suborders for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the suborders for the specified order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 suborders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       suborderId:
 *                         type: string
 *                         example: "60b8d7d1a24f1a001f9f53b3"
 *                       productId:
 *                         type: string
 *                         example: "60b8d7d1a24f1a001f9f53b2"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         example: 100.0
 *                       status:
 *                         type: string
 *                         example: "pending"
 *       400:
 *         description: Bad request, missing or invalid parameters
 *       401:
 *         description: Unauthorized, user authentication failed
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       404:
 *         description: Order not found, invalid order ID
 *       500:
 *         description: Internal server error
 */
productRouter.get('/creator/single/order', validation_1.orderidqueryValidation, passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['creator'] }), order_controllers_1.allCreatorOrderSuborder);
// paystack webhook
productRouter.post('/webhook/order', order_controllers_1.handlerWebhook);
/**
 * @swagger
 * /product/recommendations:
 *   get:
 *     summary: Get product recommendations for the user
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved product recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60b8d7d1a24f1a001f9f53b2"
 *                       title:
 *                         type: string
 *                         example: "Wireless Headphones"
 *                       coverImage:
 *                         type: array
 *                       averageRating:
 *                         type: number
 *                         example: 4.5
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       403:
 *         description: Forbidden, user does not have sufficient permissions
 *       500:
 *         description: Internal server error
 */
productRouter.get('/user/recommendations', passport_1.default.authenticate('jwt', { session: false }), (0, passport_2.authorization)({ role: ['user'] }), product_controllers_1.userRecommendation);
exports.default = productRouter;
