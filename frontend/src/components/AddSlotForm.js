import React, { useState } from "react";
import { addSlot } from "../api/slots";

export default function AddSlotForm({ onSuccess, onError }) {
  const [slotNo, setSlotNo] = useState("");
  const [isCovered, setIsCovered] = useState(false);
  const [isEVCharging, setIsEVCharging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slotNo || slotNo.toString().trim() === "") {
      onError("Slot number is required.");
      return;
    }

    const parsed = Number(slotNo);
    if (isNaN(parsed) || parsed < 1 || !Number.isInteger(parsed)) {
      onError("Slot number must be a positive integer.");
      return;
    }

    setLoading(true);
    try {
      const res = await addSlot({ slotNo: parsed, isCovered, isEVCharging });
      onSuccess(res.data.message);
      setSlotNo("");
      setIsCovered(false);
      setIsEVCharging(false);
    } catch (err) {
      onError(err.response?.data?.message || "Failed to add slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Add Parking <span>Slot</span></h2>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Slot Number */}
            <div className="form-group full">
              <label className="form-label">Slot Number *</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 101"
                value={slotNo}
                onChange={(e) => setSlotNo(e.target.value)}
                min={1}
                step={1}
              />
            </div>

            {/* Covered Toggle */}
            <div className="form-group">
              <label className="form-label">Covered Parking</label>
              <div className="toggle-group">
                <div>
                  <div className="toggle-label-text">🏗 Covered</div>
                  <div className="toggle-label-sub">Sheltered from weather</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={isCovered}
                    onChange={(e) => setIsCovered(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {/* EV Toggle */}
            <div className="form-group">
              <label className="form-label">EV Charging</label>
              <div className="toggle-group">
                <div>
                  <div className="toggle-label-text">⚡ EV Charging</div>
                  <div className="toggle-label-sub">Electric vehicle support</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={isEVCharging}
                    onChange={(e) => setIsEVCharging(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="form-group full">
              <label className="form-label">Preview</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 14px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border-light)" }}>
                <span style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
                  {slotNo ? `#${slotNo}` : "#—"}
                </span>
                <span className="badge badge-free">Free</span>
                {isCovered && <span className="badge badge-covered">🏗 Covered</span>}
                {isEVCharging && <span className="badge badge-ev">⚡ EV</span>}
              </div>
            </div>

            <div className="form-group full">
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? "Adding..." : "➕ Add Slot"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
