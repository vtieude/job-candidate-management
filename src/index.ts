import express from 'express';
import route from './routes/index';
import { connectDb } from './configs/database';
const app = express();
const PORT = process.env.PORT || 3000;
const db = "mongodb://localhost:27017/test";


const startServer = async() => {
    try {
        // Connect to MongoDB
        await connectDb({ db });

        console.log('MongoDB connected successfully');
        // Use the API routes
        app.use('/api', route);
        // Start the Express server after a successful connection
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if connection fails
    }
}

startServer();