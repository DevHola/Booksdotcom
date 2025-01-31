import express from 'express'
import { createCategory, editACategory, GetCategories, GetCategoryById, GetCategoryByName } from '../controllers/category.controllers'
import passport from 'passport'
import { categoryNameOrIdValidation, categoryValidation } from '../middlewares/validation'
import { authorization } from '../middlewares/passport'
const categoryRouter = express.Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The category name
 *       example: 
 *         name: Fiction
 */
/**
 * @swagger
 * /category/:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: category created successfully
 *       400:
 *         description: Bad request
 */
categoryRouter.post('/', categoryValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['admin']}), createCategory)
categoryRouter.patch('/:id', categoryValidation, passport.authenticate('jwt', { session: false }), authorization({role: ['admin']}), editACategory)
categoryRouter.get('/name', categoryNameOrIdValidation, GetCategoryByName)
categoryRouter.get('/:id', categoryNameOrIdValidation, GetCategoryById)
/**
 * @swagger
 * /category/:
 *   get:
 *     summary: Get a list of categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           description: The number of categories to return per page
 *         example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           description: The page number to fetch
 *         example: 1
 *     responses:
 *       200:
 *         description: List of categories
 */
categoryRouter.get('/', GetCategories)
export default categoryRouter