
import sqlite3
import json
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).resolve().parents[2]
DB_PATH = ROOT_DIR / "backend" / "carecircle.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS activity_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resident_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                is_anomaly INTEGER NOT NULL,
                anomaly_score REAL NOT NULL,
                message TEXT,
                activity_json TEXT NOT NULL
            )
        """)
        conn.commit()


def save_analysis(resident_id, activity, prediction):
    timestamp = datetime.now(timezone.utc).isoformat()

    with get_connection() as conn:
        cursor = conn.execute("""
            INSERT INTO activity_history (
                resident_id, timestamp, is_anomaly,
                anomaly_score, message, activity_json
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            resident_id,
            timestamp,
            int(prediction["is_anomaly"]),
            float(prediction["anomaly_score"]),
            prediction.get("message", ""),
            json.dumps(activity)
        ))
        conn.commit()
        record_id = cursor.lastrowid

    return {
        "id": record_id,
        "resident_id": resident_id,
        "timestamp": timestamp,
        "is_anomaly": bool(prediction["is_anomaly"]),
        "anomaly_score": float(prediction["anomaly_score"]),
        "message": prediction.get("message", ""),
        "activity": activity
    }


def get_history(limit=50):
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT * FROM activity_history
            ORDER BY id DESC
            LIMIT ?
        """, (limit,)).fetchall()

    results = []

    for row in rows:
        results.append({
            "id": row["id"],
            "resident_id": row["resident_id"],
            "timestamp": row["timestamp"],
            "is_anomaly": bool(row["is_anomaly"]),
            "anomaly_score": row["anomaly_score"],
            "message": row["message"],
            "activity": json.loads(row["activity_json"])
        })

    return results


def get_incidents(limit=50):
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT * FROM activity_history
            WHERE is_anomaly = 1
            ORDER BY id DESC
            LIMIT ?
        """, (limit,)).fetchall()

    return [
        {
            "id": row["id"],
            "resident_id": row["resident_id"],
            "timestamp": row["timestamp"],
            "is_anomaly": True,
            "anomaly_score": row["anomaly_score"],
            "message": row["message"],
            "activity": json.loads(row["activity_json"])
        }
        for row in rows
    ]


initialize_database()

