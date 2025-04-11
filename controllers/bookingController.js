import asyncHandler from "express-async-handler";
import Booking from "../models/bookingModel.js";

// ✅ Create a new booking
export const createBooking = asyncHandler(async (req, res) => {
  const { pickupLocation, dropoffLocation, rideType, paymentMethod, driverName, fare } = req.body;

  const booking = new Booking({
    user: req.user._id,
    pickupLocation,
    dropoffLocation,
    rideType,
    paymentMethod,
    driverName,
    fare,
    paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
  });

  const savedBooking = await booking.save();
  res.status(201).json({ message: "Booking created", booking: savedBooking });
});

// ✅ Get all bookings (admin or self)
export const getBookings = asyncHandler(async (req, res) => {
  let bookings;

  if (req.user.role === "admin") {
    bookings = await Booking.find().sort({ createdAt: -1 }).populate("user", "name email");
  } else {
    bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  }

  res.status(200).json(bookings);
});

// ✅ Get bookings for current user only (used in /my-bookings)
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bookings);
});

// ✅ Cancel a booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (
    booking.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  booking.status = "cancelled";
  await booking.save();

  res.json({ message: "Booking cancelled successfully" });
});
