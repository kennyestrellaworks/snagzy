import React, { useState, useMemo } from "react";
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
  AreaChart,
  Area,
} from "recharts";

import { orders } from "../data/orders";
import { users } from "../data/users";
import {
  successfulOrderStatuses,
  pendingOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../data/orderLifeCycle";
import { PageHeader } from "../components/PageHeader";

export const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");

  const [registryTab, setRegistryTab] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);

  const uniqueYears = useMemo(() => {
    const years = new Set();
    orders.forEach((order) => {
      if (order.createdAt) {
        years.add(new Date(order.createdAt).getFullYear().toString());
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, []);

  const daysInSelectedMonth = useMemo(() => {
    let totalDays = 31;
    if (selectedMonth !== "All" && selectedYear !== "All") {
      totalDays = new Date(
        Number(selectedYear),
        Number(selectedMonth) + 1,
        0,
      ).getDate();
    }
    return Array.from({ length: totalDays }, (_, i) => (i + 1).toString());
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("All");
    setSelectedDay("All");
    setVisibleCount(10);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedDay("All");
    setVisibleCount(10);
  };

  const getStatusBadgeClass = (slug) => {
    if (successfulOrderStatuses.includes(slug)) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (unsuccessfulOrderStatuses.includes(slug)) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    } else {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  // --- EXISTING ORDERS CALCULATION ---
  const dashboardData = useMemo(() => {
    const filteredOrders = orders.filter((order) => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);

      if (
        selectedYear !== "All" &&
        orderDate.getFullYear().toString() !== selectedYear
      )
        return false;
      if (
        selectedMonth !== "All" &&
        orderDate.getMonth().toString() !== selectedMonth
      )
        return false;
      if (
        selectedDay !== "All" &&
        orderDate.getDate().toString() !== selectedDay
      )
        return false;

      return true;
    });

    let realizedRevenue = 0;
    let pipelineRevenue = 0;
    let lostRevenue = 0;

    let successCount = 0;
    let pendingCount = 0;
    let failureCount = 0;

    const statusDistributionMap = {};

    filteredOrders.forEach((order) => {
      const slug = order.currentStatus?.slug;
      const price = order.summary?.orderTotalPrice || 0;

      const statusLabel = order.currentStatus?.label || slug;
      statusDistributionMap[statusLabel] =
        (statusDistributionMap[statusLabel] || 0) + 1;

      if (successfulOrderStatuses.includes(slug)) {
        realizedRevenue += price;
        successCount++;
      } else if (pendingOrderStatuses.includes(slug)) {
        pipelineRevenue += price;
        pendingCount++;
      } else if (unsuccessfulOrderStatuses.includes(slug)) {
        lostRevenue += price;
        failureCount++;
      }
    });

    const pieChartData = [
      { name: "Successful", value: successCount, color: "#10B981" },
      { name: "Pending Pipeline", value: pendingCount, color: "#3B82F6" },
      { name: "Unsuccessful", value: failureCount, color: "#EF4444" },
    ].filter((item) => item.value > 0);

    const barChartData = Object.entries(statusDistributionMap).map(
      ([key, val]) => ({
        status: key,
        Count: val,
      }),
    );

    return {
      totalOrders: filteredOrders.length,
      realizedRevenue,
      pipelineRevenue,
      lostRevenue,
      pieChartData,
      barChartData,
      filteredOrdersList: filteredOrders,
    };
  }, [selectedYear, selectedMonth, selectedDay]);

  // --- NEW USER DATA CALCULATIONS ---
  const userMetrics = useMemo(() => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyCounts = {};
    months.forEach((m) => (monthlyCounts[m] = 0));

    let onlineCount = 0;
    let offlineCount = 0;
    const jobCounts = {};

    users.forEach((user) => {
      // 1. Live Heartbeat Session calculations
      if (user.isOnline) onlineCount++;
      else offlineCount++;

      // 2. Aggregate Professional Occupations
      if (user.jobTitle) {
        jobCounts[user.jobTitle] = (jobCounts[user.jobTitle] || 0) + 1;
      }

      // 3. Growth Trend Over Time (Respects Year Filter)
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const userYear = date.getFullYear().toString();

        if (selectedYear === "All" || selectedYear === userYear) {
          const monthName = months[date.getMonth()];
          monthlyCounts[monthName] += 1;
        }
      }
    });

    const trendData = months.map((month) => ({
      name: month.substring(0, 3),
      "New Signups": monthlyCounts[month],
    }));

    const jobData = Object.entries(jobCounts)
      .map(([job, count]) => ({
        jobName: job,
        "Total Users": count,
      }))
      .sort((a, b) => b["Total Users"] - a["Total Users"])
      .slice(0, 5);

    const onlineData = [
      { name: "Online", value: onlineCount, color: "#10B981" },
      { name: "Offline", value: offlineCount, color: "#9CA3AF" },
    ].filter((item) => item.value > 0);

    return {
      trendData,
      jobData,
      onlineData,
      totalRegisteredUsers: users.length,
      currentOnlineCount: onlineCount,
    };
  }, [selectedYear]);

  const registryOrdersList = useMemo(() => {
    return dashboardData.filteredOrdersList.filter((order) => {
      const slug = order.currentStatus?.slug;
      if (registryTab === "Successful")
        return successfulOrderStatuses.includes(slug);
      if (registryTab === "Pending") return pendingOrderStatuses.includes(slug);
      if (registryTab === "Cancellations")
        return unsuccessfulOrderStatuses.includes(slug);
      return true;
    });
  }, [dashboardData.filteredOrdersList, registryTab]);

  const visibleOrdersList = useMemo(() => {
    return registryOrdersList.slice(0, visibleCount);
  }, [registryOrdersList, visibleCount]);

  const monthsLabelList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="flex w-full z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          <div className="flex gap-2 justify-between">
            <PageHeader defaultPage="Analytics" type="sidebar-level" />
          </div>
        </div>
      </div>

      {/* Date Controls Bar */}
      <div className="flex gap-4 p-4 bg-gray-50 border-b border-gray-200 shrink-0">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Year
          </label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-1.5 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Years</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            disabled={selectedYear === "All"}
            className="p-1.5 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="All">All Months</option>
            {monthsLabelList.map((month, index) => (
              <option key={month} value={index.toString()}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Day
          </label>
          <select
            value={selectedDay}
            onChange={(e) => {
              setSelectedDay(e.target.value);
              setVisibleCount(10);
            }}
            disabled={selectedMonth === "All"}
            className="p-1.5 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="All">All Days</option>
            {daysInSelectedMonth.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex flex-col w-full p-2 gap-6">
          {/* KPI Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm">
              <span className="text-sm font-medium text-gray-500">
                Total Orders
              </span>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {dashboardData.totalOrders}
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm">
              <span className="text-sm font-medium text-gray-500">
                Realized Revenue
              </span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                ${dashboardData.realizedRevenue.toFixed(2)}
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm">
              <span className="text-sm font-medium text-gray-500">
                Pipeline Revenue
              </span>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                ${dashboardData.pipelineRevenue.toFixed(2)}
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm">
              <span className="text-sm font-medium text-gray-500">
                Lost Revenue
              </span>
              <div className="text-2xl font-bold text-rose-600 mt-1">
                ${dashboardData.lostRevenue.toFixed(2)}
              </div>
            </div>
            <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm">
              <span className="text-sm font-medium text-gray-500">
                Total Userbase
              </span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">
                {userMetrics.totalRegisteredUsers}
                <span className="text-xs font-normal text-emerald-600 ml-1.5">
                  ({userMetrics.currentOnlineCount} live)
                </span>
              </div>
            </div>
          </div>

          {/* Business & Order Performance Charts Section */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Order Performance Insights
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {/* Pie Chart Card */}
              <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm flex flex-col h-80">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Lifecycle Distribution
                </h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      >
                        {dashboardData.pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart Card */}
              <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm flex flex-col h-80">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Status Breakdown
                </h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="Count"
                        fill="#4F46E5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* User Engagement Charts Section */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
              User Base Analytics
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
              {/* User Signups Trend */}
              <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm flex flex-col h-80">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Registration Growth
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  Profile trends for year: {selectedYear}
                </p>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={userMetrics.trendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="userSignupGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366F1"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366F1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F3F4F6"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        stroke="#9CA3AF"
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        stroke="#9CA3AF"
                        allowDecimals={false}
                      />
                      <Tooltip contentStyle={{ fontSize: "12px" }} />
                      <Area
                        type="monotone"
                        dataKey="New Signups"
                        stroke="#6366F1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#userSignupGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Niche User Occupations */}
              <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm flex flex-col h-80">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Top User Demographics
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  Top 5 professional job spaces
                </p>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={userMetrics.jobData}
                      margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#F3F4F6"
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11 }}
                        stroke="#9CA3AF"
                        allowDecimals={false}
                      />
                      <YAxis
                        dataKey="jobName"
                        type="category"
                        tick={{ fontSize: 10 }}
                        stroke="#9CA3AF"
                        width={75}
                      />
                      <Tooltip contentStyle={{ fontSize: "12px" }} />
                      <Bar
                        dataKey="Total Users"
                        fill="#3B82F6"
                        radius={[0, 4, 4, 0]}
                        maxBarSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Heartbeat Status (Online vs Offline) */}
              <div className="bg-white p-4 border border-gray-200 rounded-md shadow-sm flex flex-col h-80">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Session Status
                </h3>
                <p className="text-xs text-gray-400 mb-1">
                  Real-time user availability breakdown
                </p>
                <div className="flex-1 min-h-0 flex flex-col justify-center items-center relative">
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={userMetrics.onlineData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {userMetrics.onlineData.map((entry, index) => (
                          <Cell
                            key={`cell-online-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Customized Inline Legend layout */}
                  <div className="flex gap-4 text-xs font-medium justify-center mt-2">
                    {userMetrics.onlineData.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: entry.color }}
                        ></span>
                        <span className="text-gray-600">
                          {entry.name}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden w-full">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Filtered Orders Registry
              </h3>

              <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-medium self-start sm:self-auto">
                {["All", "Successful", "Pending", "Cancellations"].map(
                  (tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setRegistryTab(tab);
                        setVisibleCount(10);
                      }}
                      className={`px-3 py-1.5 rounded-md transition-all duration-150 ${
                        registryTab === tab
                          ? "bg-white text-gray-900 shadow-sm font-semibold"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                    <th className="p-3">Order ID / Stamp</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {visibleOrdersList.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-400">
                        No matching records found for this period.
                      </td>
                    </tr>
                  ) : (
                    visibleOrdersList.map((order, index) => (
                      <tr key={order.id || index} className="hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">
                          {order.id || `ORDER-${index}`}
                          <span className="block text-gray-400 font-sans mt-0.5">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-semibold border rounded-full ${getStatusBadgeClass(order.currentStatus?.slug)}`}
                          >
                            {order.currentStatus?.label ||
                              order.currentStatus?.slug ||
                              "Unknown"}
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium">
                          ${(order.summary?.orderTotalPrice || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Load More Pagination Section */}
            {registryOrdersList.length > visibleCount && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className="px-4 py-2 border border-gray-300 rounded shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
