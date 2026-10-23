import { useEffect, useState } from "react";
import { predictAnomaly } from "../services/api";
import {
  getDemoNormal,
  getDemoAnomaly
} from "../services/api";

export default function Dashboard() {
  const [activity, setActivity] = useState({
    total_events: 420,
    unique_sensors: 14,
    on_events: 210,
    off_events: 210,
    night_events: 4,
    active_hours: 13,
    events_per_active_hour: 32.3,
    is_weekend: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeActivity = async (data = activity) => {
    setLoading(true);

    try {
      const response = await predictAnomaly(data);
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeActivity();
  }, []);

  const simulateNormal = async () => {
    setLoading(true);

    try {
        const data = await getDemoNormal();

        setActivity(data.activity);
        setResult(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const simulateUnusual = async () => {
    setLoading(true);

    try {
        const data = await getDemoAnomaly();

        setActivity(data.activity);
        setResult(data);
    } catch (error) {
    console.error(error);
    } finally {
        setLoading(false);
    }
  };  
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          CareCircle AI
        </h1>

        <p className="text-slate-500">
          Intelligent home activity monitoring
        </p>
      </div>

      {/* Status */}
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <div className="h-3 w-3 rounded-full bg-green-500" />

        <div>
          <p className="font-semibold">System Active</p>
          <p className="text-sm text-slate-500">
            Monitoring resident activity
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Activity Events
          </p>

          <p className="mt-2 text-3xl font-bold">
            {activity.total_events}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Hours
          </p>

          <p className="mt-2 text-3xl font-bold">
            {activity.active_hours}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Night Events
          </p>

          <p className="mt-2 text-3xl font-bold">
            {activity.night_events}
          </p>
        </div>

      </div>

      {/* AI Analysis */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold">
          AI Behavioral Analysis
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Isolation Forest anomaly detection
        </p>

        {loading && (
          <p className="mt-5 text-blue-600">
            Analyzing activity...
          </p>
        )}

        {result && !loading && (
          <div className="mt-5">

            <div
              className={`rounded-xl p-5 ${
                result.is_anomaly
                  ? "bg-red-50"
                  : "bg-green-50"
              }`}
            >
              <h3
                className={`text-lg font-bold ${
                  result.is_anomaly
                    ? "text-red-700"
                    : "text-green-700"
                }`}
              >
                {result.is_anomaly
                  ? "⚠️ Unusual Activity Detected"
                  : "✓ Normal Activity Pattern"}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Anomaly Score: {result.anomaly_score}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {result.message}
              </p>
            </div>

          </div>
        )}

        {/* Demo buttons */}
        <div className="mt-6 flex gap-3">

          <button
            onClick={simulateNormal}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Simulate Normal
          </button>

          <button
            onClick={simulateUnusual}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Simulate Unusual
          </button>

        </div>

      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-slate-400">
        CareCircle AI provides experimental behavioral alerts and
        does not provide medical diagnosis or emergency detection.
      </p>

    </div>
  );
}