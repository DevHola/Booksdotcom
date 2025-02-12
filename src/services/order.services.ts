import mongoose, { ClientSession } from "mongoose"
import OrderModel, { IOrder } from "../models/order.model"
import SubOrderModel, { IOrderProduct, ISubOrder } from "../models/suborder.model"
import { creditAuthorAccount } from "./auth.services"
import { groupProducts, IProductDefuse, updateStockOrderInitiation } from "./product.services"
import { updateCouponUsage } from "./coupon.services"
export interface ISearchQueries {
    trackingCode?: string
    user?: string
    status?: string
    ref?: string
}
export interface IOrderSearchResult {
    orders: []
    currentPage: number
    totalPage: number,
    totalOrders: number
}
export const createOrder = async (data:IOrder, session: ClientSession): Promise<IOrder> => {
     const order = await OrderModel.create([data], {session})
     return order[0] as IOrder
}
export const newSubOrder = async (data:ISubOrder, session: ClientSession): Promise<ISubOrder> => {
    const subOrder = await SubOrderModel.create([data], {session})
    const products = data.products
    for(const product of products) {
        if(product.coupon !== '' && product.coupon !== undefined){
            await updateCouponUsage(product.coupon as string, session)
        }
    }
    if(!subOrder){
        throw new Error('Error creating suborder')
    }
    return subOrder[0] as ISubOrder
}
export const getAuthUserOrder = async (userid: string, page: number, limit: number): Promise<IOrderSearchResult> => {
    const [orders, ordercount] = await Promise.all([await OrderModel.find({user: userid}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), 
        await OrderModel.find({user: userid}).countDocuments()
    ])
    return { orders, currentPage: page, totalPage: Math.ceil(ordercount / limit), totalOrders:ordercount } as IOrderSearchResult
}
export const getSingleOrderData = async (id: string): Promise<ISubOrder[]> => {
    return await SubOrderModel.find({orderid: id}, {products: 1} ).populate({
        path: 'products.product',
        select:'title coverImage format'
    }).exec() as ISubOrder[]  
}
export const getCreatorOrders = async (userid: string, page: number, limit: number): Promise<IOrderSearchResult> => {
    const [orders, ordersCount] = await Promise.all([await OrderModel.find({creators: {
        $in: userid
    }}).sort({ createdAt: -1}).skip((page - 1) * limit).limit(limit).exec(), await OrderModel.find({creators: {
        $in: userid
    }}).countDocuments()])
    return { orders: orders, currentPage: page, totalPage: Math.ceil(ordersCount / limit), totalOrders: ordersCount } as IOrderSearchResult
}
export const getCreatorSingleOrder = async (userid:string, orderid: string): Promise<ISubOrder[]> => {
    return await SubOrderModel.find({orderid: orderid, author: userid}).populate({
        path: 'products.product',
        select:'title coverImage'
    })
}
export const webHook = async (data: any): Promise<void> => {
    const deconnstruct = JSON.parse(data.data.metadata.metadata.custom_fields[0].value)
    const trackingCode = await checkTrackingCode(deconnstruct.trackingCode)
        if(trackingCode) throw new Error('tracking code exists')
        const orderdata: Partial<IOrder> =  {
            trackingCode: deconnstruct.trackingCode as string,
            user: deconnstruct.user as string,
            total: deconnstruct.total as number,
            status: true as boolean,
            paymentHandler: 'paystack' as string,
            ref: data.data.reference as string
        }
        const groupProductslist = await groupProducts(deconnstruct.products)
        await vBS(groupProductslist, orderdata as IOrder)        
}
export const genTrackingCode = async (name: string): Promise<string> => { 
    const date = Date.now()
    return date + '-' + name
}
export const checkTrackingCode = async (trackingCode: string): Promise<boolean> => {    
    const order = await OrderModel.findOne({trackingCode: trackingCode})    
    if(order){
        return true
    } else{
        return false
    }
} 
export const addOrderCreators = async (orderid: string, creatorid: string, session: ClientSession) => {
    const order = await OrderModel.updateOne({_id: orderid}, {
        $push: {
            creators: creatorid
        }
    }).session(session)
    if(!order){
        throw new Error('Error adding creators')
    }
}
export const vBS = async (groupProductslist: any, data: IOrder): Promise<IOrder> => {
    const session = await mongoose.startSession()
    return session.withTransaction(async () => {
        try {
            const order = await createOrder(data as IOrder, session)
            const orderid = order._id as string
            for (const [author, products] of Object.entries(groupProductslist)) {
                const total = (products as IProductDefuse[]).reduce((sum, product) => sum + product.price, 0) 
                const subdata = {
                    orderid: orderid.toString() as string,
                    author: author as string,
                    products: products as IOrderProduct[],
                    total: total as number,
                    status: 'pending' as string,
                }
                await newSubOrder(subdata as any, session)
                await addOrderCreators(subdata.orderid, subdata.author, session)
                await creditAuthorAccount(author as string, total as number, session);
                const product = (products as IOrderProduct[]).filter((product) => product.format === 'physical')   
                for (const item of product){
                    await updateStockOrderInitiation(item.product as any, item.quantity as number, session)
                }
            }
            return order as IOrder
        } catch (error) {
            console.log(error)
            throw new Error('Error in creating order')   
        }
    }).finally(() => {
        session.endSession()
    })
    
}
export const updateSubOrderStatus = async (orderid: string, suborderid: string, status: string): Promise<ISubOrder> => {
    const suborder = await SubOrderModel.findOneAndUpdate({orderid: orderid, _id: suborderid}, {status: status}, {new: true})
    if(!suborder){
        throw new Error('Error updating suborder status')
    }
    return suborder
}