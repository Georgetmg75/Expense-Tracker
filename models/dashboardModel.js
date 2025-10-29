import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  date: String,
  note: String,
  amount: Number
}, { _id: false });

const categorySchema = new mongoose.Schema({
  budget: { type: Number, default: 0 },
  expenses: { type: [expenseSchema], default: [] }
}, { _id: false });

const dashboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalSalary: {
    type: Number,
    default: 0
  },
  budgetTables: {
    type: Map,
    of: categorySchema,
    default: {}
  }
}, { timestamps: true });

export default mongoose.model('Dashboard', dashboardSchema);
