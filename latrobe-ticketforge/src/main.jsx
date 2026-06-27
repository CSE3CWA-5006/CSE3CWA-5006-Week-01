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

import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_BASE = import.meta.env.DEV ? "http://127.0.0.1:3001" : "";

const fallbackOptions = {
  room: ["Agora Level 1", "Library Study Room 2.14", "Engineering Lab 3.08", "Health Sciences Room 1.22", "Business School Room 4.03", "Computer Lab 5.17", "Lecture Theatre A", "Staff Kitchen B2"],
  asset: ["Air conditioner", "Computer", "Desk", "Chair", "Fridge", "Projector", "Audio system", "Printer", "Lighting", "Network port"],
  issue_type: ["Not working", "Damaged", "Too noisy", "Overheating", "Missing item", "Safety concern", "Cleaning required", "Network issue"],
  urgency: ["Low", "Normal", "High", "Critical"],
  wbs: ["Teaching Support", "Facilities Maintenance", "IT Support", "Research Lab", "Student Services", "General Operations"],
  status: ["Submitted", "In Review", "Assigned", "Waiting", "Completed"]
};

const emptyForm = {
  requester_name: "",
  room: fallbackOptions.room[0],
  asset: fallbackOptions.asset[0],
  issue_type: fallbackOptions.issue_type[0],
  urgency: fallbackOptions.urgency[1],
  wbs: fallbackOptions.wbs[0],
  status: fallbackOptions.status[0],
  reason: ""
};

function statusClass(value) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function App() {
  const [options, setOptions] = useState(fallbackOptions);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  async function loadOptions() {
    const response = await fetch(`${API_BASE}/api/options`);
    const data = await response.json();
    setOptions(data);
  }

  async function loadTickets() {
    const response = await fetch(`${API_BASE}/api/tickets`);
    const data = await response.json();
    setTickets(data);
  }

  useEffect(() => {
    loadOptions().catch(() => setOptions(fallbackOptions));
    loadTickets().catch(() => setErrors(["Could not load tickets from the server."]));
  }, []);

  const visibleTickets = useMemo(() => {
    if (filter === "All") return tickets;
    return tickets.filter((ticket) => ticket.status === filter);
  }, [filter, tickets]);

  const summary = useMemo(() => {
    return {
      total: tickets.length,
      critical: tickets.filter((ticket) => ticket.urgency === "Critical").length,
      completed: tickets.filter((ticket) => ticket.status === "Completed").length
    };
  }, [tickets]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setErrors([]);
    setMessage("");
  }

  function startEdit(ticket) {
    setForm({
      requester_name: ticket.requester_name,
      room: ticket.room,
      asset: ticket.asset,
      issue_type: ticket.issue_type,
      urgency: ticket.urgency,
      wbs: ticket.wbs,
      status: ticket.status,
      reason: ticket.reason
    });
    setEditingId(ticket.id);
    setErrors([]);
    setMessage(`Editing ticket #${ticket.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitTicket(event) {
    event.preventDefault();
    setErrors([]);
    setMessage("");

    const url = editingId ? `${API_BASE}/api/tickets/${editingId}` : `${API_BASE}/api/tickets`;
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const data = await response.json();
      setErrors(data.errors || ["Something went wrong."]);
      return;
    }

    await loadTickets();
    setMessage(editingId ? "Ticket updated successfully." : "Ticket submitted successfully.");
    setForm(emptyForm);
    setEditingId(null);
  }

  async function deleteTicket(id) {
    const confirmed = window.confirm(`Delete ticket #${id}?`);
    if (!confirmed) return;

    const response = await fetch(`${API_BASE}/api/tickets/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setErrors(data.errors || ["Could not delete ticket."]);
      return;
    }

    await loadTickets();
    setMessage(`Ticket #${id} deleted.`);
  }

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">La Trobe Uni maintenance workflow demo</p>
          <h1>La Trobe TicketForge</h1>
          <p className="hero-text">
            A simple React, Express and SQLite CRUD website for generating and tracking
            maintenance tickets with dropdown-based inputs.
          </p>
        </div>
        <div className="hero-card">
          <span>Total Tickets</span>
          <strong>{summary.total}</strong>
          <small>{summary.critical} critical · {summary.completed} completed</small>
        </div>
      </header>

      <section className="layout">
        <form className="ticket-form" onSubmit={submitTicket}>
          <div className="form-title">
            <div>
              <p className="eyebrow">Request form</p>
              <h2>{editingId ? `Edit Ticket #${editingId}` : "Create a Ticket"}</h2>
            </div>
            {editingId && <button className="ghost" type="button" onClick={resetForm}>Cancel edit</button>}
          </div>

          {errors.length > 0 && (
            <div className="alert error">
              {errors.map((error) => <p key={error}>{error}</p>)}
            </div>
          )}
          {message && <div className="alert success">{message}</div>}

          <label>
            Your name
            <input value={form.requester_name} onChange={(event) => updateField("requester_name", event.target.value)} placeholder="e.g. Alex Chen" />
          </label>

          <div className="grid-two">
            <Select label="Room" value={form.room} options={options.room} onChange={(value) => updateField("room", value)} />
            <Select label="Asset" value={form.asset} options={options.asset} onChange={(value) => updateField("asset", value)} />
            <Select label="Issue type" value={form.issue_type} options={options.issue_type} onChange={(value) => updateField("issue_type", value)} />
            <Select label="Urgency" value={form.urgency} options={options.urgency} onChange={(value) => updateField("urgency", value)} />
            <Select label="WBS / Cost area" value={form.wbs} options={options.wbs} onChange={(value) => updateField("wbs", value)} />
            <Select label="Status" value={form.status} options={options.status} onChange={(value) => updateField("status", value)} />
          </div>

          <label>
            Reason
            <textarea value={form.reason} onChange={(event) => updateField("reason", event.target.value)} placeholder="Briefly explain the issue" maxLength="240" />
          </label>

          <button className="primary" type="submit">{editingId ? "Update Ticket" : "Submit Ticket"}</button>
        </form>

        <section className="board">
          <div className="board-top">
            <div>
              <p className="eyebrow">Ticket board</p>
              <h2>Maintenance Requests</h2>
            </div>
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option>All</option>
              {options.status.map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>

          <div className="cards">
            {visibleTickets.map((ticket) => (
              <article className="ticket-card" key={ticket.id}>
                <div className="card-head">
                  <span className="ticket-id">#{ticket.id}</span>
                  <span className={`badge ${statusClass(ticket.status)}`}>{ticket.status}</span>
                </div>
                <h3>{ticket.asset}</h3>
                <p className="issue">{ticket.issue_type} · {ticket.room}</p>
                <p className="reason">{ticket.reason}</p>
                <div className="meta-row">
                  <span>By {ticket.requester_name}</span>
                  <span>{ticket.urgency}</span>
                </div>
                <div className="meta-row muted">
                  <span>{ticket.wbs}</span>
                  <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
                <div className="actions">
                  <button type="button" onClick={() => startEdit(ticket)}>Edit</button>
                  <button className="danger" type="button" onClick={() => deleteTicket(ticket.id)}>Delete</button>
                </div>
              </article>
            ))}
            {visibleTickets.length === 0 && <p className="empty">No tickets found. Submit a new request to begin.</p>}
          </div>
        </section>
      </section>

      <footer>
        Copyright © Dr Shuo Ding 2026 · Released under AGPL-3.0-or-later
      </footer>
    </main>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

createRoot(document.getElementById("root")).render(<App />);
