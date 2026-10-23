function Activity() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Activity</h1>
      <p className="mt-1 text-slate-500">
        Detailed resident activity history.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-slate-500">
          Activity analytics will be connected to DynamoDB in a
          later phase.
        </p>
      </div>
    </div>
  );
}

export default Activity;