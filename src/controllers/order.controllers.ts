import { Request, Response, NextFunction } from "express";
import { checkTrackingCode, createOrder, getOrderByFilterQueries, getSingleOrderData, IOrderSearchResult, ISearchQueries, webHook } from "../services/order.services";
import { DecodedToken } from "../middlewares/passport";
import { IOrder } from "../models/order.model";
import crypto from 'crypto'

export const createUserOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = req.user as DecodedToken
        const id = user.id
        const { trackingCode, products, status, paymentHandler, ref } = req.body
        const data: any ={
            trackingCode: trackingCode as string,
            products: products as string[],
            status: status as boolean,
            paymentHandler: paymentHandler as string,
            ref: ref as string
        }
        const order:IOrder = await createOrder(data as IOrder)
        return res.status(200).json({
            status: true,
            order
        })
        
    } catch (error) {
        next(error)
    }
    
}
export const getOrderBySearchQuery = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.page as string) || 10
        const filters = {
            trackingCode: req.query.trackingCode,
            status: req.query.status,
            ref: req.query.ref,
            user: req.query.user
        }
        const orders: IOrderSearchResult = await getOrderByFilterQueries(filters as ISearchQueries, page, limit,)
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
        const order = await getSingleOrderData(orderid)
        if(!order){
            throw new Error('order does not exist')
        }
        return res.status(200).json({
            status: true,
            order
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