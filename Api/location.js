import express, { json } from "express";
import prisma from "./lib/index.js";
import authenticate from "./middleware/authenticate.js";

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    // Retrieve the location data from the request body
    const { name, latitude, longitude, routeId } = req.body;

    // Validate the required fields
    if (!name || !latitude || !longitude || !routeId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the new location in the database

    const newLocation = await prisma.location.create({
      data: {
        name,
        latitude,
        longitude,
        routeId,
      },
    });

    // Return the created location as the response
    res.json(newLocation);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// update location 
router.put('/update/:id', authenticate, async (req, res) => {
  try {

    const { name, latitude, longitude, routeId } = req.body;

    const updateLocation = await prisma.location.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name,
        latitude,
        longitude,
        routeId
      }
    });
    if (!updateLocation) {
      return res.status(401).json({
        massage: "not updated location"
      });
    }
    // return the updated location as the response 
    res.json(updateLocation)
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// delete location 
router.delete('/dalete/:id', authenticate, async (req, res) => {
  try {

    const deletelocation = await prisma.location.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!deletelocation) {
      return res.status(404).json({
        massage: "has not deleted location"
      });
    }
    res, json({ message: "Bus deleted successfully." });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
})

export default router;