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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Mock imports based on your uploaded files structure
// Adjust paths as necessary for your local project setup
import { users } from "../data/users";
import { stores } from "../data/stores";
import { useMemo } from "react";
import { PageHeader } from "../components/PageHeader";

const COLORS = ["#06b6d4", "#f43f5e", "#10b981", "#6366f1", "#f59e0b"];

export const UserDashboard = () => {
  // Process data using useMemo for performance optimization
  const stats = useMemo(() => {
    const totalUsers = users.length;

    // 1. Active vs Inactive (Using isOnline or profileStatus depending on your logic)
    const activeUsers = users.filter((u) => u.isOnline).length;
    const inactiveUsers = totalUsers - activeUsers;

    // 2. Users with Stores
    const storeOwnerIds = new Set(stores.map((s) => s.ownerId));
    const usersWithStores = users.filter((u) =>
      storeOwnerIds.has(u._id),
    ).length;

    // 3. Deactivated accounts
    // Based on front/back snippet, status "itemstatusea5n700an186861v4qyrjus8" represents non-active/deactivated profiles
    const deactivatedUsers = users.filter(
      (u) => u.profileStatus === "itemstatusea5n700an186861v4qyrjus8",
    ).length;

    // 4. Registration & Deactivation timeline aggregation
    const timelineMap = {};

    users.forEach((user) => {
      if (!user.createdAt) return;
      // Get YYYY-MM
      const month = user.createdAt.substring(0, 7);
      if (!timelineMap[month]) {
        timelineMap[month] = { month, registrations: 0, deactivations: 0 };
      }
      timelineMap[month].registrations += 1;

      if (user.profileStatus === "itemstatusea5n700an186861v4qyrjus8") {
        timelineMap[month].deactivations += 1;
      }
    });

    // Sort timeline chronologically
    const timelineData = Object.values(timelineMap).sort((a, b) =>
      a.month.localeCompare(b.month),
    );

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersWithStores,
      deactivatedUsers,
      statusData: [
        { name: "Active (Online)", value: activeUsers },
        { name: "Inactive (Offline)", value: inactiveUsers },
      ],
      storeOwnershipData: [
        { name: "Owns a Store", value: usersWithStores },
        { name: "No Store", value: totalUsers - usersWithStores },
      ],
      timelineData,
    };
  }, []);

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="flex w-full z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          <div className="flex gap-2 justify-between">
            <PageHeader defaultPage="Analytics" type="sidebar-level" />
          </div>
        </div>
      </div>

      <div>THIS</div>

      <div className="flex flex-col w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex flex-col w-full p-2 gap-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-medium text-slate-500">
                Total Registered Users
              </span>
              <span className="text-3xl font-bold text-slate-900 mt-2">
                {stats.totalUsers}
              </span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-medium text-slate-500">
                Active (Online) Now
              </span>
              <span className="text-3xl font-bold text-cyan-600 mt-2">
                {stats.activeUsers}
              </span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-medium text-slate-500">
                Merchant Users (With Stores)
              </span>
              <span className="text-3xl font-bold text-emerald-600 mt-2">
                {stats.usersWithStores}
              </span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-medium text-slate-500">
                Deactivated Accounts
              </span>
              <span className="text-3xl font-bold text-rose-600 mt-2">
                {stats.deactivatedUsers}
              </span>
            </div>
          </div>

          {/* Main Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Registration & Deactivation Timeline */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                User Growth & Account Retention
              </h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats.timelineData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorDeact"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f43f5e"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f43f5e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Area
                      type="monotone"
                      name="New Registrations"
                      dataKey="registrations"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorReg)"
                    />
                    <Area
                      type="monotone"
                      name="Deactivations"
                      dataKey="deactivations"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorDeact)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active vs Inactive Pie Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                User Activity Status
              </h2>
              <div className="h-64 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Absolute Center Stats */}
                <div className="absolute text-center">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Online Ratio
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.totalUsers
                      ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
              {/* Custom Legend to match Tailwind design */}
              <div className="flex justify-center space-x-6 mt-2 text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-500 block"></span>
                  <span className="text-slate-600">
                    Active ({stats.activeUsers})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
                  <span className="text-slate-600">
                    Inactive ({stats.inactiveUsers})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Penetration: Store Owners vs Standard Users */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                Store Ownership Mix
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Comparison of users who run an active storefront versus standard
                consumers.
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.storeOwnershipData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      type="number"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      name="Total Users"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={40}
                    >
                      {stats.storeOwnershipData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#10b981" : "#6366f1"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Metrics Breakdown Table */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Data Summary
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Quick raw overview extracted from your `users.js` and
                  `stores.js` layers.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="text-xs uppercase text-slate-400 bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-semibold">
                          Metric Description
                        </th>
                        <th className="py-3 px-4 font-semibold text-right">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          Total Accounts Processed
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          {stats.totalUsers}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          Live Active Sessions
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-cyan-600">
                          {stats.activeUsers}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          Identified Store Owners
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600">
                          {stats.usersWithStores}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          Deactivated Flag Enforced
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-rose-600">
                          {stats.deactivatedUsers}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="text-xs text-slate-400 text-right mt-4">
                Data structure parsed accurately from database assets.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
