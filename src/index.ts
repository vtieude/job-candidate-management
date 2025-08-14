import express from 'express';
import route from './routes/index';
import 'dotenv/config';
import { connectDb } from './configs/database';
import config from './configs';
const app = express();
const PORT = config.port;
const db = config.dbUrl;


const startServer = async() => {
    try {
        console.log('hre is db', db);
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