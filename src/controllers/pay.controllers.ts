import {Paystack} from 'paystack-sdk';
const paystack = new Paystack(process.env.PAYSTACKSECRET as string);
import { Request, Response, NextFunction } from 'express';
import { IProductDefuse } from '../services/product.services';
import { UserByEmail } from '../services/auth.services';
export const payment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, total, trackingCode } = req.body
        const product = req.body.products as IProductDefuse
        const user = await UserByEmail(email)
        const orderdata : any = {
            id: user._id,
            amount: (total * 100).toString(),
            trackingCode,
            products: product
        }           
        const stringify = JSON.stringify(orderdata)
        const payment  = await paystack.transaction.initialize({
            email,
            amount: (total * 100).toString(),
            metadata: {
                custom_fields: [
                    {
                        display_name: "Order Details",
                        variable_name: "order_details",
                        value: stringify
                    }
                ]
            }
        })
        return res.status(200).json({
            payment
        })
    } catch (error) {
        next(error)
    }
}
export const verify = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const ref = req.query.ref as string
        const paymentdata = await paystack.transaction.verify(ref)
        if(paymentdata){
        const string: any = paymentdata.data
        const meta = JSON.parse(string.metadata.custom_fields[0].value)
        console.log(meta)
        return res.status(200).json({
            paymentdata
        })
        }
    } catch (error) {
        next(error)
    }
}