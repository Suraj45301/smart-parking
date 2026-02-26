const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    slotNo: {
      type: Number,
      required: [true, "Slot number is required"],
      unique: true,
      min: [1, "Slot number must be positive"],
    },
    isCovered: {
      type: Boolean,
      required: true,
      default: false,
    },
    isEVCharging: {
      type: Boolean,
      required: true,
      default: false,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    vehicleParkedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);
