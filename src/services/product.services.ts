import productModel, { IProduct } from "../models/product.model";
import CategoryModel from "../models/category.model";
import OrderModel from "../models/order.model";
import SubOrderModel from "../models/suborder.model";
import { ClientSession } from "mongoose";

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
    language?: string;
    categoryid?: string;
  }
  export interface ISearchResult{
    products: [],
    currentPage: number,
    totalPage: number,
    totalProducts: number
  }
  export interface IProductDefuse {
    product: string,
    quantity: number,
    format: string,
    price: number
}
export interface POA {
    products: IProductDefuse[],
}
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
    // Book preview is required so we would not return format.url for all   
}
export const getAllProduct = async (page: number, limit: number): Promise<IProduct[]> => {
    return await productModel.find().skip((page - 1 ) * limit).limit(limit) as IProduct[]  
        // Book preview is required so we would not return format.url for all
}

export const getProductByTitle = async (title:string): Promise<IProduct> => {
    return await productModel.findOne({title: title}) as IProduct
}
export const getProductByIsbn = async (Isbn: string): Promise<IProduct> => {
    return await productModel.findOne({ISBN: Isbn}) as IProduct
}
export const getProductsByCategory = async (category: string, page: number, limit: number) => {
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
                formats: 1,
                user: 1,
                category: '$category.name'
            }
        }

    ]).skip((page - 1 ) * limit).limit(limit).exec()
}
export const getProductsByAuthor = async (author: string, page: number, limit: number): Promise<IProduct[]> => {
    return productModel.find({author: { $in: author }}).skip((page - 1 ) * limit).limit(limit).populate('categoryid', 'user').exec()
}
export const getProductsByPublisher = async (publisher: string, page: number, limit: number): Promise<IProduct[]> => {
    return await productModel.find({publisher: publisher}).skip((page - 1) * limit).limit(limit).populate('categoryid').exec()
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
                formats: 1,
                user: 1,
                category: '$category.name'
            }
        }
    
    ]).sort({ averageRating: -1, numberOfReviews: -1 }).skip((page - 1 ) * limit).limit(limit).exec(),
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
export const recentlySold = async (page: number, limit: number): Promise<ISearchResult> => {
    const getRecentOrder = await OrderModel.find().sort({ createdAt: -1 }).limit(50)
    const getSubOrder = await SubOrderModel.find({orderid: { $in: getRecentOrder}})
    // NEEDS REFACTORING & Testing
    let productarray: any[] = []
    for(let product of getSubOrder){
         productarray = productarray.concat(product.products)
    }
    //remove duplicates
    productarray = [...new Set(productarray)];
     const products = await productModel.find({_id: { $in: productarray } }).skip(( page -1 ) * limit).limit(limit)

     return {products, currentPage: page, totalPage: Math.ceil(productarray.length/limit), totalProducts: productarray.length} as ISearchResult

}
export const addPreviewFile = async (url: string, productid: string): Promise<IProduct> => {
    const product = await productModel.findById(productid)
    if(!product){
        throw new Error('Product not found')
    }
    const addpreviewfile = await productModel.findByIdAndUpdate(product._id, {
        $set: {
            previewFileurl: url
        }
    }, {new: true})
    if(!addpreviewfile){
        throw new Error('error updating preview file')
    }
    return addpreviewfile as IProduct
    
}
export const getProductAuthoor = async (productid: string): Promise<IProduct> => {
    const user = await productModel.findById(productid, {user: 1, _id: 0})
    if(!user){
        throw new Error('Product not found')
    }
    return user as IProduct
}
export const groupProducts = async (products: IProductDefuse[]): Promise<any> => {
    const grouped: { [key: string]: IProductDefuse[] } = {}

    for (const product of products) {
        const author: string = (await getProductAuthoor(product.product)).user as string

        if (!grouped[author]) grouped[author] = []
        grouped[author].push(product)
    }

    return grouped
}
export const updateStockOrderInitiation = async (productId: string, quantity: number, session: ClientSession ) => {
    const value = quantity * - 1
    await productModel.updateOne({_id: productId, 'formats.type': 'physical'}, {
        $inc: {
            'formats.$.stock': value
        }
    },{ upsert: true }).session(session)
    
}
export const updateDiscountStatus = async (ids: string[], session: ClientSession) => {
    const products = await productModel.updateMany({_id: {$in:ids}}, {
        $set:{
            isDiscounted: true
        }
    }, {upsert: true}).session(session)    
    if(!products) {
        throw new Error('error occurred updating product discount')
    }
}
export const removeDiscountStatus = async (ids: string[], status: boolean, session: ClientSession) => {
    const products = await productModel.updateMany({_id: {$in:ids}}, {
        $set:{
            isDiscounted: status
        }
    }, {upsert: true}).session(session)   
}
