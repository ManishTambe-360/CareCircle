
import { useEffect, useState } from "react";
import { getActivityHistory } from "../services/api";

export default function ActivityHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    setLoading(true);
    setError("");

    try {
      const data = await getActivityHistory();
      setRecords(data.records || []);
    } catch (err) {
      setError(err.message || "Could not load history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Activity History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Previously analyzed resident activity
          </p>
        </div>

        <button
          onClick={loadHistory}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-slate-500">Loading history...</p>}

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="font-semibold text-slate-800">
            No activity recorded yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Analyze and save an activity sample to see it here.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {records.map((record) => (
          <article
            key={record.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  {record.resident_id}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(record.timestamp).toLocaleString()}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  record.is_anomaly
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {record.is_anomaly ? "Unusual pattern" : "No anomaly flagged"}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              {record.message ||
                "Experimental behavioral analysis completed."}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric
                label="Activity events"
                value={record.activity?.total_events}
              />
              <Metric
                label="Active hours"
                value={record.activity?.active_hours}
              />
              <Metric
                label="Night events"
                value={record.activity?.night_events}
              />
              <Metric
                label="Anomaly score"
                value={
                  typeof record.anomaly_score === "number"
                    ? record.anomaly_score.toFixed(4)
                    : record.anomaly_score
                }
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">
        {value ?? "—"}
      </p>
    </div>
  );
}
