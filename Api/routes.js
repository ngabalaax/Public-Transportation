import express from "express";
import prisma from "./lib/index.js";
import authenticate from "./middleware/authenticate.js";
import authenticateAdmin from "./middleware/adminAuth.js";

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
router.get('/:id', authenticate, async (req, res) => {
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

        res.json(route); authenticate
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the route.' });
    }
});

// Create a new route
router.post('/add', authenticateAdmin, async (req, res) => {
    try {
        const { name, adminId } = req.body;
        const route = await prisma.route.create({
            data: {
                name,
                adminId
            },
        });
        res.json(route);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating a new route.' });
    }
});

// update route
router.put('/update/:id', authenticateAdmin, async (req, res) => {
    try {
        
        const { name } = req.body;

        const updateRoute = await prisma.route.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                name
            }
        });
        if (!updateRoute) {
            return res.status(400).json({
                massage: "not be updeted route"
            });
        }

        res.json(updateRoute)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating a new route.' });
    }
});

// delete route
router.delete('/delete/:id', authenticateAdmin, async (req, res) => {
    try {
       
        const deleteRoute = await prisma.route.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!deleteRoute) {
            return res.status(404).json({
                message: "Route not found."
            });
        }

        res.status(202).json({ message: "Route successfully deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the route.' });
    }
});


export default router