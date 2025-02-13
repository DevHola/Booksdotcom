import mongoose, { ClientSession } from "mongoose"
import CouponModel, { ICoupon } from "../models/coupon.model"
import ruleModel, { IRules } from "../models/couponrule.model"
import { updateDiscountStatus } from "./product.services"
import moment from "moment"
import cron from "node-cron"
import { IProduct } from "../models/product.model"
interface ICouponResult{
    coupons: []
    currentPage: number
    totalPage: number
    totalResult: number
}
export const couponCreation = async (data: ICoupon) => {
    const session = await mongoose.startSession()
    return session.withTransaction(async () => {
        try {
            const coupon = await newCoupon(data, session)   
            await updateDiscountStatus(data.product as string[], true, session)
            if(data.ruleType !== 'none' && data.rules && coupon) {
                    const refined = await structureSubOrder(data.rules, data.ruleType, coupon._id as string)
                    const rules = await newRules(refined, session)
                    await addRulesToCoupon(rules._id as string, coupon._id as string, session)
            } 
            return coupon
        } catch (error) {
            throw new Error('Error creating coupon')
        }
    }).finally(() => session.endSession())    
}

const newCoupon = async (data: ICoupon, session: ClientSession): Promise<ICoupon> => {
    const coupon = await CouponModel.create([data], {session})
    return coupon[0] as ICoupon
}

const newRules = async (data: IRules, session: ClientSession): Promise<IRules> => {
    const rules = await ruleModel.create([data], {session})
    return rules[0] as IRules
}

const addRulesToCoupon = async (id: string, couponid: string, session: ClientSession) => {
    const coupon = await CouponModel.updateOne({_id: couponid}, {
        $set: {
            rules: id
        }
    }).session(session)
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
export const aDCouponStatus = async (type: boolean, code: string): Promise<any> => {
    const coupon = await CouponModel.findOne({code: code})
    if(coupon && coupon.isActive === type){
        throw new Error('coupon status set already')
    }
    const session = await mongoose.startSession()
    return session.withTransaction(async () => {
        try {
            const update = await CouponModel.findOneAndUpdate({code: code}, {
                $set: {
                    isActive: type
                }
            }, {new: true}).session(session)
            if(type === true){
                await updateDiscountStatus(coupon?.product as string[], true, session)
            } else {
                await updateDiscountStatus(coupon?.product as string[], false, session)
            }
            return update
        } catch (error) {
            throw new Error('error updating coupon status')
        }
    }).finally(()=> session.endSession())
}
export const deleteCoupon = async (couponCode: string): Promise<void> => {
    const session = await mongoose.startSession()
    return session.withTransaction(async () => {
        try {
            await CouponModel.updateOne({code: couponCode}, {
                $set: {
                    isDeleted: true,
                    isActive: false
                }
            }).session(session)
            const coupondata = await CouponModel.findOne({code: couponCode}).session(session) as ICoupon   
            await updateDiscountStatus(coupondata.product as string[], false as boolean, session)
        } catch (error) {
            throw new Error('error deleting coupon')
        }
    })
    .finally(()=> session.endSession())
}
export const updateCouponUsage = async (code: string, session: ClientSession): Promise<ICoupon> => {
    return await CouponModel.findOneAndUpdate({code: code}, {
        $inc: {
            usageCount: 1
        }
    }, {new: true}).session(session) as ICoupon  
}
export const expiredCouponDeletion = async (data:any): Promise<void> => {
 const session = await mongoose.startSession()
 return session.withTransaction(async () => {
    try {
        const today = moment()
        const coupons = await CouponModel.find({$expr :{
           $or: [
               {$lt: ["$expiresAt", today]},
               {$eq: ["$usageCount", "$rules.limit"]}
           ]
        }, isActive: true}).populate('rules').lean().session(session)
        const couponids = await formatCouponIds(coupons)
        
        const couponProducts = await formatCouponProducts(coupons)
       
        await Promise.all([await CouponModel.updateMany({_id: {$in: couponids}}, {
           $set: {
               isActive: false
           }
        }).session(session), await updateDiscountStatus(couponProducts, false, session)])
       
    } catch (error) {
        console.log(error)
        throw new Error('error deleting expired coupons')        
    }

 }).finally(() => session.endSession())
}
const formatCouponProducts = async (coupons:ICoupon[]): Promise<string[]> => {
    let ids: any[] = []   
    for (const coupon of coupons) {
            ids.concat(coupon.product)       
    }
    return [...new Set(ids)]
}
const formatCouponIds = async (coupons:ICoupon[]): Promise<string[]> => {
    let ids: string[] = []   
    for (const coupon of coupons) {
        ids.push(coupon._id as string)
    }
    return [...new Set(ids)]
}
const couponCount = async (): Promise<number> => {
    const count = await CouponModel.countDocuments()
    return count
}
interface IProcessformat{
    name: string
    original_price: string
    discount: string
    final_prize: string
}
export const processFormatData = async (productdata: IProduct, coupon: ICoupon): Promise< IProcessformat[]> =>{
    let data: any[] = [] 
    const formats = productdata.formats
    for(const format of formats){
        if(coupon.type === 'fixed'){
            let detail :IProcessformat = {
                name: format.type as string,
                original_price: (format.price).toString() as string,
                discount:(coupon.discount).toString() as string,
                final_prize: (Number(format.price) - Number(coupon.discount)).toString() as string
            }
            data.push(detail)
        }else if (coupon.type === 'percentage'){
            const calculate = (Number(coupon.discount)/100) * Number(format.price)
            const total = Number(format.price) - calculate
            let detail = {
                name: format.type,
                original_price: format.price,
                discount:coupon.discount,
                final_prize: (total).toString()
            }
            data.push(detail)
        }
    }
    return data as IProcessformat[]
}

// cron.schedule('0 0 * * *', async () => {    
//     const count = await couponCount()
//     if(count > 0) await expiredCouponDeletion(data)
// })