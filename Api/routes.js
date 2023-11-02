import express from "express";
import prisma from "./lib/index.js";

const router = express.Router();

// Get all routes
router.get('/', async (req, res) => {
    try {
        const routes = await prisma.route.findMany();
        res.json(routes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the routes.' });
    }
});

// Get a route by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const route = await prisma.route.findUnique({
            where: { id }
        });

        if (!route) {
            return res.status(404).json({
                message: "Route not found."
            });
        }

        res.json(route);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the route.' });
    }
});

// Create a new route
router.post('/new', async (req, res) => {
    try {
        const { name } = req.body;
        const route = await prisma.route.create({
            data: {
                name,
            },
        });
        res.json(route);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating a new route.' });
    }
});

export default router