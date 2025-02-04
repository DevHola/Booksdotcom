import { Request, Response, NextFunction } from "express";
import { DecodedToken } from "../middlewares/passport";
import { addAchievement, createProfile, editProfile, getProfile, removeAchievement } from "../services/profile.services";
import { cloudinaryImageUploadMethod } from "../middlewares/cloudinary";
import { validationResult } from "express-validator";

export const createUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
          return res.status(400).json({
              errors: errors.array()
          })
      }
    try {
        const user = req.user as DecodedToken
        const id = user.id
        const biography = req.body.biography
        const data: any = {
            biography: biography as string,
            author: id
        }
        if(Array.isArray(req.files) && req.files.length > 0){
            const urls = await cloudinaryImageUploadMethod(req.files, process.env.PRODUCTPROFILEFOLDER as string)
            data.imgsrc = urls[0]
        }
        const profile = await createProfile(data)
        if(profile){
            return res.status(200).json({
                status: true,
                profile
            })
        }
        
    } catch (error) {
        next(error)
    }
} 
export const editUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const user = req.user as DecodedToken
        const id = user.id
        const biography = req.body.biography
        const data: any = {
            biography: biography as string,
        }
        if(Array.isArray(req.files)){
            const urls = await cloudinaryImageUploadMethod(req.files, process.env.PRODUCTPROFILEFOLDER as string)
            data.imgsrc = urls[0] 
        }
        if(data.imgsrc === undefined || data.imgsrc === '') data.imgsrc = req.body.imgsrc
        const profile = await editProfile(data, id)
        if(profile){
            return res.status(200).json({
                status: true,
                profile
            })
        }
    } catch (error) {
        if(error instanceof Error){
            if(error.message === 'Update failed'){
                return res.status(401).json({
                    status: false,
                    message: 'error occured while updating profile'
                })
            } else{
                next(error)
            }
        }
    }
    
}
export const getAuthorProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userid = req.query.userId
        const profile = await getProfile(userid as string)
        if(profile){
            return res.status(200).json({
                status: true,
                profile
            })
        }
    } catch (error) {
        next(error)
    }
}
export const addAuthorAchievement = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const user = req.user as DecodedToken
        const id = user.id
        const {title, description} = req.body
        const data: any = {
            title: title as string, description: description as string
        }
        const achievement = await addAchievement(data, id)
        if(!achievement){
            return res.status(400).json({
                status: false,
                message:'Achievement could not be added to achievement list'
            })
        }
        return res.status(200).json({
            status: true,
            achievement
        })

    } catch (error) {
        next(error)
    }
}
export const removeAuthorAchievement = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const user = req.user as DecodedToken
        const id = user.id
        const achievementid = req.query.achievement
        const achievement = await removeAchievement(achievementid, id)
        if(!achievement){
            return res.status(400).json({
                status: false,
                message:'Achievement could not be removed from achievement list'
            })
        }
        return res.status(200).json({
            status: true,
            achievement
        })

    } catch (error) {
        next(error)
    }
}