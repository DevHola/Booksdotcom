import OrderModel, { IOrder } from "../models/order.model"
import SubOrderModel, { IOrderProduct, ISubOrder } from "../models/suborder.model"
import { creditAuthorAccount } from "./auth.services"
import { IProductDefuse, updateStockOrderInitiation } from "./product.services"
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
export const createOrder = async (data:IOrder): Promise<IOrder> => {
     const order = await OrderModel.create({
        trackingCode: data.trackingCode,
        user: data.user,
        status: data.status,
        total: data.total,
        paymentHandler: data.paymentHandler,
        ref: data.ref
     })
     await order.save()
     return order as IOrder
}
export const createSubOrder = async (data:any): Promise<ISubOrder> => {
    const subOrder = await SubOrderModel.create({
       orderid: data.orderid,
       author: data.author,
       products: data.products,
       total: data.total,
       status: data.status
    })
    await subOrder.save()
    return subOrder as ISubOrder
}
export const getAuthUserOrder = async (userid: string, page: number, limit: number): Promise<IOrderSearchResult> => {
    const orders = await OrderModel.find({user: userid}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
    const ordercount = await OrderModel.find({user: userid}).countDocuments()
    return { orders, currentPage: page, totalPage: Math.ceil(ordercount / limit), totalOrders:ordercount } as IOrderSearchResult
}
export const getSingleOrderData = async (id: string): Promise<ISubOrder[]> => {
    return await SubOrderModel.find({orderid: id}, {products: 1} ).populate({
        path: 'products.product',
        select:'title coverImage'
    }).exec() as ISubOrder[]  
}
export const getCreatorOrders = async (userid: string, page: number, limit: number): Promise<IOrderSearchResult> => {
    const orders = await OrderModel.find({creators: {
        $in: userid
    }}).sort({ createdAt: -1}).skip((page - 1) * limit).limit(limit).exec()
    const ordersCount = await OrderModel.find({creators: {
        $in: userid
    }}).countDocuments()
    return { orders, currentPage: page, totalPage: Math.ceil(ordersCount / limit), totalOrders: ordersCount } as IOrderSearchResult
}
export const getCreatorSingleOrder = async (userid:string, orderid: string): Promise<ISubOrder[]> => {
    const suborder = await SubOrderModel.find({orderid: orderid, author: userid}).populate({
        path: 'products.product',
        select:'title coverImage'
    })
    return suborder
}
export const webHook = async (data: any) => {
    const orderinformation = data.metadata
    const newOrder = JSON.parse(orderinformation) 
    const orderExist = await OrderModel.findOne({ trackingCode: newOrder.trackingCode })
    if(orderExist){
        throw new Error('tracking code exist')
    }
    // need to review this
    const order = await createOrder(data)
    if(!order){
        throw new Error('Error creating order')
    }
    return order
}
export const genTrackingCode = async (username: string): Promise<string> => { 
    const date = Date.now()
    return date + '-' + username
}
export const addOrderCreators = async (orderid: string, creatorid: string) => {
    await OrderModel.updateOne({_id: orderid}, {
        $push: {
            creators: creatorid
        }
    })    
}
export const vBS = async (groupProductslist: any, orderid: string) => {
    for (const [author, products] of Object.entries(groupProductslist)) {
        const total = (products as IProductDefuse[]).reduce((sum, product) => sum + product.price, 0) 
        const data = {
            orderid: orderid as string,
            author: author as string,
            products: products as IOrderProduct[],
            total: total as number,
            status: 'pending' as string,
        }
        await createSubOrder(data)
        await addOrderCreators(data.orderid, data.author)
        await creditAuthorAccount(author as string, total as number);
        const product = (products as IOrderProduct[]).filter((product) => product.format === 'physical')   
        for (const item of product){
            await updateStockOrderInitiation(item.product as any, item.quantity as number)
        }
    }
}
