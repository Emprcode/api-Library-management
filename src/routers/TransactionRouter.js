import express from 'express'
import { getAllTransactions } from '../models/transactions/TransactionModel.js'

const router = express.Router()

//get all transaction

router.get("/", async(req, res, next)=> {
    try {
        const transactions = await getAllTransactions()
        res.json(transactions)
    } catch (error) {
        next(error)
    }
})

export default router;