import { FastifyInstance } from 'fastify';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../services/bookService';
import {Book} from "../models/book";
import {BookInput, bookJsonSchema} from "../schemas/bookSchema";


async function bookRoutes(fastify: FastifyInstance) {
    // Get all books
    fastify.get('/books', async (request, reply) => {
        try {
            const books = await getAllBooks();
            reply.send(books);
        } catch (error) {
            console.error(error);
            reply.status(500).send({ message: 'Error fetching books' });
        }
    });

    // Get a book by ID
    fastify.get<{ Params: { id: number } }>('/books/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const book = await getBookById(id);
            if (!book) {
                reply.status(404).send({ message: 'Book not found' });
                return;
            }
            reply.send(book);
        } catch (error) {
            console.error(error);
            reply.status(500).send({ message: 'Error fetching book' });
        }
    });

    // Create a new book
    fastify.post<{ Body: BookInput }>('/books', {schema: {body: bookJsonSchema}}, async (request, reply) => {

        try {
            const bookData = request.body;
            const book = await createBook(bookData);
            reply.status(201).send(book);
        } catch (error) {
            console.error(error);
            reply.status(500).send({ message: 'Error creating book' });
        }
    });

    // Update a book
    fastify.put<{ Params: { id: number }; Body: BookInput }>('/books/:id', {schema: {body: bookJsonSchema}}, async (request, reply) => {
        const { id } = request.params;

        try {
            const bookData = request.body;

            const book = await updateBook(id, bookData);
            if (!book) {
                reply.status(404).send({ message: 'Book not found' });
                return;
            }
            reply.send(book);
        } catch (error) {
            console.error(error);
            reply.status(500).send({ message: 'Error updating book' });
        }
    });

    // Delete a book
    fastify.delete<{ Params: { id: number } }>('/books/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const deleted = await deleteBook(id);
            if (!deleted) {
                reply.status(404).send({ message: 'Book not found' });
                return;
            }
            reply.status(204).send(); // 204 No Content for successful deletion
        } catch (error) {
            console.error(error);
            reply.status(500).send({ message: 'Error deleting book' });
        }
    });
}

export default bookRoutes;