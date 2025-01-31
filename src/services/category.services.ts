import CategoryModel, { ICategory } from "../models/category.model";
export const NewCategory = async (data: string) => {
        const category = await CategoryModel.create({name: data})
        await category.save()
}
export const editCategory = async (id: string, name: string) => {
     await CategoryModel.findOneAndUpdate( { _id: id }, { $set: { name: name }}, { upsert: true })
}
export const getCategoryByName = async (data: string): Promise<ICategory> => {
    const category = await CategoryModel.findOne({name: data})
    return category as ICategory
}
export const getCategoryByID = async (id: string): Promise<ICategory> => {
    const category = await CategoryModel.findById(id)
    return category as ICategory
}
export const Categories = async (page: number, limit: number): Promise<ICategory[]> => {
    const category = await CategoryModel.find().skip((page - 1) * limit).limit(limit)
    return category as ICategory[]
} 