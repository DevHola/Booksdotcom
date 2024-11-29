import mongoose from "mongoose";
import productModel, { IProduct } from "../models/product.model";
export const newProduct = async (data:any): Promise<IProduct> => {
    const product = await productModel.create({
        title: data.title,
        description: data.description,
        ISBN: data.ISBN,
        author: data.author,
        price: data.price,
        publisher: data.publisher,
        published_Date: data.published_Date,
        noOfPages: data.noOfPages,
        coverImage: data.coverImage,
        categoryid: data.categoryid,
        user: data.user
        })
        console.log(data.categoryid)
        return await product.save()
    
}
export const getProductById = async (id:string): Promise<IProduct> => {
    return await productModel.findById(id) as IProduct  
}
export const getProductByTitle = async (title:string): Promise<IProduct> => {
    return await productModel.findOne({title: title}) as IProduct
}
export const getProductByIsbn = async (Isbn: string): Promise<IProduct> => {
    return await productModel.findOne({ISBN: Isbn}) as IProduct
}
export const getProductsByCategory = async (category: string) => {
    return await productModel.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField:'categoryid',
                foreignField:'_id',
                as:'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $match: { 'category.name': category }
        },
        {
            $project: {
                title: 1,
                description: 1,
                ISBN: 1,
                author: 1,
                price: 1,
                publisher: 1,
                published_Date: 1,
                noOfPages: 1,
                coverImage: 1,
                averageRating: 1,
                numberOfReviews: 1,
                totalSold: 1,
                isDiscounted: 1,
                discountinPercent: 1,
                user: 1,
                category: '$category.name'
            }
        }

    ])
}
export const getProductsByAuthor = async (author: string): Promise<IProduct[]> => {
    return productModel.find({author: { $in: author }}).populate('categoryid', 'user').exec()
}
export const getProductsByPublisher = async (publisher: string): Promise<IProduct[]> => {
    return await productModel.find({publisher: publisher}).populate('categoryid').exec()
}
export const EditProduct = async (id:string): Promise<any> => {
    return productModel.findByIdAndUpdate(id, {}, { upsert: true })
}