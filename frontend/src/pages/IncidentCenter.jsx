
import { useEffect, useState } from "react";
import { getIncidents } from "../services/api";

export default function IncidentCenter() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadIncidents() {
    setLoading(true);
    setError("");

    try {
      const data = await getIncidents();
      setIncidents(data.incidents || []);
    } catch (err) {
      setError(err.message || "Could not load incidents.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Incident Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Activity records flagged for caregiver review
          </p>
        </div>

        <button
          onClick={loadIncidents}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-900">
          These are experimental model alerts, not confirmed emergencies
          or medical diagnoses. Review the activity and check on the
          resident when appropriate.
        </p>
      </div>

      {loading && (
        <p className="text-slate-500">Loading incident records...</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && incidents.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="font-semibold text-slate-800">
            No flagged records
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Records flagged by the model will appear here after they are saved.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {incidents.map((incident) => (
          <article
            key={incident.id}
            className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
                <span aria-hidden="true">⚠</span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap justify-between gap-2">
                  <h2 className="font-semibold text-slate-900">
                    Unusual activity pattern detected
                  </h2>
                  <span className="text-xs text-slate-500">
                    Record #{incident.id}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  Resident: {incident.resident_id}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {new Date(incident.timestamp).toLocaleString()}
                </p>

                <p className="mt-3 text-sm text-slate-700">
                  {incident.message ||
                    "Consider reviewing this activity pattern and checking on the resident."}
                </p>

                <div className="mt-4 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Model anomaly score
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {Number(incident.anomaly_score).toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
