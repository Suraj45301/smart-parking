# 🅿 ParkSmart — Smart Parking Lot System

A simple MERN stack project where vehicles are automatically assigned the nearest available parking slot based on requirements (EV charging / covered).

I made this project mainly to practice backend logic and API handling instead of just doing basic CRUD operations.

---

## Features

* Add parking slots (EV / Covered)
* View all slots in grid
* Auto‑park vehicle to nearest matching slot
* Remove vehicle from slot
* Delete free slot
* Live slot statistics (Total / Free / Occupied)

---

## Tech Stack

Frontend: React
Backend: Node.js + Express
Database: MongoDB

---

## How Parking Works

When parking a vehicle:

1. System checks free slots
2. Matches EV / Covered requirement
3. Picks lowest slot number (nearest)

If no match → "No slot available"

---

## Run Locally

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

---

## What I Learned

* API creation
* Backend logic building
* Connecting frontend with backend
* MongoDB data handling
