import mongoose, {Document, Model, Schema, model} from "mongoose";
import bcrypt from 'bcrypt'
export interface IUser extends Document{
    name: string
    email: string
    role?: string
    isverified?: boolean
    password?: string
    provider: string
    provider_id?: string
    otp?: string
    wishlist: string[]
    preferences: string[]
    profile: String
    lastLogin?: Date
}
const Userschema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        lowercase: true
    },
    isverified: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
    },
    provider: {
        type: String,
        enum: ['local','google'],
        default: 'local'
    },
    provider_id: {
        type: String,
    },
    otp: {
        type: String,
        default: null
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],
    preferences: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    }],
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profiles'
    }, 
    lastLogin: {
        type: Date,
        default: Date.now()
    }

}, {timestamps: true})
Userschema.pre('save', async function (this: IUser, next) {
    const user = this as IUser
    if (user.isModified('password')) {
        try {
            user.password = await bcrypt.hash(user.password as string, 10);
            next();
        } catch (err) {
            if(err instanceof Error){
                next(err);
            }
        }
    } else {
        next();
    }
});    
const UserModel: Model<IUser> =  model<IUser>('users', Userschema)
export default UserModel