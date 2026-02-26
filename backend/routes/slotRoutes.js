const express = require("express");
const router = express.Router();
const {
  getAllSlots,
  addSlot,
  parkVehicle,
  removeVehicle,
  deleteSlot,
} = require("../controllers/slotController");

router.get("/", getAllSlots);
router.post("/", addSlot);
router.post("/park", parkVehicle);
router.put("/:id/remove", removeVehicle);
router.delete("/:id", deleteSlot);

module.exports = router;
