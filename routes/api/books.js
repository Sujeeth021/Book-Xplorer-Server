// routes/api/books.js
import express from 'express';
import Book from '../../model/Book.js';
import authenticateToken from './authMiddleware.js';  // Import middleware to verify JWT token

const router = express.Router();

// POST route to add a book (authenticated users only)
router.post('/', authenticateToken, async (req, res) => {
  const { id, thumbnailUrl, title, authors, description } = req.body;
  const userId = req.user.userId;  // Extract user ID from JWT token
  

  try {
    // Create a new book associated with the authenticated user
    const newBook = new Book({
      userId,
      id,
      thumbnailUrl,
      title,
      authors,
      description,
    });

    await newBook.save();  // Save to the database

    res.status(201).json({
      message: 'Book added successfully.',
      book: newBook,  // Send the newly created book as part of the response
    });
  } catch (error) {
    console.error('Error saving book:', error);
    console.error(error.stack);
    res.status(500).json({ message: `Failed to add book.` });
  }
});

// Route to get all books for a user (authenticated users only)
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;  
  console.log("User ID from JWT:", userId);

  try {
    const books = await Book.find({ userId }).sort({ addedAt: -1 }); 
    res.status(200).json(books);  // Send books as response
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books.' });
  }
});

// Route to get a specific book by its ID (authenticated users only)
router.get('/:bookId', authenticateToken, async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.userId;

  try {
    const book = await Book.findOne({ _id: bookId, userId });  // Ensure book is owned by the authenticated user
    if (!book) {
      return res.status(404).json({ message: 'Book not found or you do not have permission to view it.' });
    }

    res.status(200).json(book);  // Send the book as the response
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Failed to fetch book.' });
  }
});

// Route to delete a book by its ID (authenticated users only)
router.delete('/:bookId', authenticateToken, async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.userId;

  try {
    const book = await Book.findOneAndDelete({ _id: bookId, userId });  // Ensure book is owned by the authenticated user
    if (!book) {
      return res.status(404).json({ message: 'Book not found or you do not have permission to delete it.' });
    }

    res.status(200).json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book.' });
  }
});


export default router;
