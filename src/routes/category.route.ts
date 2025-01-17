import express from 'express'
import { createCategory, editACategory, GetCategories, GetCategoryById, GetCategoryByName } from '../controllers/category.controllers'
import passport from 'passport'
import { categoryNameOrIdValidation, categoryValidation } from '../middlewares/validation'
import { authorization } from '../middlewares/passport'
const categoryRouter = express.Router()
categoryRouter.post('/', categoryValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['admin']}), createCategory)
categoryRouter.patch('/:id', categoryValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['admin']}), editACategory)
categoryRouter.get('/name', categoryNameOrIdValidation, GetCategoryByName)
categoryRouter.get('/:id', categoryNameOrIdValidation, GetCategoryById)
categoryRouter.get('/', GetCategories)
export default categoryRouter