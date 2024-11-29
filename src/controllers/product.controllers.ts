import { Request,Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { getProductById, getProductByIsbn, getProductByTitle, getProductsByAuthor, getProductsByCategory, getProductsByPublisher, newProduct } from "../services/product.services";
import { DecodedToken } from "../middlewares/passport";
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { title, description, Isbn, author, price, publisher, published_Date,noOfPages, coverImage, categoryid } = req.body
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