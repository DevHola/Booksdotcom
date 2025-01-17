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
    imgsrc?: String
    isFeatured?: Boolean
    balance: Number
    author?: mongoose.Schema.Types.ObjectId
}
const ProfileSchema = new Schema<IProfile>({
    biography: {
        type: String,
        lowercase: true
    },
    achievements: [AchievementSchema],
    imgsrc: {
        type: String
    },
    isFeatured: {
        type: Boolean,
        default: false,
        index: true 
    }, 
    balance: {
        type: Number,
        default: 0, 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }

}, { timestamps: true})
const ProfileModel: Model<IProfile> = model<IProfile>('profiles', ProfileSchema)
export default ProfileModel