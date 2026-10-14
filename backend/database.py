import sqlite3
import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "civicai.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Complaints Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        priority_score INTEGER NOT NULL,
        priority_level TEXT NOT NULL,
        priority_reason TEXT NOT NULL,
        safety_score INTEGER DEFAULT 0,
        affected_score INTEGER DEFAULT 0,
        recurrence_score INTEGER DEFAULT 0,
        waiting_score INTEGER DEFAULT 0,
        status TEXT NOT NULL,
        citizen_name TEXT NOT NULL,
        citizen_email TEXT,
        locality TEXT NOT NULL,
        ward TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        image_url TEXT,
        department TEXT NOT NULL,
        ai_summary TEXT,
        suggested_action TEXT,
        rejection_reason TEXT,
        duplicate_of TEXT,
        is_merged INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """)

    # Status History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS status_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        complaint_id TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        changed_by TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
    )
    """)

    # Duplicate Relationships
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS duplicate_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        primary_id TEXT NOT NULL,
        duplicate_id TEXT NOT NULL,
        similarity_score REAL NOT NULL,
        merged_at TEXT NOT NULL,
        merged_by TEXT NOT NULL,
        notes TEXT
    )
    """)

    conn.commit()
    conn.close()

def row_to_dict(row) -> Dict[str, Any]:
    if row is None:
        return None
    d = dict(row)
    return d

def get_all_complaints(
    category: Optional[str] = None,
    status: Optional[str] = None,
    priority_level: Optional[str] = None,
    ward: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM complaints WHERE 1=1"
    params = []

    if category and category != "All":
        query += " AND category = ?"
        params.append(category)

    if status and status != "All":
        query += " AND status = ?"
        params.append(status)

    if priority_level and priority_level != "All":
        query += " AND priority_level = ?"
        params.append(priority_level)

    if ward and ward != "All":
        query += " AND ward = ?"
        params.append(ward)

    if search:
        query += " AND (title LIKE ? OR description LIKE ? OR locality LIKE ? OR id LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])

    allowed_sort_columns = {
        "created_at": "created_at",
        "priority_score": "priority_score",
        "status": "status",
        "category": "category",
        "ward": "ward"
    }
    col = allowed_sort_columns.get(sort_by, "created_at")
    direction = "ASC" if sort_order.lower() == "asc" else "DESC"

    query += f" ORDER BY {col} {direction}"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

def get_complaint_by_id(complaint_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM complaints WHERE id = ?", (complaint_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
    complaint = row_to_dict(row)

    # Fetch status history
    cursor.execute("SELECT * FROM status_history WHERE complaint_id = ? ORDER BY timestamp ASC", (complaint_id,))
    history_rows = cursor.fetchall()
    complaint["history"] = [row_to_dict(h) for h in history_rows]

    # Fetch duplicates if primary
    cursor.execute("SELECT * FROM duplicate_links WHERE primary_id = ?", (complaint_id,))
    duplicates = [row_to_dict(d) for d in cursor.fetchall()]
    complaint["duplicates"] = duplicates

    conn.close()
    return complaint

def insert_complaint(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    now = datetime.now().isoformat()
    created_at = data.get("created_at", now)
    updated_at = data.get("updated_at", now)

    cursor.execute("""
    INSERT INTO complaints (
        id, title, description, category, priority_score, priority_level, priority_reason,
        safety_score, affected_score, recurrence_score, waiting_score,
        status, citizen_name, citizen_email, locality, ward, latitude, longitude,
        image_url, department, ai_summary, suggested_action, rejection_reason,
        duplicate_of, is_merged, created_at, updated_at
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?
    )
    """, (
        data["id"], data["title"], data["description"], data["category"],
        data["priority_score"], data["priority_level"], data["priority_reason"],
        data.get("safety_score", 0), data.get("affected_score", 0),
        data.get("recurrence_score", 0), data.get("waiting_score", 0),
        data.get("status", "Submitted"), data.get("citizen_name", "Citizen"),
        data.get("citizen_email", ""), data["locality"], data["ward"],
        data.get("latitude", 0.0), data.get("longitude", 0.0),
        data.get("image_url", ""), data.get("department", "Public Works"),
        data.get("ai_summary", ""), data.get("suggested_action", ""),
        data.get("rejection_reason", None), data.get("duplicate_of", None),
        data.get("is_merged", 0), created_at, updated_at
    ))

    # Initial history record
    cursor.execute("""
    INSERT INTO status_history (complaint_id, status, notes, changed_by, timestamp)
    VALUES (?, ?, ?, ?, ?)
    """, (
        data["id"],
        data.get("status", "Submitted"),
        "Complaint registered and categorized by CivicAI engine",
        data.get("citizen_name", "Citizen Contributor"),
        created_at
    ))

    conn.commit()
    conn.close()
    return get_complaint_by_id(data["id"])

def update_complaint_status(complaint_id: str, new_status: str, notes: Optional[str], changed_by: str, rejection_reason: Optional[str] = None, department: Optional[str] = None) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()

    updates = ["status = ?", "updated_at = ?"]
    params = [new_status, now]

    if rejection_reason is not None:
        updates.append("rejection_reason = ?")
        params.append(rejection_reason)
    if department is not None:
        updates.append("department = ?")
        params.append(department)

    params.append(complaint_id)
    cursor.execute(f"UPDATE complaints SET {', '.join(updates)} WHERE id = ?", params)

    note_text = notes or f"Status updated to {new_status}"
    if rejection_reason:
        note_text += f" | Reason: {rejection_reason}"

    cursor.execute("""
    INSERT INTO status_history (complaint_id, status, notes, changed_by, timestamp)
    VALUES (?, ?, ?, ?, ?)
    """, (complaint_id, new_status, note_text, changed_by, now))

    conn.commit()
    conn.close()
    return get_complaint_by_id(complaint_id)

def update_complaint_priority(complaint_id: str, priority_level: str, priority_score: int, override_reason: str, changed_by: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()

    cursor.execute("""
    UPDATE complaints 
    SET priority_level = ?, priority_score = ?, priority_reason = ?, updated_at = ?
    WHERE id = ?
    """, (priority_level, priority_score, f"[Manual Override by {changed_by}] {override_reason}", now, complaint_id))

    cursor.execute("""
    INSERT INTO status_history (complaint_id, status, notes, changed_by, timestamp)
    VALUES (?, (SELECT status FROM complaints WHERE id = ?), ?, ?, ?)
    """, (complaint_id, complaint_id, f"Priority score adjusted to {priority_score} ({priority_level}). Reason: {override_reason}", changed_by, now))

    conn.commit()
    conn.close()
    return get_complaint_by_id(complaint_id)

def merge_duplicates(primary_id: str, duplicate_ids: List[str], merged_by: str, notes: Optional[str] = None) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()

    for dup_id in duplicate_ids:
        if dup_id == primary_id:
            continue
        cursor.execute("""
        UPDATE complaints 
        SET duplicate_of = ?, is_merged = 1, status = 'Resolved', updated_at = ?,
            rejection_reason = ?
        WHERE id = ?
        """, (primary_id, now, f"Merged as duplicate into ticket #{primary_id}", dup_id))

        cursor.execute("""
        INSERT INTO duplicate_links (primary_id, duplicate_id, similarity_score, merged_at, merged_by, notes)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (primary_id, dup_id, 0.95, now, merged_by, notes or f"Merged into primary #{primary_id}"))

        cursor.execute("""
        INSERT INTO status_history (complaint_id, status, notes, changed_by, timestamp)
        VALUES (?, 'Resolved', ?, ?, ?)
        """, (dup_id, f"Linked and merged into primary complaint #{primary_id} by {merged_by}", merged_by, now))

    cursor.execute("""
    INSERT INTO status_history (complaint_id, status, notes, changed_by, timestamp)
    VALUES (?, (SELECT status FROM complaints WHERE id = ?), ?, ?, ?)
    """, (primary_id, primary_id, f"Combined {len(duplicate_ids)} duplicate complaints into this master ticket", merged_by, now))

    conn.commit()
    conn.close()
    return {"status": "success", "primary_id": primary_id, "merged_count": len(duplicate_ids)}
