import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path: path.join(__dirname, '.env')})
const app: Application = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use((error:Error, req:Request, res:Response, next:NextFunction) => {
    const isProduction =  process.env.NODE_ENV === "production"
    res.status(500).json({
        message: isProduction ? "An error occured" : error.stack,
        ...(isProduction ? null : { stack: error.stack })
    })
})
export default app
