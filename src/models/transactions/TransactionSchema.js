import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    borrowedBook: {
      isbn: {
        type: String,
      },
      title: {
        type: String,
      },
      author: {
        type: String,
      },
      year: {
        type: Number,
      },
      thumbnail: {
        type: String,
      },
    },

    returnDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);
