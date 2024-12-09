import mongoose, { Schema, model, Model, Document} from "mongoose";
interface IWishlist extends Document {
    products: String[]
}
const WishlistSchema = new Schema<IWishlist>({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    ]

}, { timestamps: true })
const WishlistModel: Model<IWishlist> = model<IWishlist>('wishlists', WishlistSchema)
export default WishlistModel