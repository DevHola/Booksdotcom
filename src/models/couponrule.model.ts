import mongoose, { Document, model, Model, Schema } from "mongoose"
export interface IRules extends Document {
    couponid: String
    limit?: Number
    month?: String[]
    day?: Number[]
    daysOfWeek?: String[]
    startDate?: Date
    endDate?: Date
}
const ruleSchema = new Schema<IRules>({
    couponid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupons'
    },
    limit: Number,
    month: [String],
    day: [Number],
    daysOfWeek: [String],
    startDate: Date,
    endDate: Date
}, { timestamps: true } )
const ruleModel: Model<IRules> = model<IRules>('couponrules', ruleSchema)
export default ruleModel