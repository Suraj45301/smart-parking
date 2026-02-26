import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { parkVehicle, removeVehicle } from "../api/slots";

export default function ParkVehiclePanel({ slots, onRefresh, onOutput }) {
  const [needsEV, setNeedsEV] = useState(false);
  const [needsCover, setNeedsCover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const occupiedSlots = slots.filter((s) => s.isOccupied).sort((a, b) => a.slotNo - b.slotNo);

  const handlePark = async () => {
    setLoading(true);
    try {
      const res = await parkVehicle({ needsEV, needsCover });
      onOutput({ type: "success", message: res.data.message, slot: res.data.data });
      toast.success(res.data.message);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to park vehicle.";
      onOutput({ type: "error", message: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (slot) => {
    setRemovingId(slot._id);
    try {
      const res = await removeVehicle(slot._id);
      onOutput({ type: "success", message: res.data.message });
      toast.success(res.data.message);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove vehicle.";
      onOutput({ type: "error", message: msg });
      toast.error(msg);
    } finally {
      setRemovingId(null);
    }
  };

  const freeCount = slots.filter((s) => !s.isOccupied).length;
  const matchingCount = slots.filter(
    (s) => !s.isOccupied &&
      (needsEV ? s.isEVCharging : true) &&
      (needsCover ? s.isCovered : true)
  ).length;

  return (
    <div>
      {/* Park Vehicle Section */}
      <div className="section-header">
        <h2 className="section-title">Park <span>Vehicle</span></h2>
      </div>

      <div className="card" style={{ marginBottom: 28 }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 20 }}>
          Select your requirements and the system will allocate the nearest available matching slot.
        </p>

        <div className="park-panel">
          {/* EV Option */}
          <div
            className={`park-option-card ${needsEV ? "selected-ev" : ""}`}
            onClick={() => setNeedsEV(!needsEV)}
          >
            <div className="park-option-icon">⚡</div>
            <div className="park-option-title">EV Charging</div>
            <div className="park-option-desc">Needs electric vehicle charging port</div>
            <div style={{ marginTop: 12 }}>
              {needsEV
                ? <span className="badge badge-ev">✓ Required</span>
                : <span className="badge" style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border-light)" }}>Optional</span>}
            </div>
          </div>

          {/* Cover Option */}
          <div
            className={`park-option-card ${needsCover ? "selected" : ""}`}
            onClick={() => setNeedsCover(!needsCover)}
          >
            <div className="park-option-icon">🏗</div>
            <div className="park-option-title">Covered Spot</div>
            <div className="park-option-desc">Needs sheltered / covered parking</div>
            <div style={{ marginTop: 12 }}>
              {needsCover
                ? <span className="badge badge-covered">✓ Required</span>
                : <span className="badge" style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border-light)" }}>Optional</span>}
            </div>
          </div>
        </div>

        {/* Match indicator */}
        <div style={{ margin: "16px 0", padding: "10px 14px", background: "var(--surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span>🅿 {freeCount} total free slots</span>
          <span style={{ color: "var(--border-light)" }}>|</span>
          <span style={{ color: matchingCount > 0 ? "var(--accent)" : "var(--danger)" }}>
            {matchingCount > 0 ? `✓ ${matchingCount} matching slot${matchingCount !== 1 ? "s" : ""} available` : "✗ No matching slots"}
          </span>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handlePark}
          disabled={loading || freeCount === 0}
        >
          {loading ? "Finding slot..." : "🚗 Park Vehicle (Allocate Nearest)"}
        </button>

        {freeCount === 0 && (
          <p style={{ textAlign: "center", marginTop: 10, fontSize: "0.82rem", color: "var(--danger)" }}>
            No slot available — all slots are currently occupied.
          </p>
        )}
      </div>

      {/* Remove Vehicle Section */}
      <div className="section-header">
        <h2 className="section-title">Remove <span>Vehicle</span></h2>
      </div>

      <div className="card">
        {occupiedSlots.length === 0 ? (
          <div className="empty-state" style={{ padding: "30px 20px" }}>
            <div className="empty-icon" style={{ fontSize: "2rem" }}>🚫</div>
            <div className="empty-title">No occupied slots</div>
            <div className="empty-sub">Park a vehicle first to see it here.</div>
          </div>
        ) : (
          <div className="occupied-slots-list">
            {occupiedSlots.map((slot) => (
              <div key={slot._id} className="occupied-slot-row">
                <div className="occupied-slot-info">
                  <span className="occupied-slot-no">#{slot.slotNo}</span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="badge badge-occupied">Occupied</span>
                    {slot.isCovered && <span className="badge badge-covered">🏗 Covered</span>}
                    {slot.isEVCharging && <span className="badge badge-ev">⚡ EV</span>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  {slot.vehicleParkedAt && (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
                      {new Date(slot.vehicleParkedAt).toLocaleTimeString()}
                    </span>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(slot)}
                    disabled={removingId === slot._id}
                  >
                    {removingId === slot._id ? "Removing..." : "🚪 Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
