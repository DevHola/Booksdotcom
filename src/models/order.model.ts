import mongoose, { Schema, Document, Model, model } from 'mongoose'
interface IOrder extends Document {
    user: String,
    product: String
    status: Boolean
    PaymentHandler: String
    Ref: String
}
const OrderSchema = new Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
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