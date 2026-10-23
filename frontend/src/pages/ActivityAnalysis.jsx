
import { useState } from "react";
import { analyzeAndSave } from "../services/api";

const initialActivity = {
  total_events: 12,
  unique_sensors: 5,
  on_events: 7,
  off_events: 5,
  night_events: 4,
  active_hours: 3,
  events_per_active_hour: 4,
  is_weekend: 0,
};

function ActivityAnalysis() {
  const [residentId, setResidentId] = useState("resident_001");
  const [activity, setActivity] = useState(initialActivity);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setActivity((previous) => ({
      ...previous,
      [field]: Number(value),
    }));
  }

  async function handleAnalyze(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeAndSave(residentId.trim(), activity);
      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Could not analyze activity. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    ["total_events", "Total events"],
    ["unique_sensors", "Unique sensors"],
    ["on_events", "Sensor ON events"],
    ["off_events", "Sensor OFF events"],
    ["night_events", "Night-time events"],
    ["active_hours", "Active hours"],
    ["events_per_active_hour", "Events per active hour"],
    ["is_weekend", "Weekend (0 = No, 1 = Yes)"],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Analysis</h1>
        <p className="mt-2 text-slate-500">
          Analyze an activity observation and review a caregiver-friendly explanation.
        </p>
      </div>

      <form
        onSubmit={handleAnalyze}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <label className="mb-2 block text-sm font-medium">
          Resident ID
        </label>
        <input
          value={residentId}
          onChange={(event) => setResidentId(event.target.value)}
          required
          className="mb-6 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fields.map(([field, label]) => (
            <label key={field} className="block text-sm font-medium">
              {label}
              <input
                type="number"
                min="0"
                max={field === "is_weekend" ? 1 : undefined}
                step={field === "events_per_active_hour" ? "any" : "1"}
                required
                value={activity[field]}
                onChange={(event) => updateField(field, event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !residentId.trim()}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze and Save"}
        </button>

        <p className="mt-3 text-xs text-slate-500">
          Use actual dataset-derived values where possible. The prefilled values
          are illustrative and are not a resident's real activity.
        </p>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <section className="space-y-5">
          <div
            className={`rounded-2xl border p-6 ${
              result.is_anomaly
                ? "border-amber-200 bg-amber-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <p className="text-sm font-medium text-slate-600">
              Model result
            </p>
            <h2 className="mt-2 text-xl font-bold">
              {result.is_anomaly
                ? "Unusual activity pattern flagged"
                : "No unusual pattern flagged"}
            </h2>
            <p className="mt-3 leading-7">
              {result.ai_analysis?.explanation ||
                result.message ||
                "Analysis completed."}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Record ID: {result.id} · Resident: {result.resident_id}
            </p>
          </div>

          {result.ai_analysis && (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold">Activity observations</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
                  {result.ai_analysis.observations?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <h3 className="font-bold text-blue-900">
                  Suggested follow-up
                </h3>
                <p className="mt-2 leading-7 text-blue-900">
                  {result.ai_analysis.suggested_action}
                </p>
                <p className="mt-4 text-xs leading-5 text-blue-800">
                  {result.ai_analysis.disclaimer}
                </p>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default ActivityAnalysis;
