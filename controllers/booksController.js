import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';  
import fsPromises from 'fs/promises';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const booksFilePath = path.join(__dirname, '..', 'model', 'books.json');

const data = {
  books: [],
  setBooks: function (newData) {
    this.books = newData;
  },
};

const loadBooks = async () => {
  try {
    const booksData = await fsPromises.readFile(booksFilePath, 'utf-8');
    data.books = JSON.parse(booksData);
  } catch (error) {
    console.error('Error reading books file:', error);
    data.books = []; 
  }
};


loadBooks();

export const getAllBooks = (req, res) => {

  if (!data.books) {
    return res.json([]);
  }
  res.json(data.books);
};

export const getBook = (req, res) => {
  if (!data.books) {
    return res.json({ message: 'No books available' });
  }

  const book = data.books.find((bk) => bk.id === parseInt(req.params.id));
  if (!book) {
    return res.json({ message: `Book ID ${req.params.id} not found!` });
  }
  res.json(book);
};

export const createNewBook = async (req, res) => {
  if (!data.books) {
    return res.json({ message: 'Books data is unavailable, please try again later.' });
  }

  const newBook = {
    id: data.books?.length ? data.books[data.books.length - 1].id + 1 : 1,
    title: req.body.title,
    author: req.body.author,
    no_of_pages: parseInt(req.body.bookPages),
    published_at: req.body.publishDate,
  };

  if (!newBook.title || !newBook.author || !newBook.no_of_pages || !newBook.published_at) {
    return res.json({ message: 'Please enter all required details!' });
  }

  data.setBooks([...data.books, newBook]);

  await fsPromises.writeFile(booksFilePath, JSON.stringify(data.books));
  res.status(201).json({ message: 'Book added!' });
};

export const updateBook = async (req, res) => {
  if (!data.books) {
    return res.json({ message: 'Books data is unavailable, please try again later.' });
  }

  const updatedBook = data.books.find((bk) => bk.id === parseInt(req.body.id));

  if (!updatedBook) {
    return res.json({ message: `Book ID ${req.body.id} not found` });
  }

  if (!req.body.title || !req.body.author || !req.body.no_of_pages || !req.body.published_at) {
    return res.json({ message: 'Please do not leave empty fields!' });
  }


  if (req.body.title) updatedBook.title = req.body.title;
  if (req.body.author) updatedBook.author = req.body.author;
  if (req.body.no_of_pages) updatedBook.no_of_pages = parseInt(req.body.no_of_pages);
  if (req.body.published_at) updatedBook.published_at = req.body.published_at;

  const filteredArray = data.books.filter((bk) => bk.id !== parseInt(req.body.id));
  const unsortedArray = [...filteredArray, updatedBook];

  data.setBooks(unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)));

  await fsPromises.writeFile(booksFilePath, JSON.stringify(data.books));
  res.json({ message: 'Book updated!' });
};

export const deleteBook = async (req, res) => {
  if (!data.books) {
    return res.json({ message: 'Books data is unavailable, please try again later.' });
  }

  const book = data.books.find((bk) => bk.id === parseInt(req.params.id));
  if (!book) {
    return res.json({ message: `Book ID ${req.params.id} not found` });
  }

  const filteredArray = data.books.filter((bk) => bk.id !== parseInt(req.params.id));
  data.setBooks([...filteredArray]);

  await fsPromises.writeFile(booksFilePath, JSON.stringify(data.books));
  res.json({ message: 'Book deleted!' });
};
