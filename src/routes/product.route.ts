import express from 'express'
import { addFormat, addProductPreviewFile, bestBooksByGenre, bestSellersProducts, createProduct, getproductAll, IncreaseStockForPhysicalFormat, newArrivalsProduct, productByAuthor, ProductByCategory, productById, productByIsbn, productByPublisher, productByTitle, productEdit, recentlySoldBooks, removeFormat, search, updatePriceFormat } from '../controllers/product.controllers'
import passport from 'passport'
import { upload } from '../middlewares/cloudinary';
import { allCreatorOrder, allCreatorOrderSuborder, createUserOrder, getUserOrder, handlerWebhook, orderSingleData } from '../controllers/order.controllers';
import { formatValidation, previewFileValidation, removeformatValidation, StockValidation, updatePriceValidation } from '../middlewares/validation';
import { authorization } from '../middlewares/passport';
import { checkACoupon, couponDelete, createCoupon, getAllCoupons, getSingleCoupon } from '../controllers/coupon.controllers';

const productRouter = express.Router()
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

productRouter.post('/', passport.authenticate('jwt', { session: false }), authorization({role: ['creator','admin']}),upload.array('img',4), createProduct)
productRouter.get('/', getproductAll)
productRouter.patch('/:id', passport.authenticate('jwt', { session: false }), authorization({role: ['creator','admin']}), productEdit)
productRouter.get('/search', search)
productRouter.get('/:id', productById)
productRouter.get('/title/:title', productByTitle)
productRouter.get('/isbn/:Isbn', productByIsbn)
productRouter.get('/category/:category', ProductByCategory)
productRouter.get('/author/:author', productByAuthor)
productRouter.get('/publisher/:publisher', productByPublisher)
// format
productRouter.post('/format', formatValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['creator','admin']}), upload.array('file',1),  addFormat)
productRouter.delete('/format/delete', removeformatValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['creator','admin']}), removeFormat)
productRouter.patch('/format/stock', StockValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['creator','admin']}),  IncreaseStockForPhysicalFormat)
productRouter.patch('/format/price', updatePriceValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['creator','admin']}),  updatePriceFormat)
productRouter.patch('/book/preview', previewFileValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['creator','admin']}), upload.array('file',1), addProductPreviewFile )
// homepage
productRouter.get('/new/arrival', newArrivalsProduct)
productRouter.get('/best/category', bestBooksByGenre)
productRouter.get('/best/sellers', bestSellersProducts)
productRouter.get('/recently/sold', recentlySoldBooks)
// order
productRouter.post('/order', passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), createUserOrder)
productRouter.get('/user/order', passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), getUserOrder)
productRouter.get('/order/:id', passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), orderSingleData)
productRouter.get('/creator/orders', passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), allCreatorOrder)
productRouter.get('/creator/single/order', passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), allCreatorOrderSuborder)
// coupon
productRouter.post('/coupon', passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), createCoupon)
productRouter.get('/coupons', passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), getAllCoupons)
productRouter.get('/coupon/single', passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), getSingleCoupon)
productRouter.get('/coupon/check', passport.authenticate('jwt', { session: false }), authorization({role: ['user']}), checkACoupon)
productRouter.delete('/coupon', passport.authenticate('jwt', { session: false }), authorization({role: ['creator']}), couponDelete)



// paystack webhook
productRouter.post('/webhook/order', handlerWebhook)
export default productRouter