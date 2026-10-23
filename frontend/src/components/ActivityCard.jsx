function ActivityCard() {
  const activities = [
    ["08:05", "Kitchen", "Normal"],
    ["10:32", "Living Room", "Normal"],
    ["12:45", "Kitchen", "Normal"],
    ["15:00", "No activity", "Attention"],
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Today's Activity</h3>
          <p className="text-sm text-slate-500">
            Recent activity events
          </p>
        </div>

        <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600">
          Today
        </span>
      </div>

      <div className="space-y-4">
        {activities.map(([time, location, status]) => (
          <div
            key={time}
            className="flex items-center justify-between border-b border-slate-100 pb-3"
          >
            <div className="flex items-center gap-4">
              <span className="w-14 text-sm font-medium text-slate-500">
                {time}
              </span>

              <div>
                <p className="font-medium">{location}</p>
                <p className="text-xs text-slate-400">
                  Activity detected
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                status === "Normal"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityCard;