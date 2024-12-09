import mongoose, { Schema, model, Model, Document} from "mongoose";
interface IProfile extends Document {
    bio: String
    achievements: String[]
    works: String[]
}
const ProfileSchema = new Schema<IProfile>({
    bio: {
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
    ]

}, { timestamps: true})
const ProfileModel: Model<IProfile> = model<IProfile>('profile', ProfileSchema)
export default ProfileModel