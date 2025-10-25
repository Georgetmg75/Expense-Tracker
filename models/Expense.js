import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
