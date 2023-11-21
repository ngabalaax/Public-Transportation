import express from 'express';
import prisma from '../lib/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import authenticateAdmin from '../middleware/adminAuth.js';


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
router.post("/login", async (req, res) => {
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

// get admins
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const admins = await prisma.admin.findMany();
        if (!admins) {
            return res.status(404).json({
                massage: "not get admins"
            });
        }
        res.json(admins).status(202)
    } catch {
        return res.status(500).json({
            massage: "invalid sever error"
        });
    }
});

// get admins by id 
router.get('/:id', authenticateAdmin, async (req, res) => {
    try {
        const adminsId = await prisma.admin.findUnique();
        if (!adminsId) {
            return res.status(404).json({
                massage: "not get admin"
            });
        }

        res.json(adminsId).status(200)
    } catch {
        return res.status(500).json({
            massage: "invalid sever error"
        });
    }
});

// update admins 
router.put('/update/:id', authenticateAdmin, async (req, res) => {
    try {

        const { name, email } = req.body;

        const adminupdate = await prisma.admin.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name,
                email
            }
        });
        if (!adminupdate) {
            return res.status(401).json({
                massage: "not updated admins"
            });
        }

        res.json(adminupdate)
    } catch {
        return res.status(500).json({
            massage: "invalid sever error"
        });
    }
});

// delete location 
router.delete('/dalete/:id', authenticateAdmin, async (req, res) => {
    try {

        const admindelete = await prisma.admin.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!admindelete) {
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