import express from 'express'
import { createProduct, productByAuthor, ProductByCategory, productById, productByIsbn, productByPublisher, productByTitle } from '../controllers/product.controllers'
import passport from 'passport'
const productRouter = express.Router()
productRouter.post('/', passport.authenticate('jwt', { session: false }), createProduct)
productRouter.get('/:id', productById)
productRouter.get('/title/:title', productByTitle)
productRouter.get('/isbn/:Isbn', productByIsbn)
productRouter.get('/category/:category', ProductByCategory)
productRouter.get('/author/:author', productByAuthor)
productRouter.get('/publisher/:publisher', productByPublisher)
export default productRouter