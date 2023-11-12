import express from 'express';
import prisma from '../lib/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import authenticate from '../middleware/authenticate.js';

const SECRET_KEY = process.env.SECRET_KEY;

const router = express.Router();

// Create a new admin
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingadmin = await prisma.admin.findUnique({
            where: {
                email: email,
            },
        });

        if (existingadmin) {
            return res.status(409).json({ message: "admin already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newadmin = await prisma.admin.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: "admin successfully created.",
            admin: newadmin,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to create admin." });
    }
});


// admins logins
router.post("/login", authenticate, async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingadmin = await prisma.admin.findUnique({
            where: {
                email: email,
            },
        });

        if (!existingadmin) {
            return res.status(404).json({ message: "admin not found." });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingadmin.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign(
            { id: existingadmin.id, email: existingadmin.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successful.", token: token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
});

export default router