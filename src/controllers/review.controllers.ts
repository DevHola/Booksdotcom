import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { DecodedToken } from "../middlewares/passport";
import { createReview, editReview, getProductReview, getsingleReview, getUserReviews } from "../services/review.services";
import { IRating } from "../models/rating.model";
export const addReview = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(401).json({
            errors: error.array()
        })
    }
    try {
        const { rateNumber, review, product } = req.body
        const user = req.user as DecodedToken
        const id = user.id
        const add = await createReview(rateNumber, review, product, id)
        return res.status(200).json({
            message:'success',
            review: add
        })
    } catch (error) {
        next(error)
    }
}
export const getProductReviews = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    try {
        const productid = req.params.id
        const reviews = await getProductReview(productid)
        return res.status(200).json({
            message: 'success',
            reviews
        })
    } catch (error) {
        next(error)
    }
    
}
export const editProductReview = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    try {
        const { reviewid, ratenumber, text } = req.body
        const user = req.user as DecodedToken
        const userid = user.id
        const reviewcheck = await getsingleReview(reviewid)
        console.log(userid , reviewcheck.user)
        if(reviewcheck.user != userid ){
            return res.status(401).json({
                message: 'unauthorised'
            })
        }
        const review = await editReview(reviewid, ratenumber, text)
        return res.status(200).json({
            message: 'success',
            review
        })
    } catch (error) {
        next(error)
    }
}
export const getUserProductReviews = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    try {
        const userid = req.params.id
        const reviews = await getUserReviews(userid)
        return res.status(200).json({
            message:'success',
            reviews
        })
    } catch (error) {
        next(error)
    }
}
export const getReview = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    try {
        const id = req.params.id
        const review = await getsingleReview(id)
        return res.status(200).json({
            message:'success',
            review
        })
    } catch (error) {
        next(error)
    }
}