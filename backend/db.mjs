import mongoose from 'mongoose';
const url ="mongodb+srv://testuser:test101@ria.rjjy7.mongodb.net/RiceInspectionApp?retryWrites=true&w=majority&appName=RIA"

export const connectDB = async()=>{
    try{
        await mongoose.connect(url);
        console.log("Connected to DB")
    }catch(err){
        console.error("Can not connect to db : ",err.message)
        throw err;
    }
}