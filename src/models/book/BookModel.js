import BookSchema from "./BookSchema.js";

// add book

export const addBook = (bookInfo) => {
  return BookSchema(bookInfo).save();
};

export const getBookByIsbn = (isbn) => {
  return BookSchema.findOne({isbn})
}

export const getAllBooks = () => {
  return BookSchema.find()
}