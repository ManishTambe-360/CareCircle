function Resident() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Resident</h1>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Mrs. Sharma</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Monitoring</p>
            <p className="font-semibold text-green-600">Active</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Routine Profile</p>
            <p className="font-semibold">Configured</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Last Activity</p>
            <p className="font-semibold">12:45 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resident;