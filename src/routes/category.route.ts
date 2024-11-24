import express from 'express'
import { createCategory, editACategory, GetCategories, GetCategoryById, GetCategoryByName } from '../controllers/category.controllers'
import passport from 'passport'
const categoryRouter = express.Router()
categoryRouter.post('/', passport.authenticate('jwt', { session: false }), createCategory)
categoryRouter.patch('/:id', passport.authenticate('jwt', { session: false }), editACategory)
categoryRouter.get('/name', GetCategoryByName)
categoryRouter.get('/:id', GetCategoryById)
categoryRouter.get('/', GetCategories)
export default categoryRouter