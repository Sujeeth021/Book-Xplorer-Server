// models/Book.js
import mongoose from 'mongoose';

// Define the Book Schema
const BookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This will reference the User model
    required: true,
  },
  id: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  title: { type: String, required: true },
  authors: [String],
  description: String,
  addedAt: { type: Date, default: Date.now }, // Track when the book was added
});

const Book = mongoose.model('Book', BookSchema);

export default Book;
