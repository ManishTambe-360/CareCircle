function Navbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="text-xl font-semibold">Caregiver Dashboard</h2>
        <p className="text-sm text-slate-500">
          Monitor your resident's daily activity
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 hover:bg-slate-100">
          🔔
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
            C
          </div>

          <div>
            <p className="text-sm font-semibold">Caregiver</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;