import mongoose from "mongoose";

export const connectdb = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://sujith017:kongu2024@cluster0.qhflh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

        console.log(`connected to db successfully  : ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error ${error.message}`);
        process.exit(1);
    }
}