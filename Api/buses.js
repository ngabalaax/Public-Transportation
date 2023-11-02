import express from "express";
import prisma from "./lib/index.js";
import authenticate from "./middleware/authenticate.js";

const router = express.Router();

// Get all buses
router.get('/', async (req, res) => {
    try {
        const buses = await prisma.bus.findMany();
        if (!buses) {
            return res.status(403).json({
                message: "Buses not found."
            });
        }
        res.json(buses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the buses.' });
    }
});
// Get a bus by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const bus = await prisma.bus.findUnique({
            where: { id }
        });

        if (!bus) {
            return res.status(404).json({
                message: "Bus not found."
            });
        }

        res.json(bus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the bus.' });
    }
});

// Create a new bus
router.post('/add', authenticate, async (req, res) => {
    try {
        const { number, capacity } = req.body;
        const bus = await prisma.bus.create({
            data: {
                number,
                capacity
            },
        });
        if (!bus) {
            return res.status(403).json({
                message: "Failed to create a new bus."
            });
        }
        res.json(bus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating a new bus.' });
    }
});

export default router