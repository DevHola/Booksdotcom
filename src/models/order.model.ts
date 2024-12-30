import mongoose, { Schema, Document, Model, model } from 'mongoose'
import { IProduct } from './product.model'
interface IOrderProduct extends Document {
    product: IProduct
    format: String
    price: Number
    quantity: Number
}
const OrderProduct = new Schema<IOrderProduct>({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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

export interface IOrder extends Document {
    trackingCode: String
    user: String
    products: IOrderProduct[]
    status: Boolean
    paymentHandler: String
    ref: String
}

const OrderSchema = new Schema<IOrder>({
    trackingCode: {
        type: String,
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    products: [OrderProduct],
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    paymentHandler: {
        type: String,
        required: true,
        lowercase: true
    },
    ref: {
        type: String,
        unique: true
    }

}, { timestamps: true })
const OrderModel: Model<IOrder> = model<IOrder>('orders', OrderSchema)
export default OrderModel