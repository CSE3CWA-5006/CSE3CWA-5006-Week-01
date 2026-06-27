/*
La Trobe TicketForge
Copyright (C) 2026 Dr Shuo Ding

This file is part of La Trobe TicketForge.
La Trobe TicketForge is free software: you can redistribute it and/or modify it
under the terms of the GNU Affero General Public License as published by the
Free Software Foundation, either version 3 of the License, or any later version.

If you modify this project, distribute it, publish it, deploy it, or make it
available over a network, you must keep this copyright notice, state your
changes, and release the complete corresponding source code under the same
AGPL-3.0-or-later license.
*/

import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

const app = express();
const db = new DatabaseSync(path.join(__dirname, "ticketforge.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_name TEXT NOT NULL,
    room TEXT NOT NULL,
    asset TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    urgency TEXT NOT NULL,
    wbs TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Submitted',
    reason TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

app.use(cors());
app.use(express.json());

const validOptions = {
  room: ["Agora Level 1", "Library Study Room 2.14", "Engineering Lab 3.08", "Health Sciences Room 1.22", "Business School Room 4.03", "Computer Lab 5.17", "Lecture Theatre A", "Staff Kitchen B2"],
  asset: ["Air conditioner", "Computer", "Desk", "Chair", "Fridge", "Projector", "Audio system", "Printer", "Lighting", "Network port"],
  issue_type: ["Not working", "Damaged", "Too noisy", "Overheating", "Missing item", "Safety concern", "Cleaning required", "Network issue"],
  urgency: ["Low", "Normal", "High", "Critical"],
  wbs: ["Teaching Support", "Facilities Maintenance", "IT Support", "Research Lab", "Student Services", "General Operations"],
  status: ["Submitted", "In Review", "Assigned", "Waiting", "Completed"]
};

function cleanText(value) {
  return String(value || "").trim();
}

function validateTicket(body, partial = false) {
  const errors = [];
  const ticket = {
    requester_name: cleanText(body.requester_name),
    room: cleanText(body.room),
    asset: cleanText(body.asset),
    issue_type: cleanText(body.issue_type),
    urgency: cleanText(body.urgency),
    wbs: cleanText(body.wbs),
    status: cleanText(body.status || "Submitted"),
    reason: cleanText(body.reason)
  };

  if (!ticket.requester_name) errors.push("Requester name is required.");
  if (ticket.requester_name.length > 80) errors.push("Requester name is too long.");
  if (!ticket.reason) errors.push("Reason is required.");
  if (ticket.reason.length > 240) errors.push("Reason must be 240 characters or fewer.");

  for (const field of ["room", "asset", "issue_type", "urgency", "wbs", "status"]) {
    if (!validOptions[field].includes(ticket[field])) {
      errors.push(`${field} is invalid.`);
    }
  }

  return { ticket, errors };
}

app.get("/api/options", (_req, res) => {
  res.json(validOptions);
});

app.get("/api/tickets", (_req, res) => {
  const rows = db.prepare("SELECT * FROM tickets ORDER BY id DESC").all();
  res.json(rows);
});

app.post("/api/tickets", (req, res) => {
  const { ticket, errors } = validateTicket(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO tickets
      (requester_name, room, asset, issue_type, urgency, wbs, status, reason, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    ticket.requester_name,
    ticket.room,
    ticket.asset,
    ticket.issue_type,
    ticket.urgency,
    ticket.wbs,
    ticket.status,
    ticket.reason,
    now,
    now
  );

  const saved = db.prepare("SELECT * FROM tickets WHERE id = ?").get(Number(result.lastInsertRowid));
  res.status(201).json(saved);
});

app.put("/api/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ errors: ["Invalid ticket id."] });

  const existing = db.prepare("SELECT * FROM tickets WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ errors: ["Ticket not found."] });

  const { ticket, errors } = validateTicket(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE tickets
    SET requester_name = ?, room = ?, asset = ?, issue_type = ?, urgency = ?, wbs = ?, status = ?, reason = ?, updated_at = ?
    WHERE id = ?
  `).run(
    ticket.requester_name,
    ticket.room,
    ticket.asset,
    ticket.issue_type,
    ticket.urgency,
    ticket.wbs,
    ticket.status,
    ticket.reason,
    now,
    id
  );

  const updated = db.prepare("SELECT * FROM tickets WHERE id = ?").get(id);
  res.json(updated);
});

app.delete("/api/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ errors: ["Invalid ticket id."] });

  const result = db.prepare("DELETE FROM tickets WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ errors: ["Ticket not found."] });

  res.status(204).end();
});

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`La Trobe TicketForge running at http://127.0.0.1:${PORT}`);
});
