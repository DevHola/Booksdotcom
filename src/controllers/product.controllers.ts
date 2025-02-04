import { Request,Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { addPreviewFile, bestBooksFromGenre, bestSellers, EditProduct, getAllProduct, getProductById, getProductByIsbn, getProductByTitle, getProductsByAuthor, getProductsByCategory, getProductsByPublisher, IProductFilter, ISearchResult, newArrivals, newProduct, recentlySold, searchProducts, updateCoverImgs } from "../services/product.services";
import { DecodedToken } from "../middlewares/passport";
import { addFormatToProduct, removeFormatFromProduct, updateFormatPrice, updateStockInProduct } from "../services/format.services";
import { cloudinaryImageUploadMethod } from "../middlewares/cloudinary";
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {

        const urls = await cloudinaryImageUploadMethod(req.files, process.env.PRODUCTIMGFOLDER as string)
        const { title, description, isbn,language, author, publisher, published_Date, noOfPages, categoryid } = req.body
        const user = req.user as DecodedToken
        const id = user.id
        if (!req.files) {
            return res.status(400).json({
              message: 'No files uploaded!',
            });
          }
        const data = {
            title: title as string,
            description: description as string,
            ISBN: isbn as string,
            author: author as string[],
            publisher: publisher as string,
            published_Date: new Date(published_Date) as Date,
            noOfPages: noOfPages as number,
            coverImage: urls as string[],
            language: language as string,
            categoryid: categoryid as any,
            user: id
        }
        const product = await newProduct(data)
        if(product){
            return res.status(201).json({
                status: true,
                product
            })
        }       
    } catch (error) {
        if(error instanceof Error){
            next(error)
        }
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
            status: true,
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
        const title  = req.params.title || String
        const product = await getProductByTitle(title as string)
        return res.status(200).json({
            status: true,
            product
        })
    } catch (error) {
        next(error)
    }
    
}
export const getproductAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const products = await getAllProduct(page, limit)
        return res.status(200).json({
            status: true,
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
            status: true,
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
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const { category } = req.params
        const product = await getProductsByCategory(category, page, limit)
        return res.status(200).json({
            status: true, 
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
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const { author } = req.params
        const product = await getProductsByAuthor(author, page, limit)
        return res.status(200).json({
            status: true,
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
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const { publisher } = req.params
        const product = await getProductsByPublisher(publisher, page, limit)
        return res.status(200).json({
            status: true,
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
        const data :any = {}
        if(Array.isArray(req.files)){
            const urls = await cloudinaryImageUploadMethod(req.files, process.env.PRODUCTIMGFOLDER as string)
            data.coverImage = urls
        }
        if(data.coverImage === undefined || data.coverImage.length === 0) data.coverImage = req.body.coverImage 
        const productid = req.params.id
        const { title, description, isbn,language, author, publisher, published_Date, noOfPages } = req.body
        const user = req.user as DecodedToken
        const id = user.id
        
            data.title = title as string,
            data.description = description as string,
            data.ISBN = isbn as string,
            data.author = author as string[],
            data.publisher = publisher as string,
            data.published_Date = new Date(published_Date) as Date,
            data.noOfPages = noOfPages as number,
            data.language = language as string
        
        const product = EditProduct(id, productid, data)
        return res.status(200).json({
            status: true,
            message: 'product updated'
        })
        
    } catch (error) {
        next(error)
    }
    
}
export const search = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.page as string) || 10
        const filters = {
            title: req.query.title,
            author: req.query.author,
            publisher: req.query.publisher,
            minPublishedDate: req.query.minPublishedDate,
            maxPublishedDate: req.query.maxPublishedDate,
            minAverageRating: req.query.minAverageRating,
            minNumberOfReviews: req.query.minNumberOfReviews,
            minTotalSold: req.query.minTotalSold,
            isDiscounted: req.query.isDiscounted,
            language: req.query.language,
            category: req.query.category,
            isbn: req.query.isbn

        }
        const products: ISearchResult = await searchProducts(filters as IProductFilter, page, limit)
        return res.status(200).json({
            status: true,
            products
        })        
    } catch (error) {
        next(error)
    }
}
export const addFormat = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
    const { type, product, stock, price } = req.body
    let data: any = {}
    if(type === 'physical'){
        data.type = type
        data.price = price
        data.stock = stock
        data.product = product
    }else{
        if(Array.isArray(req.files)){
            const urls = await cloudinaryImageUploadMethod(req.files, process.env.PRODUCTFILEDOWNLOADFOLDER as string)
            data.downloadLink = urls[0]
            data.type = type
            data.price = price
            data.product = product
        } else{
            return res.status(400).json({
                message: 'no file uploaded'
            })
        }
    }
    // if format type exist already 

    const format = await addFormatToProduct(data, product)
    return res.status(200).json({
        status: true,
        format
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
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { productid, formatid } = req.body
        const format = await removeFormatFromProduct(productid, formatid)
        return res.status(200).json({
            status: true,
            format
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
export const IncreaseStockForPhysicalFormat = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { stock, productid, formatid } = req.body
        const data: any = {
            stock
        }
        const format = await updateStockInProduct(data, productid, formatid)
        return res.status(200).json({
            status: true,
            format
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
export const updatePriceFormat = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { price, productid, formatid } = req.body
        const data: any = {
            price
        }
        const format = await updateFormatPrice(data, productid, formatid)
        return res.status(200).json({
            status: true,
            format
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
export const newArrivalsProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const products = await newArrivals(page, limit)
        if(products) {
            return res.status(200).json({
                status: true,
                products
            })
        }
    } catch (error) {
        next(error)
    }
}
export const bestBooksByGenre = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const category = req.query.category as string
        const products = await bestBooksFromGenre(category, page, limit)
        if(products){
            return res.status(200).json({
                status: true,
                products
            })
        }
        
    } catch (error) {
        if(error instanceof Error){
            if(error.message === 'Category not found'){
                return res.status(200).json({
                    message: 'category does not exist'
                })
            } else{
                next(error)
            }
        }
    }
}
export const bestSellersProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const products = await bestSellers(page, limit)
        if(products){
            return res.status(200).json({
                status: true,
                products
            })
        }
    } catch (error) {
        next(error)
    }
}
export const recentlySoldBooks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const products = await recentlySold(page, limit)
        if(products){
            return res.status(200).json({
                status: true,
                products
            })
        }
    } catch (error) {
        next(error)
    }
}

export const addProductPreviewFile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const productid = req.query.productid
        if(Array.isArray(req.files) && req.files.length > 0){
            const urls = await cloudinaryImageUploadMethod(req.files, process.env.PRODUCTBOOKPREVIEWFOLDER as string)
            const preview = await addPreviewFile(urls[0] as string, productid as string)
            return res.status(200).json({
                message:'preview added',
                status: true
            })
        }
    } catch (error) {
        if(error instanceof Error){
            if(error.message === 'Product not found'){
                return res.status(404).json({
                    message: 'Product not found'
                })
            } else {
                next(error)
            }
        }
    }
    
}
export const updateCoverImages = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const productid = req.query.productid
        const user = req.user as DecodedToken
        const userid = user.id
        if(Array.isArray(req.files) && req.files.length > 0){
            const urls = await cloudinaryImageUploadMethod(req.files, process.env.PRODUCTBOOKPREVIEWFOLDER as string)
            const preview = await updateCoverImgs(urls as string[], productid as string, userid)
            return res.status(200).json({
                message:'cover images uploaded',
                status: true
            })
        }
    } catch (error) {
        if(error instanceof Error){
            if(error.message === 'Product not found'){
                return res.status(404).json({
                    message: 'Product not found'
                })
            } else {
                next(error)
            }
        }
    }
    
}
