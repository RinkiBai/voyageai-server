import Trip from "../models/tripModel.js"; // Ensure tripModel.js exists!
import asyncHandler from "express-async-handler";

// @desc Create a new trip
// @route POST /api/trips/create
// @access Private
export const createTrip = asyncHandler(async (req, res) => {
    const { pickup, dropoff, date, time, paymentMethod } = req.body;
    
    if (!pickup || !dropoff || !date || !time || !paymentMethod) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const trip = await Trip.create({
        user: req.user._id,
        pickup,
        dropoff,
        date,
        time,
        paymentMethod,
    });

    res.status(201).json(trip);
});

// @desc Get user's trips
// @route GET /api/trips
// @access Private
export const getUserTrips = asyncHandler(async (req, res) => {
    const trips = await Trip.find({ user: req.user._id });
    res.json(trips);
});
