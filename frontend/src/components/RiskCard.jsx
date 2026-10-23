function RiskCard() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-amber-700">
            Current Risk
          </p>

          <h3 className="mt-2 text-3xl font-bold text-amber-800">
            Medium
          </h3>
        </div>

        <div className="text-4xl">⚠️</div>
      </div>

      <p className="mt-4 text-sm text-amber-700">
        Unusual inactivity detected compared with the resident's
        normal routine.
      </p>
    </div>
  );
}

export default RiskCard;