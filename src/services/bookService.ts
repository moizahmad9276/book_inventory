import pool from '../utils/db';
import { Book } from '../models/book';
export const getAllBooks = async (): Promise<Book[]> => {
    const result = await pool.query('SELECT * FROM books');
    return result.rows;
};

export const getBookById = async (id: number): Promise<Book | null> => {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

export const createBook = async (book: Book): Promise<Book> => {
    const result = await pool.query(
        'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *',
        [book.title, book.author]
    );
    return result.rows[0];
};
export const updateBook = async (id: number, book: Book): Promise<Book | null> => {
    const result = await pool.query(
        'UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *',
        [book.title, book.author, id]
    );
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return null;
};

export const deleteBook = async (id: number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    return result.rows.length > 0; // Returns true if a row was deleted
};