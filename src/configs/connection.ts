import mongoose from "mongoose";

const uri = process.env.MONGOURI as string;

const connection = async (uri: string) => {
    await mongoose.connect(uri, {
    }).then(() => {
      console.log('Connected to MongoDB');
    }).catch(err => {
      console.error('Connection to MongoDB failed', err);
    });
    
}

export default connection 
