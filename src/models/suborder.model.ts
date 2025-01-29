import mongoose, { Schema, Document, Model, model } from 'mongoose'
import { IProduct } from './product.model'
export interface IOrderProduct extends Document {
    product: IProduct
    format: String
    price: Number
    quantity: Number
}
const OrderProduct = new Schema<IOrderProduct>({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      format: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
})
export interface ISubOrder extends Document { 
    orderid: mongoose.Types.ObjectId
    author: mongoose.Types.ObjectId
    products: IOrderProduct[]
    total: Number
    status: String
}
const SubOrderSchema = new Schema<ISubOrder>({
    orderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    products: [OrderProduct],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, { timestamps: true})
const SubOrderModel: Model<ISubOrder> = model<ISubOrder>('suborders', SubOrderSchema)
export default SubOrderModel