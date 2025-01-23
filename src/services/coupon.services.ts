import mongoose from "mongoose"
import CouponModel, { ICoupon } from "../models/coupon.model"
import ruleModel, { IRules } from "../models/couponrule.model"
import { removeDiscountStatus, updateDiscountStatus } from "./product.services"
import moment from "moment"
interface ICouponResult{
    coupons: []
    currentPage: number
    totalPage: number
    totalResult: number
}
export const couponCreation = async (data: ICoupon) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const coupon = await CouponModel.create({
            code: data.code,
            type: data.type,
            expiresAt: data.expiresAt,
            isActive: true,
            discount: data.discount,
            ruleType: data.ruleType,
            product: data.product
        }) 
        await coupon.save()
        await updateDiscountStatus(data.product as string[])
        if(data.ruleType !== 'none' && data.rules && coupon) {
                const refined = await structureSubOrder(data.rules, data.ruleType, coupon._id as string)
                const rules = await ruleModel.create(refined)
                await rules.save()
                await addRules(rules._id as string, coupon._id as string)
        } 
        await session.commitTransaction()
        session.endSession()
        return coupon
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error('Error creating coupon')
    }
    
}

const addRules = async (id: string, couponid: string) => {
    const coupon = await CouponModel.updateOne({_id: couponid}, {
        $set: {
            rules: id
        }
    })
}
export const data = {
    limit: 2000,
    month:['january', 'feburary'],
    day: [10,20,21],
    daysOfWeek: ['monday', 'friday'],
    startDate: '12-12-2025',
    endDate: '12-12-2026'
}
export const structureSubOrder = async (data:IRules, ruleType: string, couponid: string): Promise<any> => {
    let query: any = {couponid}
    if (data.limit !== undefined) query.limit = data.limit;
    let matchStrategy: { [key: string]: () => void } = {} 
    matchStrategy = {
        'month-specific': () =>query.month = data.month,
        'day-specific-in-month': () => query.day = data.day,
        'day-specific-in-week': () => query.daysOfWeek = data.daysOfWeek,
        'month-and-day-specific': () => {query.month = data.month; query.day = data.day;},
        'month-and-days-of-week-specific':() => {query.month = data.month; query.daysOfWeek = data.daysOfWeek},
        'day-range-specific': () => query.day = data.day,
        'time-period-specific': () => {query.startDate = data.startDate; query.endDate = data.endDate}
    }
     if(matchStrategy[ruleType]) matchStrategy[ruleType]()  
        return query
} 
export const getAllCreatorCoupons = async (vendorid: string, page: number, limit: number): Promise<ICouponResult> => {
    const [coupons, totalResult] = await Promise.all([await CouponModel.find({vendor: vendorid, isDeleted: false}).sort({createdAt: -1}).skip((page - 1) * limit).limit(limit).lean(),
        await CouponModel.find({vendor:vendorid, isDeleted: false}).countDocuments()
    ])
    return {coupons, currentPage: page, totalPage: Math.ceil(totalResult/limit), totalResult } as ICouponResult       
}
export const singleCoupon = async (couponCode:string): Promise<ICoupon> => {
    const coupon = await CouponModel.findOne({code: couponCode, isDeleted: false}).populate('rules').exec() as ICoupon
    if(!coupon) throw new Error('coupon not found')
    return coupon
}
export const checkCoupon = async (couponCode: string, productid: string): Promise<ICoupon> => {
    const coupon = await CouponModel.findOne({ code: couponCode, isDeleted: false, product: {$in: productid} }).populate('rules').exec() 
    if(!coupon) throw new Error('coupon not found')
    const date = moment()
    if(date.isAfter(coupon.expiresAt)) throw new Error('coupon expired')
    if(coupon.isActive === false) throw new Error('coupon is currently inactive')
    const validity = await validityCheck(coupon, date)
    if(!validity.isValid) throw new Error('coupon is not valid')

    if(coupon.ruleType === 'none' || (coupon.rules?.limit !== undefined && coupon.usageCount < coupon.rules.limit) ) return coupon as ICoupon
    throw new Error('Coupon max usage reached');
}

export const validityCheck = async (coupon: ICoupon, date: any): Promise<{isValid: Boolean, message:String}> => {
    const rules = coupon.rules as IRules
    switch (coupon.ruleType) {
        case 'none': return { isValid: true, message: "Coupon is valid" }
            
        case "month-specific":
            return rules?.month?.includes(date.format('MMMM')) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" }
            
        case "day-specific-in-month":
            return rules?.day?.includes(date.date()) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" }

        case "day-specific-in-week":
            return rules?.daysOfWeek?.includes(date.format('dddd')) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" }
            
        case "month-and-day-specific":
            return rules?.day?.includes(date.date()) && rules?.month?.includes(date.format('MMMM')) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" }
            
        case "month-and-days-of-week-specific":
            return rules?.month?.includes(date.format('MMMM')) && rules?.daysOfWeek?.includes(date.format('dddd')) ? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" }
            
        case "day-range-specific":
        case "time-period-specific":
            return rules?.startDate && rules.endDate && date.isBetween(rules.startDate, rules.endDate)? { isValid: true, message: "Coupon is valid" } : { isValid: false, message: "coupon is invalid" }
            
        default: return { isValid: false, message: "Invalid rule type" }
            
    }
    
    
}
export const deleteCoupon = async (couponCode: string): Promise<void> => {
    const session = await mongoose.startSession()
    await session.startTransaction()

    try {
        await CouponModel.updateOne({code: couponCode}, {
            $set: {
                isDeleted: true
            }
        })
        const coupondata = await CouponModel.findOne({code: couponCode}) as ICoupon   
        await removeDiscountStatus(coupondata.product as string[], false as boolean)
        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error('error deleting coupon')
    }
}