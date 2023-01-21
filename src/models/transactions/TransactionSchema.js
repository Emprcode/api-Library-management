import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    borrowedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      userFname: { type: String },
      userLname: { type: String },
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
