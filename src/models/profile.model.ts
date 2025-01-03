import mongoose, { Schema, model, Model, Document} from "mongoose";
export interface IAchievement {
    title: String;
    description?: String;
    date?: Date;
}
const AchievementSchema = new Schema<IAchievement>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });


export interface IProfile extends Document {
    biography?: String
    achievements?: IAchievement[]
    works?: mongoose.Schema.Types.ObjectId[]
    imgsrc?: String
    isFeatured?: Boolean
    author?: mongoose.Schema.Types.ObjectId
}
const ProfileSchema = new Schema<IProfile>({
    biography: {
        type: String,
        lowercase: true
    },
    achievements: [AchievementSchema],
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
        default: false,
        index: true 
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }

}, { timestamps: true})
const ProfileModel: Model<IProfile> = model<IProfile>('profiles', ProfileSchema)
export default ProfileModel