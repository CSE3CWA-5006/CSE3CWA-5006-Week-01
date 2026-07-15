#!/usr/bin/env bash

# La Trobe TicketForge CRUD Demonstration
# Copyright (C) 2026 Dr Shuo Ding
# Licensed under AGPL-3.0-or-later

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3001}"
DB_FILE="${DB_FILE:-./ticketforge.db}"

separator() {
  echo
  echo "============================================================"
  echo "$1"
  echo "============================================================"
}

pause_demo() {
  echo
  read -r -p "Press Enter to continue to the next step..."
}

show_database() {
  echo
  echo "Current SQLite database contents:"
  sqlite3 -header -column "$DB_FILE" \
    "SELECT id,
            requester_name,
            room,
            asset,
            issue_type,
            urgency,
            wbs,
            status,
            reason,
            created_at,
            updated_at
     FROM tickets
     ORDER BY id;"
}

check_requirements() {
  command -v curl >/dev/null 2>&1 || {
    echo "Error: curl is not installed."
    exit 1
  }

  command -v sqlite3 >/dev/null 2>&1 || {
    echo "Error: sqlite3 is not installed."
    echo "Install it with: sudo apt update && sudo apt install sqlite3"
    exit 1
  }

  command -v python3 >/dev/null 2>&1 || {
    echo "Error: python3 is not installed."
    exit 1
  }

  if [[ ! -f "$DB_FILE" ]]; then
    echo "Error: database file not found: $DB_FILE"
    echo "Run this script from the backend project directory,"
    echo "or set DB_FILE to the correct path."
    exit 1
  fi

  if ! curl -fsS "$BASE_URL/api/tickets" >/dev/null; then
    echo "Error: TicketForge backend is not responding at:"
    echo "  $BASE_URL"
    echo
    echo "Start the backend first, for example:"
    echo "  npm run server"
    exit 1
  fi
}

pretty_json() {
  python3 -m json.tool
}

check_requirements

separator "TicketForge CRUD API Demonstration"

echo "API URL:      $BASE_URL"
echo "Database:     $DB_FILE"
echo
echo "This demonstration will perform:"
echo "1. READ current tickets"
echo "2. CREATE a ticket"
echo "3. READ the created ticket"
echo "4. UPDATE the ticket"
echo "5. DELETE the ticket"
echo "6. Confirm the final database state"

pause_demo

separator "STEP 1 - READ ALL TICKETS"

echo "Command:"
echo "curl -s $BASE_URL/api/tickets"
echo
echo "API response:"
curl -s "$BASE_URL/api/tickets" | pretty_json

show_database
pause_demo

separator "STEP 2 - CREATE A TICKET"

CREATE_JSON='{
  "requester_name": "Alice Chen",
  "room": "Computer Lab 5.17",
  "asset": "Computer",
  "issue_type": "Not working",
  "urgency": "High",
  "wbs": "IT Support",
  "status": "Submitted",
  "reason": "The computer does not start after pressing the power button."
}'

echo "Command:"
cat <<EOF
curl -s -X POST "$BASE_URL/api/tickets" \\
  -H "Content-Type: application/json" \\
  -d '$CREATE_JSON'
EOF

CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/tickets" \
  -H "Content-Type: application/json" \
  -d "$CREATE_JSON")

echo
echo "API response:"
printf '%s\n' "$CREATE_RESPONSE" | pretty_json

TICKET_ID=$(printf '%s' "$CREATE_RESPONSE" | python3 -c '
import json
import sys

data = json.load(sys.stdin)
ticket_id = data.get("id")

if not isinstance(ticket_id, int):
    raise SystemExit("The API response did not contain a valid ticket ID.")

print(ticket_id)
')

echo
echo "Created ticket ID: $TICKET_ID"

show_database
pause_demo

separator "STEP 3 - READ THE CREATED TICKET"

echo "Command:"
echo "curl -s $BASE_URL/api/tickets"
echo
echo "API response:"
curl -s "$BASE_URL/api/tickets" | pretty_json

echo
echo "The same record directly from SQLite:"
sqlite3 -header -column "$DB_FILE" \
  "SELECT * FROM tickets WHERE id = $TICKET_ID;"

pause_demo

separator "STEP 4 - UPDATE THE TICKET"

UPDATE_JSON='{
  "requester_name": "Alice Chen",
  "room": "Computer Lab 5.17",
  "asset": "Computer",
  "issue_type": "Not working",
  "urgency": "Normal",
  "wbs": "IT Support",
  "status": "Assigned",
  "reason": "The issue has been assigned to an IT technician."
}'

echo "Command:"
cat <<EOF
curl -s -X PUT "$BASE_URL/api/tickets/$TICKET_ID" \\
  -H "Content-Type: application/json" \\
  -d '$UPDATE_JSON'
EOF

echo
echo "API response:"
curl -s -X PUT "$BASE_URL/api/tickets/$TICKET_ID" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_JSON" | pretty_json

show_database
pause_demo

separator "STEP 5 - DELETE THE TICKET"

echo "Command:"
echo "curl -i -X DELETE $BASE_URL/api/tickets/$TICKET_ID"
echo
echo "API response headers:"
curl -i -X DELETE "$BASE_URL/api/tickets/$TICKET_ID"

show_database
pause_demo

separator "STEP 6 - FINAL VERIFICATION"

echo "Final API response:"
curl -s "$BASE_URL/api/tickets" | pretty_json

echo
echo "Check whether ticket ID $TICKET_ID still exists in SQLite:"
COUNT=$(sqlite3 "$DB_FILE" \
  "SELECT COUNT(*) FROM tickets WHERE id = $TICKET_ID;")

if [[ "$COUNT" == "0" ]]; then
  echo "PASS: Ticket ID $TICKET_ID was successfully deleted."
else
  echo "FAIL: Ticket ID $TICKET_ID still exists."
  exit 1
fi

separator "CRUD DEMONSTRATION COMPLETED SUCCESSFULLY"
