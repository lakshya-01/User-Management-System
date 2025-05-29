import mongoose from "mongoose";

const uri = "mongodb+srv://lakshya:Ul2eLmbXAvXy1cHt@lakshyaapi.vzgvgki.mongodb.net/LakshyaAPI?retryWrites=true&w=majority&appName=LakshyaAPI";

const connectDB = (): void => {
  console.log("Connecting to MongoDB...");
  mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
      console.error("MongoDB connection error:", err.message);
      process.exit(1);
    });
};

export default connectDB;
