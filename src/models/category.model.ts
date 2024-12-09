import {Schema, model, Document, Model} from 'mongoose'
export interface ICategory extends Document {
    name: String
}
const CategorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }
}, { timestamps: true })
const CategoryModel: Model<ICategory> =  model<ICategory>('Categories', CategorySchema)
export default CategoryModel