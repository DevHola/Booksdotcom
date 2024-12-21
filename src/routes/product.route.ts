import express from 'express'
import { addFormat, bestBooksByGenre, bestSellersProducts, createProduct, getproductAll, IncreaseStockForPhysicalFormat, newArrivalsProduct, productByAuthor, ProductByCategory, productById, productByIsbn, productByPublisher, productByTitle, removeFormat, search, updatePriceFormat } from '../controllers/product.controllers'
import passport from 'passport'
import { upload } from '../middlewares/cloudinary';

const productRouter = express.Router()
productRouter.post('/', passport.authenticate('jwt', { session: false }),upload.array('img',4), createProduct)
productRouter.get('/', getproductAll)
productRouter.get('/search', search)
productRouter.get('/:id', productById)
productRouter.get('/title/:title', productByTitle)
productRouter.get('/isbn/:Isbn', productByIsbn)
productRouter.get('/category/:category', ProductByCategory)
productRouter.get('/author/:author', productByAuthor)
productRouter.get('/publisher/:publisher', productByPublisher)
productRouter.post('/format', passport.authenticate('jwt', { session: false }),  addFormat)
productRouter.delete('/format/delete', passport.authenticate('jwt', { session: false }), removeFormat)
productRouter.patch('/format/stock', passport.authenticate('jwt', { session: false }),  IncreaseStockForPhysicalFormat)
productRouter.patch('/format/price', passport.authenticate('jwt', { session: false }),  updatePriceFormat)
productRouter.get('/new/arrival', newArrivalsProduct)
productRouter.get('/best/category', bestBooksByGenre)
productRouter.get('/best/sellers', bestSellersProducts)
export default productRouter