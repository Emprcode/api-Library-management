import TransactionSchema from "./TransactionSchema.js";

export const postTransaction = (obj) => {
  return TransactionSchema(obj).save();
};

export const getAllTransactions = () => {
  return TransactionSchema.find();
};

export const getAllTransactionByQuery = (userId, isbn) => {
  return TransactionSchema.find({
    "borrowedBy.userId": { $in: userId },
    "borrowedBy.isbn": { $in: isbn },
  });
};

export const updateTransaction = (_id, obj) => {
  return TransactionSchema.findByIdAndUpdate(_id, obj);
};
