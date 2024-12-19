import mongoose, { Schema, model, Model, Document} from "mongoose";
interface IProfile extends Document {
    biography: String
    achievements: String[]
    works: String[]
    imgsrc: String
    isFeatured: Boolean
    author: String
}
const ProfileSchema = new Schema<IProfile>({
    biography: {
        type: String,
        lowercase: true
    },
    achievements: [
        {
            type: String
        }
    ],
    works: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    ],
    imgsrc: {
        type: String
    },
    isFeatured: {
        type: Boolean,
        default: false 
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }

}, { timestamps: true})
const ProfileModel: Model<IProfile> = model<IProfile>('profile', ProfileSchema)
export default ProfileModel