import {Document, Model, Schema, model} from "mongoose";
import argon2 from "argon2";
interface IUser extends Document{
    username: string
    email: string
    role: string
    isverified: boolean
    password: string
}
const Userschema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        required: true,
        enum: ['','',''],
        lowercase: true
    },
    isverified: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: true
    }

}, {timestamps: true})
Userschema.pre('save', async function (this: IUser, next) {
    const user = this as IUser
    if (user.isModified('password')) {
        try {
            user.password = await argon2.hash(user.password);
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