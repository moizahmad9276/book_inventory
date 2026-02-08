import Fastify from 'fastify';
import * as dotenv from 'dotenv';
import bookRoutes from './routes/books';
import booksData from '../data.json'; 
import { createBook } from './services/bookService';

dotenv.config(); // Load .env file

const fastify = Fastify({
    logger: true // Enable logging
});

// Register routes
fastify.register(bookRoutes);

const seedDatabase = async () => {
    try {
        console.log('Seeding database with initial data...');

        for (const bookData of booksData) {
            try {
                await createBook(bookData);
                console.log(`Inserted book: ${bookData.title}`);
            } catch (error) {
                console.error(`Error inserting book ${bookData.title}:`, error);
            }
        }

        console.log('Database seeding completed.');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

// Start the server
const start = async () => {
    try {
        await fastify.listen({ port: parseInt(process.env.SERVER_PORT || '3000') });
        console.log(`Server listening on port ${process.env.SERVER_PORT}`);

        // Seed the database after the server starts listening
        await seedDatabase();
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();