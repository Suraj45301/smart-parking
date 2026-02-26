const Slot = require("../models/Slot");

// GET /api/slots — Get all slots
const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ slotNo: 1 });
    res.json({ success: true, data: slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/slots — Add a new parking slot
const addSlot = async (req, res) => {
  try {
    const { slotNo, isCovered, isEVCharging } = req.body;

    // Validate required fields
    if (slotNo === undefined || slotNo === null || slotNo === "") {
      return res.status(400).json({ success: false, message: "Slot number is required." });
    }

    const parsedSlotNo = Number(slotNo);
    if (isNaN(parsedSlotNo) || parsedSlotNo < 1 || !Number.isInteger(parsedSlotNo)) {
      return res.status(400).json({ success: false, message: "Slot number must be a positive integer." });
    }

    // Check for duplicate
    const existing = await Slot.findOne({ slotNo: parsedSlotNo });
    if (existing) {
      return res.status(409).json({ success: false, message: `Slot #${parsedSlotNo} already exists.` });
    }

    const slot = await Slot.create({
      slotNo: parsedSlotNo,
      isCovered: Boolean(isCovered),
      isEVCharging: Boolean(isEVCharging),
      isOccupied: false,
    });

    res.status(201).json({ success: true, data: slot, message: `Slot #${parsedSlotNo} added successfully.` });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Slot number must be unique." });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/slots/park — ParkVehicle(needsEV, needsCover)
const parkVehicle = async (req, res) => {
  try {
    const { needsEV, needsCover } = req.body;

    // Find all available slots matching the criteria, sorted by slotNo (nearest first)
    const query = {
      isOccupied: false,
      ...(needsEV ? { isEVCharging: true } : {}),
      ...(needsCover ? { isCovered: true } : {}),
    };

    const availableSlots = await Slot.find(query).sort({ slotNo: 1 });

    if (!availableSlots.length) {
      return res.status(404).json({
        success: false,
        message: "No slot available",
      });
    }

    // Allocate nearest (lowest slotNo) matching slot
    const nearestSlot = availableSlots[0];
    nearestSlot.isOccupied = true;
    nearestSlot.vehicleParkedAt = new Date();
    await nearestSlot.save();

    res.json({
      success: true,
      data: nearestSlot,
      message: `Vehicle parked at Slot #${nearestSlot.slotNo}.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/slots/:id/remove — Remove vehicle (free slot)
const removeVehicle = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found." });
    }

    if (!slot.isOccupied) {
      return res.status(400).json({ success: false, message: `Slot #${slot.slotNo} is already free.` });
    }

    slot.isOccupied = false;
    slot.vehicleParkedAt = null;
    await slot.save();

    res.json({ success: true, data: slot, message: `Vehicle removed from Slot #${slot.slotNo}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/slots/:id — Delete a slot entirely
const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found." });
    }
    if (slot.isOccupied) {
      return res.status(400).json({ success: false, message: `Cannot delete Slot #${slot.slotNo} while it is occupied.` });
    }
    await slot.deleteOne();
    res.json({ success: true, message: `Slot #${slot.slotNo} deleted.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllSlots, addSlot, parkVehicle, removeVehicle, deleteSlot };
