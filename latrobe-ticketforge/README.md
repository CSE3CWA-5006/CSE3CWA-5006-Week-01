# La Trobe TicketForge

**La Trobe TicketForge** is a beginner-friendly full-stack CRUD project for teaching React, Express and SQLite. It simulates a university maintenance ticket system. Users create maintenance requests by choosing mostly dropdown options, entering their name, and writing a short reason.

The interface is designed as a modern ticket board inspired by tools such as Trello and Microsoft Teams.


## Important: all data is fake

> **This is a teaching demo. Every piece of data in this project is fictional.**
> The room names, asset names, requester names, ticket reasons and all sample
> records are **made up for learning purposes only**. They do not describe any
> real building, real equipment, real person, or real maintenance request at
> La Trobe University or anywhere else. Nothing here should be treated as real
> operational data.

## What each file does

| File / folder | What it is for |
| --- | --- |
| `server.js` | The **backend**. An Express web server that defines the API routes and talks to the SQLite database. |
| `src/main.jsx` | The **frontend**. The whole React app: the form, the ticket board, and the code that calls the API. |
| `src/style.css` | All the styling (colours, layout, cards) for the React app. |
| `index.html` | The single HTML page that React mounts into. Vite uses it as the entry point. |
| `package.json` | Lists the project's dependencies and the `npm` scripts (`dev`, `build`, `start`). |
| `package-lock.json` | Records the exact dependency versions npm installed. Do not edit by hand. |
| `dist/` | The built frontend (created by `npm run build`). The server serves these files in production. |
| `ticketforge.db` | The SQLite database file. Created automatically the first time the server runs. |
| `LICENSE` | The full AGPL-3.0 licence text. |
| `README.md` | This file. |


## Features

- Create a maintenance ticket
- View all tickets as modern dashboard cards
- Edit an existing ticket
- Delete a ticket
- Filter tickets by status
- Store all records in a local SQLite database
- Use dropdowns for most fields to keep the project simple for beginners

## Example ticket fields

- Room: Agora Level 1, Library Study Room 2.14, Computer Lab 5.17, etc.
- Asset: Air conditioner, Computer, Furniture, Fridge, Projector, Audio system, etc.
- Issue type: Not working, Damaged, Safety concern, Network issue, etc.
- Urgency: Low, Normal, High, Critical
- WBS / cost area: Teaching Support, Facilities Maintenance, IT Support, etc.
- Status: Submitted, In Review, Assigned, Waiting, Completed

## Technology stack

- React for the frontend UI
- Vite for the frontend development server and build process
- Express for the backend API
- SQLite through Node.js `node:sqlite`
- Node.js 24.15 or later

## Requirements

Install these before running the project:

- Node.js 24.15 or later
- npm

On Ubuntu, one option is:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

## Install and run

From the project folder:

```bash
npm install
npm run build
npm start
```

Open:

```text
http://127.0.0.1:3001
```

## Development mode

Development mode runs the Express server and the Vite frontend together:

```bash
npm install
npm run dev
```

Open the Vite URL, usually:

```text
http://127.0.0.1:5173
```

## API endpoints

```text
GET    /api/options       Read dropdown options
GET    /api/tickets       Read all tickets
POST   /api/tickets       Create a ticket
PUT    /api/tickets/:id   Update a ticket
DELETE /api/tickets/:id   Delete a ticket
```

## Database

The SQLite database file is created automatically as:

```text
ticketforge.db
```

The main table is:

```sql
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
);
```

## Teaching purpose

This project is intentionally simple. It is designed to help beginners understand the complete full-stack path:

```text
React form
↓
HTTP API request
↓
Express route
↓
SQLite database
↓
React ticket board
```

## Licence and copyright

La Trobe TicketForge  
Copyright (C) 2026 Dr Shuo Ding

This project is released under the **GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**. The complete licence text is in the `LICENSE` file.

You are free to use, study, modify and share this project. However, if you modify, distribute, publish, deploy or make this project available over a network, you must keep the original copyright notice, clearly state your changes, and release the complete corresponding source code under the same AGPL licence.

Every source file carries the same copyright header, and the running web page shows `Copyright © Dr Shuo Ding 2026` in small text at the bottom.

Reminder: all data in this project is fictional and for teaching only (see the note near the top of this file).
