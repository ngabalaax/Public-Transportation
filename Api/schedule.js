import express from "express";
import prisma from "./lib/index.js";

const router = express.Router();

// Get all schedules
router.get('/', async (req, res) => {
    const schedules = await prisma.schedule.findMany();
    if (schedules.length === 0) {
        return res.status(402).json({ massega: "not get schedules" })
    }
    res.json(schedules);
});

// get by id
//router.get('/schedules/:id', async (req, res) => {

// })

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const schedule = await prisma.schedule.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!schedule) {
            return res.status(404).json({ status: 404, message: "schedule not found" });
        }

        res.json(schedule);
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
});


// Create a new schedule
router.post('/new', async (req, res) => {
    try {
        const { busId, routeId, startTime, endTime} = req.body;
        const newschedule = await prisma.schedule.create({
            data: {
                busId,
                routeId,
                startTime,
                endTime
            },
        });
        if (!newschedule) {
            return res.status(400).json({ massega: "newschedule not created" })
        }
        res.json(newschedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the schedule.' });
    }
});

export default router