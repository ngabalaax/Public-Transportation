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

// update a bus 
router.put('/update/:id', authenticate, async (req, res) => {
    try {
       
        const { number, capacity } = req.body;

        const updatebus = await prisma.bus.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                number,
                capacity
            },
        });
        if (!updatebus) {
            return res.status(403).json({
                message: "Failed to update a  bus."
            });
        }

        res.json(updatebus)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the bus.' });
    }
});

// Delete a bus
router.delete('/delete/:id', authenticate, async (req, res) => {
    try {
        //sconst { id } = req.params;

        const deletedBus = await prisma.bus.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!deletedBus) {
            return res.status(404).json({
                message: "Bus not found."
            });
        }

        res.json({ message: "Bus deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the bus.' });
    }
});

export default router