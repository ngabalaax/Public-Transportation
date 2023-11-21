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
            { expiresIn: "2h" }
        );

        return res.status(200).json({ message: "Login successful.", token: token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
});

// get users
router.get('/', authenticate, async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        if (!users) {
            return res.status(404).json({
                massage: "not get users"
            });
        }
        res.json(users).status(202)
    } catch {
        return res.status(500).json({
            massage: "invalid sever error"
        });
    }
});

// get users by id 
router.get('/:id', authenticate, async (req, res) => {
    try {
        const usersId = await prisma.user.findUnique();
        if (!usersId) {
            return res.status(404).json({
                massage: "not get user"
            });
        }

        res.json(usersId).status(200)
    } catch {
        return res.status(500).json({
            massage: "invalid sever error"
        });
    }
});

// update users 
router.put('/update/:id', authenticate, async (req, res) => {
    try {

        const { name, email } = req.body;

        const adminupdate = await prisma.user.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name,
                email
            }
        });
        if (!userupdate) {
            return res.status(401).json({
                massage: "not updated users"
            });
        }

        res.json(userupdate)
    } catch {
        return res.status(500).json({
            massage: "invalid sever error"
        });
    }
});

// delete location 
router.delete('/dalete/:id', authenticate, async (req, res) => {
    try {

        const userdelete = await prisma.user.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!userdelete) {
            return res.status(404).json({
                massage: "has not deleted location"
            });
        }
        res, json({ message: "Bus deleted successfully." });
    } catch (error) {
        console.error('Error creating location:', error);
        res.status(500).json({ error: 'Failed to create location' });
    }
});

export default router