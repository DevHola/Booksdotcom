import OrderModel, { IOrder } from "../models/order.model"
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
        products: data.products,
        status: data.status,
        paymentHandler: data.paymentHandler,
        ref: data.ref
     })
     await order.save()
     return order as IOrder
}
export const getOrderByFilterQueries = async (data: ISearchQueries, page: number, limit: number,): Promise<IOrderSearchResult> => {
    const query: any = {}
    if(data.trackingCode !== undefined){
        query.trackingCode = data.trackingCode
    }
    if(data.status !== undefined){
        query.status = data.status
    }
    if(data.ref !== undefined){
        query.ref = data.ref
    }
    if(data.user !== undefined) {
        query.user = data.user
    }
    const orders = await OrderModel.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
    const ordercount = await OrderModel.find(query).countDocuments()
    return { orders, currentPage: page, totalPage: Math.ceil(ordercount / limit), ordercount } as unknown as IOrderSearchResult
}
export const getSingleOrderData = async (id: string): Promise<IOrder> => {
    return await OrderModel.findById(id).populate('products.products').exec() as IOrder
}
export const webHook = async (data: any) => {
    const orderExist = await OrderModel.findOne({ trackingCode: data.trackingCode })
    if(orderExist){
        throw new Error('tracking code exist')
    }
    const order = await createOrder(data)
    if(!order){
        throw new Error('Error creating order')
    }
    return order
}
export const checkTrackingCode = async (trackingCode: string): Promise<boolean> => { 
    const order = await OrderModel.findOne({ trackingCode: trackingCode})
    if(order){
        return true
    } else {
        return false
    }
}
