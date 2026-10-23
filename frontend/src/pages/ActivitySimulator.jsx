
import { useState } from "react";
import { analyzeAndSave } from "../services/api";

const API = import.meta.env.VITE_API_BASE_URL;

function ActivitySimulator() {
  const [residentId, setResidentId] = useState("resident_001");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function simulate(scenario) {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const sampleResponse = await fetch(
        `${API}/demo/sample/${scenario}`
      );

      if (!sampleResponse.ok) {
        throw new Error("Could not load a dataset example.");
      }

      const sample = await sampleResponse.json();

      const activity = {
        total_events: sample.total_events,
        unique_sensors: sample.unique_sensors,
        on_events: sample.on_events,
        off_events: sample.off_events,
        night_events: sample.night_events,
        active_hours: sample.active_hours,
        events_per_active_hour: sample.events_per_active_hour,
        is_weekend: sample.is_weekend,
      };

      const analysis = await analyzeAndSave(
        residentId.trim(),
        activity
      );

      setResult({
        ...analysis,
        scenario,
        sampleDate: sample.date,
        sampleHome: sample.home,
        expectedAnomaly: sample.is_anomaly,
      });
    } catch (err) {
      setError(err.message || "Simulation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Simulator</h1>
        <p className="mt-2 text-slate-500">
          Test the model using actual daily records from the CASAS dataset.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-900">
        These are historical dataset examples, not live sensor readings
        or real-time monitoring.
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <label className="mb-2 block text-sm font-medium">
          Resident ID
        </label>
        <input
          value={residentId}
          onChange={(e) => setResidentId(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            disabled={loading || !residentId.trim()}
            onClick={() => simulate("normal")}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Test Normal Example"}
          </button>

          <button
            disabled={loading || !residentId.trim()}
            onClick={() => simulate("anomaly")}
            className="rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Test Anomaly Example"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">
            Dataset: {result.sampleHome} · {result.sampleDate}
          </p>

          <h2 className="mt-2 text-xl font-bold">
            {result.is_anomaly
              ? "Unusual activity pattern flagged"
              : "No unusual pattern flagged"}
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            {result.ai_analysis?.explanation || result.message}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Events", result.activity.total_events],
              ["Sensors", result.activity.unique_sensors],
              ["Night events", result.activity.night_events],
              ["Active hours", result.activity.active_hours],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-bold">
                  {value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {result.ai_analysis?.suggested_action && (
            <div className="mt-5 rounded-xl bg-blue-50 p-4">
              <p className="font-semibold text-blue-900">
                Suggested follow-up
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-900">
                {result.ai_analysis.suggested_action}
              </p>
            </div>
          )}

          <p className="mt-4 text-xs text-slate-500">
            Dataset label: {String(result.expectedAnomaly)} ·
            Actual model result: {String(result.is_anomaly)}
          </p>
        </div>
      )}
    </div>
  );
}

export default ActivitySimulator;
