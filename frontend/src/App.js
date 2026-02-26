import React, { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import AddSlotForm from "./components/AddSlotForm";
import SlotGrid from "./components/SlotGrid";
import ParkVehiclePanel from "./components/ParkVehiclePanel";
import OutputPanel from "./components/OutputPanel";
import StatsBar from "./components/StatsBar";
import { getAllSlots } from "./api/slots";
import "./App.css";

export default function App() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState(null); // { type: 'success'|'error'|'info', message, slot }
  const [activeTab, setActiveTab] = useState("slots"); // 'slots' | 'add' | 'park'

  const fetchSlots = useCallback(async () => {
    try {
      const res = await getAllSlots();
      if (res.data && Array.isArray(res.data.data)) {
        setSlots(res.data.data);
      } else {
        toast.error("Invalid API endpoint configured.");
        setSlots([]); // Fallback to empty array to prevent crash
      }
    } catch {
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const handleOutput = (result) => {
    setOutput(result);
  };

  return (
    <div className="app">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1a1a2e", color: "#e8e8f0", border: "1px solid #2a2a3a" } }} />

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🅿</span>
            <span>Park<strong>Smart</strong></span>
          </div>
          <p className="tagline">Intelligent Parking Management System</p>
        </div>
        <StatsBar slots={slots} />
      </header>

      {/* Tab Navigation */}
      <nav className="tab-nav">
        <button className={`tab-btn ${activeTab === "slots" ? "active" : ""}`} onClick={() => setActiveTab("slots")}>
          <span>🏢</span> View Slots
        </button>
        <button className={`tab-btn ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>
          <span>➕</span> Add Slot
        </button>
        <button className={`tab-btn ${activeTab === "park" ? "active" : ""}`} onClick={() => setActiveTab("park")}>
          <span>🚗</span> Park / Remove
        </button>
      </nav>

      {/* Main Content */}
      <main className="main">
        {/* Output Panel always visible at top of main */}
        {output && <OutputPanel output={output} onDismiss={() => setOutput(null)} />}

        {activeTab === "slots" && (
          <SlotGrid
            slots={slots}
            loading={loading}
            onRefresh={fetchSlots}
            onOutput={handleOutput}
            onSlotsChange={fetchSlots}
          />
        )}

        {activeTab === "add" && (
          <AddSlotForm
            onSuccess={(msg) => {
              fetchSlots();
              handleOutput({ type: "success", message: msg });
              toast.success(msg);
            }}
            onError={(msg) => {
              handleOutput({ type: "error", message: msg });
              toast.error(msg);
            }}
          />
        )}

        {activeTab === "park" && (
          <ParkVehiclePanel
            slots={slots}
            onRefresh={fetchSlots}
            onOutput={handleOutput}
          />
        )}
      </main>
    </div>
  );
}
