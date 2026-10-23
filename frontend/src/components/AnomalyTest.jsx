import { useState } from "react";
import { predictAnomaly } from "../services/api";

export default function AnomalyTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testActivity = async () => {
    setLoading(true);
    setError("");

    const activity = {
      total_events: 10,
      unique_sensors: 3,
      on_events: 5,
      off_events: 5,
      night_events: 0,
      active_hours: 2,
      events_per_active_hour: 5,
      is_weekend: 0,
    };

    try {
      const data = await predictAnomaly(activity);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold">
        AI Activity Analysis
      </h2>

      <p className="mb-4 text-sm text-gray-500">
        Test resident activity against the anomaly detection model.
      </p>

      <button
        onClick={testActivity}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Activity"}
      </button>

      {error && (
        <p className="mt-4 text-red-600">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="font-semibold">
            {result.is_anomaly
              ? "⚠️ Unusual Activity Detected"
              : "✅ No Unusual Activity Detected"}
          </p>

          <p className="mt-2 text-sm">
            Anomaly Score: {result.anomaly_score}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
}