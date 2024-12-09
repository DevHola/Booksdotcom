import RateModel, { IRating } from "../models/rating.model";
export const createReview = async (rateNumber: number, review: string, product: string, user: string): Promise<IRating> => {
    // const newreview = await new RateModel()
    return await RateModel.addAndUpdateReview(rateNumber, review, product, user) as IRating
}
export const getProductReview = async (productId:string): Promise<IRating[]> => {
   return await RateModel.find({product: productId}) as IRating[]
}
export const getsingleReview = async (Id:string): Promise<IRating> => {
    return await RateModel.findOne({_id: Id}) as IRating
 }
export const editReview = async (reviewId: string, number: number, text: string): Promise<IRating> => {
    return await RateModel.editAndUpdateReview(reviewId, number, text) as IRating    
}
export const getUserReviews = async (userId: string): Promise<IRating[]> => {
    return await RateModel.find({user: userId}) as IRating[]
}
