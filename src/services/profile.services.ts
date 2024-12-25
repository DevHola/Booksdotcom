import ProfileModel, { IProfile } from "../models/profile.model"
import UserModel from "../models/User.model"
export const createProfile = async (data: IProfile): Promise<IProfile> => {
    const user = await UserModel.findById(data.author)
    if (!user) {
        throw new Error('User not found');
    }
    if(user.role !== 'creator'){
        throw new Error('Only users with the usertype "creator" can have a profile');
    }

    const profile = await ProfileModel.create({
        biography: data.biography,
        imgsrc: data.imgsrc,
        author: data.author
    })
    await profile.save()
    await UserModel.findByIdAndUpdate(data.author, {
        $set: {
            profile: profile._id
        }
    })
    return profile as IProfile
}
export const editProfile = async (data: IProfile, userId: String ): Promise<IProfile> => {
    const userprofile = await UserModel.findById(userId, {profile: 1})
    const profile = await ProfileModel.findByIdAndUpdate(userprofile, {
        $set: {
                biography: data.biography,
                imgsrc: data.imgsrc,           
        }
    }, { new: true })
    return profile as IProfile
}
export const getProfile = async (id: string): Promise<IProfile> => {
    return await ProfileModel.findOne({ author: id }) as IProfile
}
export const addAchievement = async (data: any, userid: string): Promise<IProfile> => {
    const user = await UserModel.findById(userid)
    const profile = await ProfileModel.findById(user?.profile)
    if(!profile){
        throw new Error('Profile not found')
    }
       const update =  await ProfileModel.findByIdAndUpdate(profile._id, {
            $push: {
                achievements: data
            }
        }, {new: true})  
        return update as IProfile 
}
export const removeAchievement = async (achievementid: any, userid: string): Promise<IProfile> => {
    const user = await UserModel.findById(userid)
    const profile = await ProfileModel.findById(user?.profile)
    if(!profile){
        throw new Error('Profile not found')
    }
       const update =  await ProfileModel.findByIdAndUpdate(profile._id, {
            $pull: {
                achievements: {
                    _id: achievementid
                }
            }
        }, { new: true })  

        if (!update) {
            throw new Error('Update failed');
        }
        return update as IProfile 
}