import productModel from "../models/product.model"

export const addFormatToProduct = async (data:any, id: string) => {
    const product = await productModel.findById(id)
    if(!product){
        throw new Error('product not found')
    }
    product.formats.push(data)
    return await product.save()
}
export const removeFormatFromProduct = async (productid: string, formatid: any) => {
    const product = await productModel.findById(productid)
    if(!product){
        throw new Error('product not found')
    }
    const format = await productModel.updateOne({_id: productid, 'formats._id': formatid}, {
        $pull: {
            formats: { _id: formatid }
        }
    })
}
export const updateFormatInProduct = async (data:any, productid: string, formatid: string) => {
    const product = await productModel.findById(productid)
    if(!product){
        throw new Error('product not found')
    }
    const format = await productModel.updateOne({'formats._id': formatid}, {
        $set: {
            "formats.$.stock": data.stock
        }
    }, { upsert: true })
}