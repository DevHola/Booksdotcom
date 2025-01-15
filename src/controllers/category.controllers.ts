import { Request, Response, NextFunction } from "express";
import { Categories, editCategory, getCategoryByID, getCategoryByName, NewCategory } from "../services/category.services";
import { validationResult } from "express-validator";

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { name } = req.body
        const category = await NewCategory(name as string)
        return res.status(200).json({
            status: true,
            category,
            message: 'category created'
        })
        
    } catch (error) {
        next(error)
    }   
}
export const editACategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
    const { name } = req.body
    const id = req.params.id
    await editCategory(id, name)  
    return res.status(200).json({
        status: true,
        message: 'category edited'
    })   
    } catch (error) {
        next(error)
    }  
} 
export const GetCategoryByName = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { name } = req.body
        const category = await getCategoryByName(name as string)
        return res.status(200).json({
            status: true,    
            category
        })
    } catch (error) {
        next(error)
    }
    
}
export const GetCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const id = req.params.id as string
        const category = await getCategoryByID(id)
        return res.status(200).json({
            status: true,
            category
        })
    } catch (error) {
        next(error)
    }
}
export const GetCategories = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const categories = await Categories()
        return res.status(200).json({
            status: true,
            categories
        })
    } catch (error) {
        next(error)
    }
}