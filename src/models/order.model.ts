import mongoose, { Schema, Document, Model, model } from 'mongoose'
interface IOrder extends Document {
    user: String,
    products: String[]
    status: Boolean
    PaymentHandler: String
    Ref: String
}
interface IOrderProduct extends Document {
    product: String
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
const OrderSchema = new Schema<IOrder>({
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
    PaymentHandler: {
        type: String,
        required: true,
        lowercase: true
    },
    Ref: {
        type: String,
        unique: true
    }

}, { timestamps: true })
const OrderModel: Model<IOrder> = model<IOrder>('orders', OrderSchema)
export default OrderModel