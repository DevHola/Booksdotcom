import mongoose, { Document, Schema, model, Model } from "mongoose";
import productModel from "./product.model";
interface IRating extends Document {
    rateNumber: Number
    review?: String
    product: String
    user: String
}
const RatingSchema = new Schema<IRating>({
    rateNumber: {
        type: Number,
        required: true,
        default: 0
    },
    review: {
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
RatingSchema.methods.addAndUpdateReview = async function (data:IRating) {
     const rating = await RateModel.create({
        rateNumber: data.rateNumber,
        review: data.review,
        product: data.product,
        user: data.user
     })
     await rating.save()
     const ratings = await RateModel.find({ product: data.product })
     const averageRatingtotal = "add all rating number & divide by total number of ratings"
     const update = await productModel.findByIdAndUpdate(data._id, { averageRating: averageRatingtotal })

}
const RateModel: Model<IRating> = model<IRating>('ratings', RatingSchema)
export default RateModel