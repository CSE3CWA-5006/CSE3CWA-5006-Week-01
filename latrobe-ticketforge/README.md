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


## Postman and Vs Code Install 


```bash
#!/usr/bin/env bash

set -e

echo "===================================="
echo " Installing Postman and VS Code"
echo " Ubuntu 22.04 / 24.04"
echo "===================================="

echo ""
echo "1. Updating system package list..."
sudo apt update

echo ""
echo "2. Installing required packages..."
sudo apt install -y \
  wget \
  curl \
  gpg \
  ca-certificates \
  software-properties-common \
  apt-transport-https

echo ""
echo "3. Installing Snap if not already installed..."
if ! command -v snap >/dev/null 2>&1; then
  sudo apt install -y snapd
else
  echo "Snap is already installed."
fi

echo ""
echo "4. Installing Postman..."
if snap list postman >/dev/null 2>&1; then
  echo "Postman is already installed."
else
  sudo snap install postman
fi

echo ""
echo "5. Installing Visual Studio Code..."

sudo mkdir -p /etc/apt/keyrings

wget -qO- https://packages.microsoft.com/keys/microsoft.asc \
  | gpg --dearmor \
  | sudo tee /etc/apt/keyrings/packages.microsoft.gpg > /dev/null

echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" \
  | sudo tee /etc/apt/sources.list.d/vscode.list > /dev/null

sudo apt update
sudo apt install -y code

echo ""
echo "6. Checking installed versions..."
echo "------------------------------------"

if command -v postman >/dev/null 2>&1; then
  echo "Postman installed."
else
  echo "Postman command not found, but it may still appear in the app menu."
fi

if command -v code >/dev/null 2>&1; then
  echo "VS Code:"
  code --version | head -n 1
else
  echo "VS Code was not found."
fi

echo ""
echo "Optional development tools status:"
echo "------------------------------------"

if command -v git >/dev/null 2>&1; then
  echo "Git: $(git --version)"
else
  echo "Git: not installed"
fi

if command -v node >/dev/null 2>&1; then
  echo "Node: $(node -v)"
else
  echo "Node: not installed"
fi

if command -v npm >/dev/null 2>&1; then
  echo "npm: $(npm -v)"
else
  echo "npm: not installed"
fi

if command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI: $(gh --version | head -n 1)"
else
  echo "GitHub CLI: not installed"
fi

echo ""
echo "===================================="
echo " Installation completed."
echo " You can start VS Code with: code"
echo " You can start Postman from the app menu."
echo "===================================="
```

## Licence and copyright

La Trobe TicketForge  
Copyright (C) 2026 Dr Shuo Ding

This project is released under the **GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**. The complete licence text is in the `LICENSE` file.

You are free to use, study, modify and share this project. However, if you modify, distribute, publish, deploy or make this project available over a network, you must keep the original copyright notice, clearly state your changes, and release the complete corresponding source code under the same AGPL licence.

Every source file carries the same copyright header, and the running web page shows `Copyright © Dr Shuo Ding 2026` in small text at the bottom.

Reminder: all data in this project is fictional and for teaching only (see the note near the top of this file).
