import mongoose, { Document, Schema, model, Model } from "mongoose";
interface IRating extends Document {
    rateNumber: Number
    text?: String
    product: String
    user: String
}
const RatingSchema = new Schema<IRating>({
    rateNumber: {
        type: Number,
        required: true,
        default: 0
    },
    text: {
        type: String
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }

}, { timestamps: true})
const RateModel: Model<IRating> = model<IRating>('ratings', RatingSchema)
export default RateModel