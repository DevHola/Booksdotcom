import express from 'express'
import { payment, verify } from '../controllers/pay.controllers'
const payRouter = express.Router()
payRouter.post('/', payment)
payRouter.get('/',verify)
export default payRouter