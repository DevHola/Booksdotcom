import mongoose from "mongoose";
const uri = process.env.MONGOURI as string
mongoose.connect(uri)
const db = mongoose.connection
db.on('open', () => {
    console.log('Connected')
})
db.on('error', () => {
    console.log('Connection failed')
})
export default db