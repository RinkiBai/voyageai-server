import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: "pending" }, // pending, completed, cancelled
});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
