import { Request, Response, NextFunction } from "express";
import { checkCoupon, couponCreation, deleteCoupon, getAllCreatorCoupons, processFormatData, singleCoupon } from "../services/coupon.services";
import { DecodedToken } from "../middlewares/passport";
import { ICoupon } from "../models/coupon.model";
import { IRules } from "../models/couponrule.model";
import { validationResult } from "express-validator";
import { getProductById } from "../services/product.services";
export const createCoupon = async (req:Request, res:Response, next:NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
    const {code, type, expiresAt, discount, ruleType, product, rules } = req.body
    const user = req.user as DecodedToken
    const vendor = user.id
    const data: Partial<ICoupon> = {
        code,
        type,
        discount,
        expiresAt,
        ruleType,
        product,
        vendor,
        rules: rules as IRules
    }
    const coupon = await couponCreation(data as ICoupon)
    return res.status(200).json({
        status: true,
        code: coupon.code
    })

    
 } catch (error) {
    next(error)
 }   
}
export const getAllCoupons = async (req:Request, res:Response, next:NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const user = req.user as DecodedToken
        const userid = user.id
        console.log(userid)
        const coupons = await getAllCreatorCoupons(userid, page, limit)
        return res.status(200).json({
            status: true,
            coupons
        })
       
    } catch (error) {
       next(error)
    }   
}
export const getSingleCoupon = async (req:Request, res:Response, next:NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const code = req.query.code as string
        const coupon = await singleCoupon(code)
        return res.status(200).json({
            status: true,
            coupon
        })
       
    } catch (error) {
       if(error instanceof Error){
         if(error.message === 'coupon not found'){
            return res.status(404).json({
                status: false,
                message:'coupon not found'
            })
         } else{
            next(error)
         }
       }
    }   
}
export const checkACoupon = async (req:Request, res:Response, next:NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
       const couponCode = req.query.coupon as string
       const product = req.query.product as string
       let data: any[] = []
       const coupon = await checkCoupon(couponCode as string, product as string)
       const productdata = await getProductById(product)
       if(coupon && productdata){
         data = await processFormatData(productdata, coupon)
       }
       return res.status(200).json({
        status: true,
        valid: true,
        code: coupon.code,
        formats: data


       })
    } catch (error) {
       if(error instanceof Error){
        if(error.message === 'coupon not found') return res.status(404).json({ status: false, message: 'coupon not found' })
        else if (error.message === 'coupon expired') return res.status(400).json({ status: false, valid: false, message: 'coupon has expired' })
        else if (error.message === 'coupon is currently inactive') return res.status(400).json({ status: false, valid: false, message: 'coupon has been disengaged' })
        else if (error.message === 'coupon is not valid') return res.status(400).json({ status: false, valid: false, message: 'coupon does not meet criteria' })
        else if (error.message === 'Coupon max usage reached') return res.status(409).json({ status: false, valid: false, message: 'coupon reached max usage' })
        else next(error)
        }
    }   
}
export const couponDelete = async (req:Request, res:Response, next:NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const couponCode = req.query.coupon as string
        await deleteCoupon(couponCode)
        return res.status(200).json({
            status: true,
            message: 'coupon deleted'
        })
    } catch (error) {
        next(error)
    }   
}