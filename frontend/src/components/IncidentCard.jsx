function IncidentCard() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-red-600">
            AI Insight
          </p>

          <h3 className="mt-2 text-lg font-semibold">
            Unusual inactivity detected
          </h3>
        </div>

        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
          Medium Risk
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        Activity has been significantly lower than the resident's
        normal afternoon pattern. Consider checking on the resident.
      </p>

      <button className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
        View Incident
      </button>
    </div>
  );
}

export default IncidentCard;