import express from 'express';
import 'dotenv/config';
import { connectDb } from './configs/database';
import config from './configs';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "./routes/routes";
import swaggerJson from "./configs/swagger.json"; 
import { errorHandle } from './middlewares/error.middleware';
import cors from 'cors';
const app = express();
const PORT = config.port;
const db = config.dbUrl;


const startServer = async() => {
    try {
        // Connect to MongoDB
        await connectDb({ db });
        console.log('MongoDB connected successfully');
        // Enable CORS for all origins
        app.use(cors());
        app.use(express.json());
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
        // Middleware to parse JSON bodies
        RegisterRoutes(app);
        app.use(errorHandle);
        // Start the Express server after a successful connection
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Facing error:', error);
        process.exit(1); // Exit the process if connection fails
    }
}

startServer();