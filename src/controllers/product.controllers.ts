import { Request,Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { getAllProduct, getProductById, getProductByIsbn, getProductByTitle, getProductsByAuthor, getProductsByCategory, getProductsByPublisher, IProductFilter, ISearchResult, newProduct, searchProducts } from "../services/product.services";
import { DecodedToken } from "../middlewares/passport";
import { addFormatToProduct, removeFormatFromProduct, updateFormatInProduct } from "../services/format.services";
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { title, description, Isbn,language, author, price, publisher, published_Date,noOfPages, coverImage, categoryid } = req.body
        const user = req.user as DecodedToken
        const id = user.id
        const data = {
            title: title as string,
            description: description as string,
            ISBN: Isbn as string,
            author: author as string[],
            price: price as number,
            publisher: publisher as string,
            published_Date: published_Date as Date,
            noOfPages: noOfPages as number,
            coverImage: coverImage as string,
            language: language as string,
            categoryid: categoryid as any,
            user: id
        } 
        const product = await newProduct(data)
        res.status(200).json({
            status: 'success',
            product
        })
        
    } catch (error) {
        next(error)
    }
    
}
export const productById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { id } = req.params
        const product = await getProductById(id)
        return res.status(200).json({
            status: 'success',
            product
        })
    } catch (error) {
        next(error)
    }
    
}
export const productByTitle = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { title } = req.params
        const product = await getProductByTitle(title)
        return res.status(200).json({
            status: 'success',
            product
        })
    } catch (error) {
        next(error)
    }
    
}
export const getproductAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const products = await getAllProduct()
        return res.status(200).json({
            status: 'success',
            products
        })
    } catch (error) {
        next(error)
    }
    
}
export const productByIsbn = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { Isbn } = req.params
        const product = await getProductByIsbn(Isbn)
        return res.status(200).json({
            status: 'success',
            product
        })
    } catch (error) {
        next(error)
    }
    
}
export const ProductByCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { category } = req.params
        const product = await getProductsByCategory(category)
        return res.status(200).json({
            status: 'success', 
            product
        })
    } catch (error) {
        next(error)
    }
    
}

export const productByAuthor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { author } = req.params
        const product = await getProductsByAuthor(author)
        return res.status(200).json({
            status: 'success',
            product
        })
    } catch (error) {
        next(error)
    }
    
}
export const productByPublisher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { publisher } = req.params
        const product = await getProductsByPublisher(publisher)
        return res.status(200).json({
            status: 'success',
            product
        })
    } catch (error) {
        next(error)
    }
    
}
export const productEdit = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        
    } catch (error) {
        next(error)
    }
    
}
export const search = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const query = req.query.q || ''
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.page as string) || 10
        const filters = {
            title: req.query.title,
            author: req.query.author,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            publisher: req.query.publisher,
            minPublishedDate: req.query.minPublishedDate,
            maxPublishedDate: req.query.maxPublishedDate,
            minAverageRating: req.query.minAverageRating,
            minNumberOfReviews: req.query.minNumberOfReviews,
            minTotalSold: req.query.minTotalSold,
            isDiscounted: req.query.isDiscounted,
            minDiscountinPercent: req.query.minDiscountinPercent,
            maxDiscountinPercent: req.query.maxDiscountinPercent,
            language: req.query.language,
            category: req.query.category,

        }
        const products: ISearchResult = await searchProducts(filters as IProductFilter, page, limit)
        return res.status(200).json({
            products
        })        
    } catch (error) {
        next(error)
    }
}
export const addFormat = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
   try {
    const { type, fileSizeMB, downloadLink, product } = req.body
    const data: any = {
        type,
        fileSizeMB,
        downloadLink,
        product
    }
    const format = await addFormatToProduct(data, product)
    return res.status(200).json({
        message: 'success'
    })
} catch (error) {
    if(error instanceof Error){
        if(error.message === 'product not found'){
            return res.status(404).json({
                message: 'product not found'
            })
        } else{
            next(error)
        }
    }
   } 
}
export const removeFormat = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { productid, formatid } = req.body
        const format = await removeFormatFromProduct(productid, formatid)
        return res.status(200).json({
            message: 'removed'
        })
    } catch (error) {
        if(error instanceof Error){
            if(error.message === 'product not found'){
                return res.status(404).json({
                    message: 'product not found'
                })
            } else{
                next(error)
            }
        }
    }
}
export const UpdateFormat = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { stock, productid, formatid } = req.body
        const data: any = {
            stock
        }
        const format = await updateFormatInProduct(data, productid, formatid)
        return res.status(200).json({
            message: 'updated'
        })
    } catch (error) {
        if(error instanceof Error){
            if(error.message === 'product not found'){
                return res.status(404).json({
                    message: 'product not found'
                })
            } else{
                next(error)
            }
        }
    }
}