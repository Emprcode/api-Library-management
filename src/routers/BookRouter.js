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
import { getTransactionByQuery, postTransaction, updateTransaction } from "../models/transactions/TransactionModel.js";
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
    

    const { isbn, thumbnail, title, author, year} = book
    const transactions = await postTransaction({
      borrowedBy:{
        userId: user._id,
        userFname: user.fName,
        userLname : user.lName
      },
      borrowedBook:{isbn, thumbnail, title, author, year}
    })

    if (transactions?._id) {
      const updateBook = await findBookAndUpdate(bookId, {
        borrowedBy: [...book.borrowedBy, user._id],
      });
      
    return  updateBook?._id
        ? res.json({
            status: "success",
            message: "you have borrowed this book",
            updateBook,
          })
        : res.json({
            status: "error",
            message: "something went wrong, please try again later",
          });
    }

    return res.json({
      status:"error",
      message:"unable to create transaction!"
    })

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

// book router

router.patch("/return", async (req, res, next) => {
  try {
    const book = await getBookById(req.body.bookId);
    const user = await getUserById(req.headers.authorization);

    const transaction = await getTransactionByQuery(user._id, user.isbn)

    console.log(transaction)

    const updateTrans = await updateTransaction(transaction?._id, { returnDate: new Date()})



    if (updateTrans?.returnDate) {
      const result = await findBookAndUpdate(book._id, {
        $pull: { borrowedBy: user._id },
      });

      result?._id
        ? res.json({
            status: "success",
            message: "You have returned this book",
          })
        : res.json({
            status: "error",
            message: "Unable to return this book, please try again later",
          });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
