
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import ActivityHistory from "./pages/ActivityHistory";
import IncidentCenter from "./pages/IncidentCenter";
import ActivityAnalysis from "./pages/ActivityAnalysis";
import ActivitySimulator from "./pages/ActivitySimulator";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "history", label: "Activity History", icon: "◷" },
  { id: "incidents", label: "Incident Center", icon: "⚠" },
  { id: "analysis", label: "Activity Analysis", icon: "✳" },
  { id: "simulator", label: "Activity Simulator", icon: "↻" },
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  function renderPage() {
    switch (activePage) {
      case "history":
        return <ActivityHistory />;
      case "incidents":
        return <IncidentCenter />;
      case "analysis":
        return <ActivityAnalysis />;
      case "simulator":
        return <ActivitySimulator />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="border-b border-slate-200 bg-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold">CareCircle AI</h1>
              <p className="text-xs text-slate-500">
                Intelligent Care Support
              </p>
            </div>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activePage === item.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 hidden rounded-xl bg-blue-50 p-4 md:block">
          <p className="text-sm font-semibold text-blue-900">
            Caregiver support
          </p>
          <p className="mt-2 text-xs leading-5 text-blue-800">
            Review activity patterns and follow up on unusual changes when
            appropriate.
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Caregiver workspace</p>
            <p className="font-semibold">
              {navigation.find((item) => item.id === activePage)?.label}
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            API connected locally
          </span>
        </header>

        {renderPage()}

        <footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">
          CareCircle AI provides experimental activity-pattern alerts, not
          medical diagnoses or guaranteed emergency detection.
        </footer>
      </main>
    </div>
  );
}

export default App;
