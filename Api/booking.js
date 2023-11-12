import express from "express";
import prisma from "./lib/index.js";


const router = express.Router();

// Create a new booking
router.post('/add', async (req, res) => {
    try {
        const { userId, seatnumber, scheduleId } = req.body;
        const route = await prisma.booking.create({
            data: {
                userId,
                seatnumber,
                scheduleId
            },
        });
        res.json(route);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating a new booking.' });
    }
});

export default router