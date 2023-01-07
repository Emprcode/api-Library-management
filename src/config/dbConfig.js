import mongoose from "mongoose";

export const connectDB = async() => {
  try {
    if (!process.env.MONGO_URL) {
      return console.log(
        "mongoUrl is not defined, Please provide a connection stringh"
      );
    }
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.MONGO_URL);

    conn
      ? console.log("Mongo Connected")
      : console.log("Unable to connect mongo database");
  } catch (error) {
    console.log(error);
  }
};
