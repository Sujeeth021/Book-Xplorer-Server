import express from 'express';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';

const PORT = process.env.PORT || 8082;
import { connectdb } from './db/db.js';

import booksRouter from './routes/api/books.js';
import authRouter from './routes/api/auth.js'; 
const app = express();
app.use(cors(corsOptions));
const corsOptions = {
    origin: 'https://stellar-centaur-000321.netlify.app', // Allow only your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust methods as needed
    credentials: true, // Set to true if using cookies or authentication
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.listen(PORT, () => {
  connectdb();
  console.log(`Server running on port ${PORT}`);
});
