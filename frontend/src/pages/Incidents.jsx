function Incidents() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Incidents</h1>
      <p className="mt-1 text-slate-500">
        AI-detected behavioral anomalies.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="rounded-xl bg-amber-50 p-5">
          <p className="font-semibold text-amber-800">
            Unusual inactivity
          </p>

          <p className="mt-2 text-sm text-amber-700">
            Detected at 15:00. Anomaly score: 0.87.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Incidents;