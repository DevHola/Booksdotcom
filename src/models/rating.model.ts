import mongoose, { Document, Schema, model, Model } from "mongoose";
export interface IRating extends Document {
    rateNumber: Number
    review?: String
    product?: String
    user: String
    // addAndUpdateReview(rateNumber: number, review: string, product: string, user: string): Promise<IRating>; for methods & you need to create new instance to use it
}
interface IRatingModel extends Model<IRating> {
    addAndUpdateReview(rateNumber: number, review: string, product: string, user: string): Promise<IRating>
    editAndUpdateReview(reviewid: string, rateNumber: number, text: string ): Promise<IRating>
  
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
// act on model directly
RatingSchema.statics.addAndUpdateReview = async function (rateNumber: number, review: string, product: string, user: string): Promise<IRating> {
     const rating = await this.create({
        rateNumber: rateNumber,
        review: review,
        product: product,
        user: user
     })
     await rating.save()
     const ratings = await this.find({ product: product })
     const totalreview = ratings.length + 1
     const averageRatingtotal = ratings.reduce((sum: any, rating: IRating) => sum + rating.rateNumber, 0) / ratings.length;
     await mongoose.model('products').findByIdAndUpdate(product, {
        $set: {
            averageRating: averageRatingtotal
        },
        $inc: {
            numberOfReviews: 1
        }
     })
     return rating
}
RatingSchema.statics.editAndUpdateReview = async function (reviewid: string, rateNumber: number, text: string): Promise<IRating> {
    const rating = await this.findByIdAndUpdate(reviewid, {
        $set: {
            rateNumber: rateNumber,
            review: text
        }
    })
    const ratings = await this.find({ product: rating.product })
    const averageRatingtotal = ratings.reduce((sum: any, rating: IRating) => sum + rating.rateNumber, 0) / ratings.length;
    await mongoose.model('products').findByIdAndUpdate(rating.product, {
       $set: {
           averageRating: averageRatingtotal
       }
    })
    return rating
}
const RateModel = model<IRating, IRatingModel>('ratings', RatingSchema)
export default RateModel