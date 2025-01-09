import mongoose, { Schema, model, Model, Document} from "mongoose";
interface INteraction extends Document {
    product: String
    type: string
    user: any
}
const interactionSchema = new Schema<INteraction>({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    type: {
            type: String,
            required: true,
            enum: ['view']
        },
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        
    }

}, { timestamps: true })
const InteractionModel: Model<INteraction> = model<INteraction>('activities', interactionSchema)
export default InteractionModel