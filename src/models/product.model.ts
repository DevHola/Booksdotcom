// incorporate formats into controlleers
import mongoose, {Document, Schema, Model, model} from "mongoose";
import { ICategory } from "./category.model";
import { formatSchema, IFormat } from "./format.model";
export interface IProduct extends Document {
    _id: string
    title: String
    description: String
    ISBN: String
    author: String[]
    publisher: string
    published_Date: Date
    noOfPages: number
    coverImage: String[]
    previewFileurl: String
    averageRating?: Number
    numberOfReviews?: Number
    totalSold?: Number
    isDiscounted?: Boolean
    language: String
    categoryid: ICategory
    user: String    
    formats: IFormat[]
}
export interface IProductEdit {
    title: String
    description: String
    ISBN: String
    author: String[]
    publisher: string
    published_Date: Date
    noOfPages: number
    language: String
}
const ProductSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        lowercase: true
    },
    ISBN: {
        type: String,
        unique: true,
        index: true,
        required: true,
        lowercase: true
    },
    author: [{
        type: String,
        required: true,
        lowercase: true
    }],
    publisher: {
        type: String,
        index: true,
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
    coverImage: [{
        type: String,
        required: true
    }],
    previewFileurl: {
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