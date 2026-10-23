import RiskCard from "../components/RiskCard";
import ActivityCard from "../components/ActivityCard";
import IncidentCard from "../components/IncidentCard";

function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Good afternoon 👋</h1>
        <p className="mt-1 text-slate-500">
          Here's today's care overview for Mrs. Sharma.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Resident</p>
          <h2 className="mt-2 text-2xl font-bold">Mrs. Sharma</h2>
          <p className="mt-2 text-sm text-green-600">
            ● Monitoring active
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Today's Events</p>
          <h2 className="mt-2 text-3xl font-bold">24</h2>
          <p className="mt-2 text-sm text-slate-500">
            Activity events recorded
          </p>
        </div>

        <RiskCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityCard />
        <IncidentCard />
      </div>
    </div>
  );
}

export default Dashboard;