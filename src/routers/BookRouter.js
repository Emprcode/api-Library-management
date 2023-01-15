import express from "express";
import {
  addBook,
  deleteBook,
  findBookAndUpdate,
  getAllBooks,
  getBookById,
  getBookByIsbn,
  getBorrowedBooks,
} from "../models/book/BookModel.js";
import { getUserById } from "../models/users/UserModel.js";

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

//get books borrowed by user

router.get("/borrowedByUser", async (req, res, next) => {
  try {
    const result = await getBorrowedBooks(req.headers.authorization);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

// borrow a book

router.post("/borrow", async (req, res, next) => {
  try {
    const bookId = req.body.bookId;
    const { authorization } = req.headers;

    const book = await getBookById(bookId);
    const user = await getUserById(authorization);
    if (book?._id && user?._id) {
      if (book?.borrowedBy.length) {
        return res.json({
          status: "error",
          message:
            "The book has already been borrowed and will be available later",
        });
      }
    }
    const updateBook = await findBookAndUpdate(bookId, {
      borrowedBy: [...book.borrowedBy, user._id],
    });

    updateBook?._id
      ? res.json({
          status: "success",
          message: "you have borrowed this book",
          updateBook,
        })
      : res.json({
          status: "error",
          message: "something went wrong, please try again later",
        });
  } catch (error) {
    next(error);
  }
});

// delete book

router.delete("/", async (req, res, next) => {
  try {
    const result = await deleteBook(req.body.bookId);
    result?._id
      ? res.json({
          status: "success",
          message: "Book has been deleted successfully",
        })
      : res.json({
          status: "error",
          message: "unable to delete, please try again later",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
