import mongoose, {Document, Schema, Model, model} from "mongoose";
interface IProduct extends Document {
    name: String
    desc: String
    ISBN: String
    author: String
    price: Number
    isDiscounted: Boolean
    discountinPercent: Number
    category: String
    user: String    
}
const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    desc: {
        type: String,
        required: true,
        lowercase: true
    },
    ISBN: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    author: {
        type: String,
        required: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    isDiscounted: {
        type: Boolean,
        required: true,
        default: false
    },
    discountinPercent: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }

}, { timestamps: true })
const productModel: Model<IProduct> = model<IProduct>('products', ProductSchema)
export default productModel