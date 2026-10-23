const menuItems = [
  { name: "Dashboard", icon: "⌂" },
  { name: "Activity", icon: "◷" },
  { name: "Incidents", icon: "⚠" },
  { name: "Resident", icon: "♙" },
  { name: "Settings", icon: "⚙" },
];

function Sidebar({ currentPage, setPage }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-blue-600">
          CareCircle
        </h1>
        <p className="text-sm text-slate-500">AI Care Platform</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setPage(item.name)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
              currentPage === item.name
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-700">
          CareCircle AI
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Cloud-native caregiving assistant
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;