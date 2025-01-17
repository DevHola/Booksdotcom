import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { DecodedToken } from "../middlewares/passport";
import { createReview, editReview, getProductReview, getsingleReview, getUserReviews } from "../services/review.services";
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
            status: true,
            review: add
        })
    } catch (error) {
        next(error)
    }
}
export const getProductReviews = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const productid = req.params.id
        const reviews = await getProductReview(productid)
        return res.status(200).json({
            status: true,
            reviews
        })
    } catch (error) {
        next(error)
    }
    
}
export const editProductReview = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { reviewid, ratenumber, review } = req.body
        const user = req.user as DecodedToken
        const userid = user.id
        const reviewcheck = await getsingleReview(reviewid)
        if(reviewcheck.user != userid ){
            return res.status(401).json({
                message: 'unauthorised'
            })
        }
        const reviews = await editReview(reviewid, ratenumber, review)
        return res.status(200).json({
            status: true,
            reviews
        })
    } catch (error) {
        next(error)
    }
}
export const getUserProductReviews = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const userid = req.params.id
        const reviews = await getUserReviews(userid)
        return res.status(200).json({
            status: true,
            reviews
        })
    } catch (error) {
        next(error)
    }
}
export const getReview = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const id = req.params.id
        const review = await getsingleReview(id)
        return res.status(200).json({
            status: true,
            review
        })
    } catch (error) {
        next(error)
    }
}