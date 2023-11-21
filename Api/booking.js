import express from "express";
import prisma from "./lib/index.js";
import authenticate from "./middleware/authenticate.js";
import authenticateAdmin from "./middleware/adminAuth.js";

const router = express.Router();

// get booking seats 
router.get('/', authenticateAdmin, async (req, res) => {
    try {

        const bookings = await prisma.booking.findMany();

        if (!bookings) {
            return res.status(400).json({
                massage: "not get booking"
            });
        }

        // return 
        res.json(bookings)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating a new booking.' });
    }
})

// Create a new booking
router.post('/add', authenticate, async (req, res) => {
    try {
        const { userId, fullName, seatNumber, scheduleId } = req.body;

        // Check if the seat number is available for the given schedule
        const existingBooking = await prisma.booking.findFirst({
            where: {
                seatNumber,
                scheduleId,
            },
        });

        if (existingBooking) {
            return res.status(400).json({
                error: 'Seat number is already booked for the given schedule.',
            });
        }

        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                userId,
                fullName,
                seatNumber,
                scheduleId,
            },
        });

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating a new booking.' });
    }
});

// Update a booking
router.put('/update/:bookingId', authenticate, async (req, res) => {
    try {
        const { fullName, seatNumber, scheduleId } = req.body;
        // const { bookingId } = req.params;

        // Check if the booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!existingBooking) {
            return res.status(404).json({
                error: 'Booking not found.',
            });
        }

        // Update the booking
        const updatedBooking = await prisma.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                
                fullName,
                seatNumber,
                scheduleId,
            },
        });

        res.json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the booking.' });
    }
});

// Delete a booking
router.delete('/delete/:bookingId', authenticate, async (req, res) => {
    try {
        // Check if the booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!existingBooking) {
            return res.status(404).json({
                error: 'Booking not found.',
            });
        }

        // Delete the booking
        await prisma.booking.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        res.json({ message: 'Booking deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the booking.' });
    }
});

export default router