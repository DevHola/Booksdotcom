import mongoose, {Model, model, Schema, Document} from 'mongoose'
import { IRules } from './couponrule.model'
export interface ICoupon extends Document{
    code: String
    type: "fixed" | "percentage" 
    expiresAt: Date
    isActive: Boolean
    usageCount: Number
    discount: Number
    ruleType: "none" | "month-specific" | "day-specific-in-month" | "day-specific-in-week" | "month-and-day-specific" | "month-and-days-of-week-specific"
    | "day-range-specific"
    | "time-period-specific"
    rules?: IRules
    product: String[]
    vendor: String
    isDeleted: boolean
}

export const couponSchema = new Schema<ICoupon>({
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['fixed','percentage'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageCount: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        required: true
    },
    ruleType: {
        type: String,
        required: true
    },
    rules: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'couponrules'
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'products'
    }],
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
const CouponModel: Model<ICoupon> = model<ICoupon>('coupons', couponSchema)
export default CouponModel