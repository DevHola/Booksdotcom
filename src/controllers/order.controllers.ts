import { Request, Response, NextFunction } from "express";
import { createOrder, genTrackingCode, getAuthUserOrder, getCreatorOrders, getCreatorSingleOrder, getSingleOrderData, IOrderSearchResult, vBS, webHook } from "../services/order.services";
import { DecodedToken } from "../middlewares/passport";
import { IOrder } from "../models/order.model";
import crypto from 'crypto'
import { groupProducts, IProductDefuse } from "../services/product.services";
import { IOrderProduct } from "../models/suborder.model";


export const createUserOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as DecodedToken
        const id = user.id
        const trackingCode = await genTrackingCode(user.username)
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
        const [order, groupProductslist] = await Promise.all([await createOrder(data as IOrder), await groupProducts(products)])
        const orderid = order._id
        const distribute = await vBS(groupProductslist, orderid as string)        
        return res.status(200).json({
            status: true,
            order
        })
    } catch (error) {
        next(error)
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
        const orders = getCreatorOrders(id, page, limit)
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
        const suborders = await getCreatorSingleOrder(id, orderid)
        return res.status(200).json({
            status: true,
            suborders
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