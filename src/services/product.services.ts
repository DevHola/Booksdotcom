import mongoose from "mongoose";
export interface IProductFilter {
    title?: string;
    author?: string[];
    minPrice?: number;
    maxPrice?: number;
    publisher?: string;
    minPublishedDate?: Date;
    maxPublishedDate?: Date;
    minAverageRating?: number;
    minNumberOfReviews?: number;
    minTotalSold?: number;
    isDiscounted?: boolean;
    minDiscountinPercent?: number;
    maxDiscountinPercent?: number;
    language?: string;
    categoryid?: string;
  }
  export interface ISearchResult{
    products: [],
    currentPage: number,
    totalPage: number,
    totalProducts: number
  }
  
import productModel, { IProduct } from "../models/product.model";
import CategoryModel from "../models/category.model";
export const newProduct = async (data:any): Promise<IProduct> => {
    const product = await productModel.create({
        title: data.title,
        description: data.description,
        ISBN: data.ISBN,
        author: data.author,
        publisher: data.publisher,
        published_Date: data.published_Date,
        noOfPages: data.noOfPages,
        coverImage: data.coverImage,
        language: data.language,
        categoryid: data.categoryid,
        user: data.user
        })
        return await product.save()
    
}
export const getProductById = async (id:string): Promise<IProduct> => {
    return await productModel.findById(id) as IProduct  
}
export const getAllProduct = async (): Promise<IProduct[]> => {
    return await productModel.find() as IProduct[]  
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
                publisher: 1,
                published_Date: 1,
                noOfPages: 1,
                coverImage: 1,
                averageRating: 1,
                numberOfReviews: 1,
                totalSold: 1,
                isDiscounted: 1,
                discountinPercent: 1,
                formats: 1,
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
// modify price is now in format
export const searchProducts = async (filter: IProductFilter, page: number, limit: number): Promise<ISearchResult> => {
    const query: any = {}
    if(filter.title){
        query.title = { $regex: new RegExp(filter.title, 'i') };
    }
    if(filter.author){
        query.author = { $in: filter.author }
    }
    if(filter.publisher){
        query.publisher = filter.publisher
    }
    if(filter.minPublishedDate){
        query.published_Date = {...query.published_Date, $gte: filter.minPublishedDate  }
    }
    if(filter.maxPublishedDate){
        query.published_Date = {...query.published_Date, $lte: filter.maxPublishedDate  }
    }
    if(filter.minAverageRating !== undefined){
        query.averageRating = { $gte: filter.minAverageRating  }
    }
    if(filter.minNumberOfReviews !== undefined){
        query.numberOfReviews = { $gte: filter.minNumberOfReviews  }
    }
    if(filter.minTotalSold !== undefined){
        query.totalSold = {$gte: filter.minTotalSold  }
    }
    if(filter.isDiscounted !== undefined){
        query.isDiscounted = filter.isDiscounted  
    }
    if(filter.minDiscountinPercent !== undefined){
        query.discountinPercent = {...query.discountinPercent, $gte: filter.minDiscountinPercent  }
    }
    if(filter.maxDiscountinPercent !== undefined){
        query.discountinPercent = {...query.discountinPercent, $lte: filter.maxDiscountinPercent  }
    }
    if(filter.language !== undefined){
        query.language = filter.language  
    }
    if(filter.categoryid !== undefined){
        query.categoryid = filter.categoryid  
    }
    const products = await productModel.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit ).limit(limit)
    const producttotal = await productModel.find(query).countDocuments()
    return { products, currentPage: page, totalPage: Math.ceil(producttotal/limit), totalProducts: producttotal  } as ISearchResult
}
export const newArrivals = async (page: number, limit: number): Promise<ISearchResult> => {
    const [products, totalProducts] = await Promise.all([
        await productModel.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        await productModel.countDocuments()
    ])  
    console.log(products)
    return { products, currentPage: page, totalPage: Math.ceil(totalProducts/limit), totalProducts: totalProducts  } as ISearchResult
}
export const bestBooksFromGenre = async (category: string, page: number, limit: number) => {
    const searchcategory = await CategoryModel.findOne({name: category})
    if (!searchcategory) {
        throw new Error('Category not found');
    }
    const [products, totalproduct] = await Promise.all([
        await productModel.aggregate([
            {
            $lookup: {
                from: 'categories',
                localField:'categoryid',
                foreignField:'_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $match: {
                'averageRating': { $gte: 4},
                'category.name': category
            }
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
                formats: 1,
                user: 1,
                category: '$category.name'
            }
        }
    
    ]).sort({ averageRating: -1, numberOfReviews: -1 }).skip((page -1 ) * limit).limit(limit).exec(),
    await productModel.find({ categoryid: searchcategory }).countDocuments()   
    ])
    return { products, currentPage: page, totalPage: Math.ceil(totalproduct/limit), totalProducts: totalproduct  } as ISearchResult
}
export const bestSellers = async (page: number, limit: number): Promise<ISearchResult> => {
    const [products, totalproduct] = await Promise.all([
        await productModel.find().sort({ totalSold: -1 }).skip((page - 1 ) *  limit).limit(limit).exec(),
        await productModel.countDocuments()
    ])
    return { products, currentPage: page, totalPage: Math.ceil(totalproduct/limit), totalProducts: totalproduct  } as ISearchResult    
}