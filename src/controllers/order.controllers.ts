import { Request, Response, NextFunction } from "express";
import { createOrder, genTrackingCode, getAuthUserOrder, getCreatorOrders, getCreatorSingleOrder, getSingleOrderData, IOrderSearchResult, updateSubOrderStatus, vBS, webHook } from "../services/order.services";
import { DecodedToken } from "../middlewares/passport";
import { IOrder } from "../models/order.model";
import crypto from 'crypto'
import { groupProducts, IProductDefuse } from "../services/product.services";
import { IOrderProduct } from "../models/suborder.model";

// // Online Javascript Editor for free
// // Write, Edit and Run your Javascript code using JS Online Compiler

// const order = {
//     "total": 10000,
//     "products":[{"product":"67927df747908ab4f63f4f66","quantity":1,"format":"physical","price":100},{"product":"67927df747908ab4f63f4f68","quantity":1,"format":"physical","price":100}],
//     "status":true,
//     "paymentHandler":"paystack",
//     "ref":"854hjdjfd"
// }
// const str = JSON.stringify(order, null, 2)
// console.log(str)
// const parse = JSON.parse(str)
// console.log(parse)

export const createUserOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as DecodedToken
        const id = user.id
        const trackingCode = await genTrackingCode(user.name)
        const products = req.body.products as IProductDefuse[]
        const status = req.body.status
        const paymentHandler = req.body.paymentHandler
        const ref = req.body.ref
        const total = req.body.total
        const data: any ={
            trackingCode: trackingCode as string,
            user: id as string,
            total: total as number,
            status: status as boolean,
            paymentHandler: paymentHandler as string,
            ref: ref as string
        }
        // CREATE ORDER
        // GROUP PRODUCTS BY USER - returns an object with key as user id and value as array of products
        const [groupProductslist] = await Promise.all([await groupProducts(products)])
        const distribute = await vBS(groupProductslist, data as IOrder)        
        return res.status(200).json({
            status: true,
            distribute
        })
    } catch (error) {
        if(error instanceof Error){
            if(error.message === 'Error in creating order'){
                return res.status(400).json({
                    message: 'Error in creating order'
                })
            } else {
                next(error)
            }
        }
    }
    
}

export const getUserOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.page as string) || 10
        const user = req.user as DecodedToken
        const id = user.id
        const orders: IOrderSearchResult = await getAuthUserOrder(id, page, limit)
        return res.status(200).json({
            status: true,
            orders
        })
    } catch (error) {
        next(error)
    }
    
}
export const orderSingleData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const orderid = req.params.id
        const productarray: IOrderProduct[] = []
        const order = await getSingleOrderData(orderid)
        if(!order){
            throw new Error('order does not exist')
        }
        order.map((items)=> {
            items.products.map((item)=>{
                productarray.push(item)
            })
        })
        return res.status(200).json({
            status: true,
            order: productarray
        })
        
    } catch (error) {
        if(error instanceof Error){
            if(error.message === 'order does not exist'){
                return res.status(404).json({
                    message: 'order not found'
                })
            } else {
                next(error)
            }
        }
    }
}
export const allCreatorOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const user = req.user as DecodedToken
        const id = user.id
        const orders = await getCreatorOrders(id, page, limit)
        return res.status(200).json({
            status: true,
            orders
        })
    } catch (error) {
        next(error)
    }
}
export const allCreatorOrderSuborder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const orderid = req.query.orderid as string
        const user = req.user as DecodedToken
        const id = user.id
        console.log(user)
        const suborders = await getCreatorSingleOrder(id, orderid)
        return res.status(200).json({
            status: true,
            suborders
        })
    } catch (error) {
        next(error)
    }
}
export const creatorUpdateSuborder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const orderid = req.query.orderid as string
        const suborderid = req.query.suborderid as string
        const status = req.body.status
        const suborder = await updateSubOrderStatus(orderid, suborderid, status)
        return res.status(200).json({
            status: true,
            suborder
        })
    } catch (error) {
        next(error)
    }
}
export const handlerWebhook = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const hash = crypto.createHmac('sha512', process.env.PAYSTACKSECRET as string).update(JSON.stringify(req.body)).digest('hex');
        if (hash == req.headers['x-paystack-signature']) {
        const data = req.body;
        if(data.event === 'charge.success') {
        // Do something with event
        const order = await webHook(data.data)
        return res.status(200).json({
            status: true,
            order
        })
        }
    }
        
        
    } catch (error) {
        next(error)
    }
}