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
    if (!format) {
        throw new Error('Update failed');
    }
}
export const updateStockInProduct = async (data:any, productid: string, formatid: string) => {
    const product = await productModel.findById(productid)
    if(!product){
        throw new Error('product not found')
    }
    const format = await productModel.updateOne({_id: product._id, 'formats._id': formatid, 'formats.type': 'physical'}, {
        $inc: {
            "formats.$.stock": data.stock
        }
    }, { upsert: true })
    if(!format){
        throw new Error('Error updating price')
    }
}
export const updateFormatPrice = async (data:any, productid: string, formatid: string): Promise<any> => {
    const product = await productModel.findById(productid)
    if(!product){
        throw new Error('product not found')
    }
    const format = await productModel.updateOne({_id: product._id, 'formats._id': formatid}, {
        $set: {
            "formats.$.price": data.price
        }
    }, { upsert: true })
    if(!format){
        throw new Error('Error updating price')
    }
    return format
}
export const checkTypeExist = async (type: string, product: string): Promise<Boolean> => {
  const productdata =  await productModel.find({ _id: product, 'formats.$.type': type })
  if(productdata.length > 0){
    return true
  } else {
    return false
  }
  
}