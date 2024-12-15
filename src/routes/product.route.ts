import express from 'express'
import { addFormat, createProduct, getproductAll, productByAuthor, ProductByCategory, productById, productByIsbn, productByPublisher, productByTitle, removeFormat, search, UpdateFormat } from '../controllers/product.controllers'
import passport from 'passport'
const productRouter = express.Router()
productRouter.post('/', passport.authenticate('jwt', { session: false }), createProduct)
productRouter.get('/', getproductAll)
productRouter.get('/search', search)
productRouter.get('/:id', productById)
productRouter.get('/title/:title', productByTitle)
productRouter.get('/isbn/:Isbn', productByIsbn)
productRouter.get('/category/:category', ProductByCategory)
productRouter.get('/author/:author', productByAuthor)
productRouter.get('/publisher/:publisher', productByPublisher)
productRouter.post('/format', passport.authenticate('jwt', { session: false }), addFormat)
productRouter.delete('/format/delete', passport.authenticate('jwt', { session: false }), removeFormat)
productRouter.patch('/format', passport.authenticate('jwt', { session: false }), UpdateFormat)
export default productRouter