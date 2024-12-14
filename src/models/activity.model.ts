import mongoose, { Schema, model, Model, Document} from "mongoose";
interface IActivity extends Document {
    wishlist: String[]
    preferences: String[]
    viewed: string[]
    user: any
}
const activitySchema = new Schema<IActivity>({
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    ],
    preferences: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    ],
    viewed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    ],
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        
    }

}, { timestamps: true })
const ActivityModel: Model<IActivity> = model<IActivity>('activities', activitySchema)
export default ActivityModel