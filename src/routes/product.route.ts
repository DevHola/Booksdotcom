import express from 'express'
import { addFormat, addProductPreviewFile, bestBooksByGenre, bestSellersProducts, createProduct, getproductAll, IncreaseStockForPhysicalFormat, newArrivalsProduct, productByAuthor, ProductByCategory, productById, productByIsbn, productByPublisher, productByTitle, productEdit, recentlySoldBooks, removeFormat, search, updatePriceFormat } from '../controllers/product.controllers'
import passport from 'passport'
import { upload } from '../middlewares/cloudinary';
import { allCreatorOrder, allCreatorOrderSuborder, createUserOrder, getUserOrder, handlerWebhook, orderSingleData } from '../controllers/order.controllers';
import { formatValidation, previewFileValidation, removeformatValidation, StockValidation, updatePriceValidation } from '../middlewares/validation';
import { authorization } from '../middlewares/passport';
import { checkACoupon, couponDelete, createCoupon, getAllCoupons, getSingleCoupon } from '../controllers/coupon.controllers';

const productRouter = express.Router()
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