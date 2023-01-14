import express from "express";
import {
  addBook,
  getAllBooks,
  getBookByIsbn,
} from "../models/book/BookModel.js";

const router = express.Router();

// add book

router.post("/", async (req, res, next) => {
  const { isbn } = req.body;
  try {
    const bookExist = await getBookByIsbn(isbn);

    if (bookExist?._id) {
      return res.json({
        status: "error",
        message: "Book already exist",
      });
    }
    const book = await addBook(req.body);

    book?._id
      ? res.json({
          status: "success",
          message: "Book added successfully",
        })
      : res.json({
          status: "error",
          messgae: "Unable to add book, please try again later",
        });
  } catch (error) {
    next(error);
  }
});

//get all books

router.get("/", async (req, res, next) => {
  try {
    const books = await getAllBooks();

    res.status(200).json({
      books,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
