import express from 'express';
import prisma from '../lib/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import authenticate from '../middleware/authenticate.js';

const SECRET_KEY = process.env.SECRET_KEY;

const router = express.Router();

// Create a new user
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existinguser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existinguser) {
            return res.status(409).json({ message: "user already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: "user successfully created.",
            user: newuser,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to create user." });
    }
});

// users logins

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existinguser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!existinguser) {
            return res.status(404).json({ message: "user not found." });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existinguser.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign(
            { id: existinguser.id, email: existinguser.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successful.", token: token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
});

export default router