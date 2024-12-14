// incorporate formats into controlleers
import mongoose, {Document, Schema, Model, model} from "mongoose";
import { ICategory } from "./category.model";
import { formatSchema, IFormat } from "./format.model";
export interface IProduct extends Document {
    title: String
    description: String
    ISBN: String
    author: String[]
    price: Number
    publisher: string
    published_Date: Date
    noOfPages: number
    coverImage: String
    averageRating?: Number
    numberOfReviews?: Number
    totalSold?: Number
    isDiscounted?: Boolean
    discountinPercent?: Number
    language: String
    categoryid: ICategory
    user: String    
    formats: IFormat[]
}
const ProductSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
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
    author: [{
        type: String,
        required: true,
        lowercase: true
    }],
    price: {
        type: Number,
        required: true,
        default: 0
    },
    publisher: {
        type: String,
        required: true
    },
    published_Date: {
        type: Date,
        required: true
    },
    noOfPages: {
        type: Number,
        required: true
    },
    coverImage: {
        type: String
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    totalSold: {
        type: Number,
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
    language: {
        type: String,
        required: true
    },
    categoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    formats: {
        type: [formatSchema]
    }

}, { timestamps: true })
const productModel: Model<IProduct> = model<IProduct>('products', ProductSchema)
export default productModel