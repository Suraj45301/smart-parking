import React from "react";

const icons = { success: "✅", error: "❌", info: "ℹ️" };
const labels = { success: "Success", error: "Error", info: "Info" };

export default function OutputPanel({ output, onDismiss }) {
  if (!output) return null;
  const { type, message, slot } = output;

  return (
    <div className={`output-panel ${type}`}>
      <span className="output-icon">{icons[type]}</span>
      <div className="output-content">
        <div className="output-label">{labels[type]}</div>
        <div className="output-message">{message}</div>
        {slot && (
          <div className="output-slot-details">
            <span className="badge badge-free">Slot #{slot.slotNo}</span>
            {slot.isCovered && <span className="badge badge-covered">🏗 Covered</span>}
            {slot.isEVCharging && <span className="badge badge-ev">⚡ EV Charging</span>}
          </div>
        )}
      </div>
      <button className="output-dismiss" onClick={onDismiss} title="Dismiss">✕</button>
    </div>
  );
}
