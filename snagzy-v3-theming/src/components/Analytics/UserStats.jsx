import { useMemo, useState } from "react";
import { useData } from "../../context/DataContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const UserStats = () => {
  const [timelineView, setTimelineView] = useState("monthly");

  const { getAllUsers, getAllItemStatus, getAllStores } = useData();

  const users = getAllUsers();
  const itemStatus = getAllItemStatus();
  const stores = getAllStores();

  const stats = useMemo(() => {
    const totalUsers = users.length;

    // 1. Availability tracking (Online vs Offline status fields)
    const activeUsers = users.filter((u) => u.isOnline).length;
    const inactiveUsers = totalUsers - activeUsers;

    // 2. Users with Stores cross-reference tracking
    const storeOwnerIds = new Set(stores.map((s) => s.ownerId));
    const usersWithStores = users.filter((u) =>
      storeOwnerIds.has(u._id),
    ).length;

    // 3. Deactivated accounts status (True explicit flag checks)
    const deactivatedUsers = users.filter((u) => u.deactivated === true).length;

    // 4. Resolve Dynamic Profile Statuses by translating IDs to names
    const profileStatusDistribution = {};

    itemStatus.forEach((status) => {
      profileStatusDistribution[status.name] = 0;
    });

    users.forEach((user) => {
      const matchingStatus = itemStatus.find(
        (status) => status._id === user.profileStatus,
      );
      const statusLabel = matchingStatus
        ? matchingStatus.name
        : "Unknown Status";
      profileStatusDistribution[statusLabel] =
        (profileStatusDistribution[statusLabel] || 0) + 1;
    });

    const profileStatusData = Object.entries(profileStatusDistribution).map(
      ([name, value]) => ({ name, value }),
    );

    // 5. Dynamic Calculations for User Registrations based on user.createdAt
    const registrationCounts = {};

    users.forEach((user) => {
      if (!user.createdAt) return;
      const date = new Date(user.createdAt);
      if (isNaN(date.getTime())) return;

      if (timelineView === "monthly") {
        // Create an index key: "YYYY-MM"
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const key = `${year}-${month}`;

        // Human-readable format for labels: "Jan 2025"
        const label = date.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });

        if (!registrationCounts[key]) {
          registrationCounts[key] = { key, name: label, Registrations: 0 };
        }
        registrationCounts[key].Registrations += 1;
      } else {
        // Yearly key: "YYYY"
        const key = String(date.getFullYear());
        if (!registrationCounts[key]) {
          registrationCounts[key] = { key, name: key, Registrations: 0 };
        }
        registrationCounts[key].Registrations += 1;
      }
    });

    // Sort historical timeline chronologically by its underlying raw string key
    const activityTimeline = Object.values(registrationCounts).sort((a, b) =>
      a.key.localeCompare(b.key),
    );

    const toalUsers = activeUsers + inactiveUsers;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersWithStores,
      deactivatedUsers,
      profileStatusData,
      activityTimeline,
      toalUsers,
    };
  }, [users, stores, timelineView, itemStatus]);

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex flex-col">
        <div className="flex">
          <h1 className="font-semibold text-md">User Data Stats</h1>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] mt-4 gap-2">
          {/* Grid 0 */}
          <div className="w-full p-4 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Users
            </h1>
            <div className="flex items-center mt-2 justify-between">
              <p className="text-3xl font-extrabold text-gray-600 leading-tight">
                {stats.totalUsers}
              </p>
              <div className="flex item-start border border-gray-300 text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                Live Now
              </div>
            </div>
          </div>
          {/* Grid 0 ends */}

          {/* Grid 1 */}
          <div className="w-full p-4 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Online Users
            </h1>
            <div className="flex items-center mt-2 justify-between">
              <p className="text-3xl font-extrabold text-green-600 leading-tight">
                {stats.activeUsers}
              </p>
              <div className="flex item-start border border-green-300 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Live Now
              </div>
            </div>
          </div>
          {/* Grid 1 ends */}

          {/* Grid 2 */}
          <div className="w-full p-4 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
            <h1 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Offline Users
            </h1>
            <div className="flex items-center mt-2 justify-between">
              <p className="text-3xl font-extrabold text-cyan-600 leading-tight">
                {stats.inactiveUsers}
              </p>
              <div className="flex item-start border border-cyan-300 text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full font-medium">
                Idle
              </div>
            </div>
          </div>
          {/* Grid 2 ends */}

          {/* Grid 3 */}
          <div className="w-full p-4 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Store Owners
            </h1>
            <div className="flex items-center mt-2 justify-between">
              <p className="text-3xl font-extrabold text-orange-600 leading-tight">
                {stats.usersWithStores}
              </p>
              <div className="flex item-start border border-orange-300 text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                Store Owners
              </div>
            </div>
          </div>
          {/* Grid 3 ends */}

          {/* Grid 4 */}
          <div className="w-full p-4 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Deactivated Users
            </h1>
            <div className="flex items-center mt-2 justify-between">
              <p className="text-3xl font-extrabold text-rose-600 leading-tight">
                {stats.deactivatedUsers}
              </p>
              <div className="flex item-start border border-rose-300 text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                For Deletion
              </div>
            </div>
          </div>
          {/* Grid 4 ends */}
        </div>

        <div className="grid grid-cols-[2.5fr_1fr] mt-4 gap-2">
          <div className="w-full p-4 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
            <div className="flex w-full items-center justify-between">
              <div className="mb-4">
                <h2 className="text-md font-bold text-gray-900">
                  User Onboarding Timeline
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  New user account creation volume computed from account
                  parameters
                </p>
              </div>

              {/* Control View Toggle Selection Dropdown */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="view-select"
                  className="text-xs font-semibold text-slate-500"
                >
                  Group By:
                </label>
                <select
                  id="view-select"
                  value={timelineView}
                  onChange={(e) => setTimelineView(e.target.value)}
                  className="px-2.5 py-1 text-xs font-medium border border-slate-200 bg-slate-50 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 cursor-pointer"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex h-80">
              {stats.activityTimeline.length === 0 ? (
                <div className="w-full flex items-center justify-center text-xs font-medium text-slate-400">
                  No user creation history flags found
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {/* Swapped to a BarChart for a cleaner user-volume breakdown view */}
                  <BarChart
                    data={stats.activityTimeline}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", pt: 2 }} />
                    <Bar
                      dataKey="Registrations"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="w-full p-4 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
            <div className="mb-4">
              <h2 className="text-md font-bold text-gray-900">
                User Registrations
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Aggregated user registrations distribution from user data
              </p>
            </div>
            <div className="flex relative">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Online Users",
                        value: stats.activeUsers,
                        color: "#06b6d4",
                      },
                      {
                        name: "Offline Users",
                        value: stats.totalUsers - stats.activeUsers,
                        color: "#6366f1",
                      },
                      {
                        name: "Store Owners",
                        value: stats.usersWithStores,
                        color: "#10b981",
                      },
                      {
                        name: "Deactivated Users",
                        value: stats.deactivatedUsers,
                        color: "#f43f5e",
                      },
                    ]}
                    cx="50%"
                    cy="50%" // Recentered to perfectly middle since bottom legends are gone
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    // Custom calculation function drawing the lines & data text strings safely
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 16; // Length distance of line points outside the donut boundary
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      const textAnchor = x > cx ? "start" : "end";

                      // Filter out sections evaluating to zero so empty categories don't bundle lines on top of each other
                      if (value === 0) return null;

                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor={textAnchor}
                          dominantBaseline="central"
                          className="fill-slate-700 font-sans font-bold text-[11px]"
                        >
                          {`${name}: ${value}`}
                        </text>
                      );
                    }}
                    // Active line connector configurations pointing to labels
                    labelLine={{
                      stroke: "#cbd5e1",
                      strokeWidth: 1.2,
                      strokeDasharray: "2 2",
                    }}
                  >
                    {[
                      { color: "#06b6d4" },
                      { color: "#6366f1" },
                      { color: "#10b981" },
                      { color: "#f43f5e" },
                    ].map((cell, index) => (
                      <Cell key={`cell-${index}`} fill={cell.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
