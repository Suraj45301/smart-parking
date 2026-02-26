import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { removeVehicle, deleteSlot } from "../api/slots";

const FILTERS = ["All", "Free", "Occupied", "EV", "Covered"];

export default function SlotGrid({ slots, loading, onRefresh, onOutput, onSlotsChange }) {
  const [filter, setFilter] = useState("All");

  const filtered = slots.filter((s) => {
    if (filter === "Free") return !s.isOccupied;
    if (filter === "Occupied") return s.isOccupied;
    if (filter === "EV") return s.isEVCharging;
    if (filter === "Covered") return s.isCovered;
    return true;
  });

  const handleRemove = async (slot) => {
    try {
      const res = await removeVehicle(slot._id);
      onOutput({ type: "success", message: res.data.message });
      toast.success(res.data.message);
      onSlotsChange();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove vehicle.";
      onOutput({ type: "error", message: msg });
      toast.error(msg);
    }
  };

  const handleDelete = async (slot) => {
    if (!window.confirm(`Delete Slot #${slot.slotNo}? This cannot be undone.`)) return;
    try {
      const res = await deleteSlot(slot._id);
      onOutput({ type: "info", message: res.data.message });
      toast.success(res.data.message);
      onSlotsChange();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete slot.";
      onOutput({ type: "error", message: msg });
      toast.error(msg);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">All Parking <span>Slots</span></h2>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh}>🔄 Refresh</button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ marginBottom: 16 }}>
        <span className="filter-label">Filter:</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
          {filtered.length} slot{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🅿</div>
          <div className="empty-title">
            {slots.length === 0 ? "No slots added yet" : `No ${filter.toLowerCase()} slots`}
          </div>
          <div className="empty-sub">
            {slots.length === 0
              ? "Go to 'Add Slot' to create your first parking slot."
              : "Try a different filter."}
          </div>
        </div>
      ) : (
        <div className="slot-grid">
          {filtered.map((slot) => (
            <div key={slot._id} className={`slot-card ${slot.isOccupied ? "occupied" : "free"}`}>
              <div className="slot-number">
                <span>#</span>{slot.slotNo}
              </div>

              <div className="slot-badges">
                {slot.isOccupied
                  ? <span className="badge badge-occupied">🔴 Occupied</span>
                  : <span className="badge badge-free">🟢 Free</span>}
                {slot.isCovered && <span className="badge badge-covered">🏗 Covered</span>}
                {slot.isEVCharging && <span className="badge badge-ev">⚡ EV</span>}
              </div>

              <div className="slot-status">
                <span className={`slot-status-dot ${slot.isOccupied ? "status-dot-occ" : "status-dot-free"}`} />
                {slot.isOccupied
                  ? slot.vehicleParkedAt
                    ? `Since ${new Date(slot.vehicleParkedAt).toLocaleTimeString()}`
                    : "Vehicle parked"
                  : "Available"}
              </div>

              <div className="slot-actions">
                {slot.isOccupied && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(slot)}
                  >
                    🚪 Remove
                  </button>
                )}
                {!slot.isOccupied && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDelete(slot)}
                    title="Delete slot"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
