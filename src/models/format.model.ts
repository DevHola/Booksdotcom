import mongoose, {Document, Schema, Model, model} from "mongoose";
export interface IFormat extends Document {
    type: String
    fileSizeMB?: String
    downloadLink?: String
    weight?: String
    stock?: Number
    product?: String 
}
export const formatSchema = new Schema<IFormat>({
    type: {
        type: String,
        enum:['ebook', 'physical'],
        required: true,
        lowercase: true
    },
    fileSizeMB: {
        type: String,
        required: function() { return this.type === 'ebook'; }
    },
    downloadLink: {
        type: String,
        required: function() { return this.type === 'ebook'; }
    },
    weight: {
        type: String,
        required: function() { return this.type === 'physical'; },
        lowercase: true
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