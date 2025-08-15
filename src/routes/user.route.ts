import { Router } from "express";
import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import config from '../configs';
import jwt from 'jsonwebtoken';
import { comparePassword, generateToken } from "../utils/jwt";
import { jwtAuthMiddleware } from "../middlewares/auth";

const userRoute = Router();

userRoute.get('', jwtAuthMiddleware, async (req: Request, res: Response) => {
    try {
        const users =await userService.getAllUser();
        
        res.status(200).json({ users});
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Register route
userRoute.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
           return res.status(400).json({ message: "user already exist" });
        }
        const user = await  userService.createUser({ email, password });
        
        res.status(200).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});



// Login route
userRoute.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userService.findUserByEmail(email);
        if (!user || ! comparePassword(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken({ email: user.email, id: user._id as string});
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default userRoute;