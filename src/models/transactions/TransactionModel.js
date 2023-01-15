import TransactionSchema from "./TransactionSchema.js"

export const postTransaction = (obj) => {
    return TransactionSchema(obj).save()
};


export const getAllTransactions = () => {
    return TransactionSchema.find()
}