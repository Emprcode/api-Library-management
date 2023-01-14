import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/dbConfig.js";
import morgan from "morgan";
import cors from "cors";
import UserRouter from "./src/routers/UserRouter.js";
import BookRouter from "./src/routers/BookRouter.js";
import { isAuth } from "./src/middlewares/authMiddleware.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

// connect mongoDB
connectDB();

// middleware

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// api route
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/book",isAuth, BookRouter)

app.use("*", (req, res, next) => {
  const error = {
    status: "error",
    message: "500 error occurred",
  };
  next(error);
});

// global error handlers
app.use((error, req, res, next) => {
  const statusCode = error.errroCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log("server crashed")
    : console.log(`Your server running at http://localhost:${PORT}`);
});
