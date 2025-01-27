import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '.env') })
import express, { type Application, type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import passport from 'passport'
import JWTStrategy, { GGstrategy } from './middlewares/passport'
import connection from './configs/connection'
import AuthRouter from './routes/auth.route'
import categoryRouter from './routes/category.route'
import productRouter from './routes/product.route'
import reviewRouter from './routes/review.route'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { seedcategory, seedproducts } from './models/seeders/seed'
import { options } from './configs/docs'
const app: Application = express()
app.use(cors({
  origin: "*"
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.disable('x-powered-by')
app.use(passport.initialize())
passport.use(JWTStrategy)
passport.use(GGstrategy)
app.use((error: Error, req: Request, res: Response, next: NextFunction): any => {
  const isProduction = process.env.NODE_ENV === 'production'
  return res.status(500).json({
    message: isProduction ? 'An error occured' : error.stack,
    ...(isProduction ? null : { stack: error.stack })
  })
})
app.use('/uploads',express.static(path.join(__dirname, '../', 'uploads')));
// console.log(path.join(__dirname, '../', 'uploads'));

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/review', reviewRouter)
const specs = swaggerJsdoc(options);
app.use(
  "/api/v1/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

const startApp = async (PORT: any) => {
  const uri: string = process.env.MONGOURI ?? ''
  if (!uri) {
    console.error('MONGOURI is not defined.');
    return;
  }
  void connection(uri)
  // await seedcategory()
  // await seedproducts()
  app.listen(PORT, () => {
    console.log(`Express is listening at http://localhost:${PORT}`)
  })
}
export default startApp
