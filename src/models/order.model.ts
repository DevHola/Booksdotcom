import mongoose, { Schema, Document, Model, model } from 'mongoose'
export interface IOrder extends Document {
    trackingCode: String
    user: String
    creators: String[]
    status: Boolean
    total: Number
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
    creators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ],
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    total: {
        type: Number,
        required: true
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