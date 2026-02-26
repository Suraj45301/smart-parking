import React from "react";

export default function StatsBar({ slots }) {
  const total = slots.length;
  const occupied = slots.filter((s) => s.isOccupied).length;
  const free = total - occupied;
  const ev = slots.filter((s) => s.isEVCharging).length;
  const covered = slots.filter((s) => s.isCovered).length;

  return (
    <div className="stats-bar">
      <div className="stat-chip total">
        <span className="dot" />
        {total} Total
      </div>
      <div className="stat-chip free">
        <span className="dot" />
        {free} Free
      </div>
      <div className="stat-chip occupied">
        <span className="dot" />
        {occupied} Occupied
      </div>
      <div className="stat-chip ev">
        <span className="dot" />
        {ev} EV
      </div>
      <div className="stat-chip covered">
        <span className="dot" />
        {covered} Covered
      </div>
    </div>
  );
}
