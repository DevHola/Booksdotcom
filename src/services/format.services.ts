import productModel from "../models/product.model"

export const addFormatToProduct = async (data:any, id: string) => {
    const product = await productModel.findById(id)
    if(!product){
        throw new Error('product not found')
    }
    product.formats.push(data)
    return await product.save()
}
export const removeFormatFromProduct = async (productid: string, formatid: string) => {
    const product = await productModel.findById(productid)
    if(!product){
        throw new Error('product not found')
    }
    const format = product.formats.filter((formatdata)=> {
        formatdata._id != formatid
    })
    product.formats = format
    await product.save()
}
export const updateFormatInProduct = async (data:any, productid: string, formatid: string) => {
    // pending
    const product = await productModel.findById(productid)
    if(!product){
        throw new Error('product not found')
    }   
    const format = product.formats.filter((formatdata) => {
         formatdata._id == formatid
    })
    console.log(format)
    // if(format){
    //     format.fileSizeMB = data.weight
    // }
    await product.save()
}