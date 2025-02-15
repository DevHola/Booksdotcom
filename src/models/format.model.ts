import mongoose, {Document, Schema, Model, model} from "mongoose";
export interface IFormat extends Document {
    type: String
    price: number
    downloadLink?: String
    stock?: number 
    product?: String 
}
export const formatSchema = new Schema<IFormat>({
    type: {
        type: String,
        enum:['ebook', 'physical','audiobook'],
        required: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: true
    },
    downloadLink: {
        type: String,
        required: function() { return this.type === 'ebook'; }
    },
    stock: {
        type: Number,
        default: 0,
        required: function() { return this.type === 'physical'; },
        lowercase: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }

},  { timestamps: true })
const formatModel: Model<IFormat> = model<IFormat>('formats', formatSchema)
export default formatModel