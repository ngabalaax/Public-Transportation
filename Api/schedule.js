import express from "express";
import prisma from "./lib/index.js";
import authenticate from "./middleware/authenticate.js";
import authenticateAdmin from "./middleware/adminAuth.js";

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
router.get("/:id", authenticate, async (req, res) => {
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
router.post('/add', authenticateAdmin, async (req, res) => {
    try {
        const { adminId, busId, routeId, startTime, endTime} = req.body;
        const newschedule = await prisma.schedule.create({
            data: {
                adminId,
                busId,
                routeId,
                startTime,
                endTime,
                
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

// update schedules
router.put('/update/:id', authenticateAdmin, async (req, res) => {
    try {

        const { busId, routeId, startTime, endTime } = req.body;

        const updateScheddules = await prisma.schedule.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                busId,
                routeId,
                startTime,
                endTime
            }
        });
        if (!updateScheddules) {
            return res.status(403).json({
                massega: "not updated schedules"
            });
        }

        res.json(updateScheddules)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the schedule.' });
    }
});

// delete schedules
router.delete('/delete/:id', authenticateAdmin, async (req, res) => {
    try {

        const deleteSchedules = await prisma.schedule.delete({
            where: {
                id: Number(req.params.id),
            },
            
        });
        if (!deleteSchedules) {
            return res.status(403).json({
                massega: "not deleted schedules"
            });
        }

        res.status(202).json({ message: "schedule successfully deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the schedule.' });
    }
});

export default router