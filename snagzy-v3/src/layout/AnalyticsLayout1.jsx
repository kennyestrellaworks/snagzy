import { NavLink, Outlet, useSearchParams } from "react-router-dom";
import { LengthIsZeroErrorSmall } from "../components/LengthIsZeroError";
import { PageHeader } from "../components/PageHeader";
import { useData } from "../context/DataContext";
import { useState, useMemo, useEffect } from "react";

export const AnalyticsLayout1 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAnalyticsLayoutNavLinks, getAllOrders } = useData();

  const analyticsLayoutNavLinks = getAnalyticsLayoutNavLinks();
  const orders = getAllOrders();
  const count = 6;

  // --- FIX: Read filters directly from URL parameter strings instead of managing local component states ---
  const selectedYear = searchParams.get("year") || "all";
  const selectedMonth = searchParams.get("month") || "all";
  const selectedDay = searchParams.get("day") || "all";

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Dynamically compute selectable Years and Months based on incoming orders
  const { availableYears, availableMonthsByYear } = useMemo(() => {
    if (!orders || orders.length === 0) {
      return { availableYears: [], availableMonthsByYear: {} };
    }

    const yearsMap = new Map();
    const monthsMap = {};

    orders.forEach((order) => {
      const date = new Date(order.currentStatus.timestamp);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = date.toLocaleString("default", { month: "long" });

      if (!yearsMap.has(year)) {
        yearsMap.set(year, true);
      }

      if (!monthsMap[year]) {
        monthsMap[year] = new Map();
      }
      if (!monthsMap[year].has(month)) {
        monthsMap[year].set(month, monthName);
      }
    });

    const sortedYears = Array.from(yearsMap.keys()).sort((a, b) => b - a);

    const sortedMonthsByYear = {};
    for (const year in monthsMap) {
      sortedMonthsByYear[year] = Array.from(monthsMap[year].entries())
        .sort((a, b) => b[0] - a[0])
        .map(([monthNum, monthName]) => ({
          value: monthNum.toString(),
          label: monthName,
          monthNumber: monthNum,
        }));
    }

    return {
      availableYears: sortedYears,
      availableMonthsByYear: sortedMonthsByYear,
    };
  }, [orders]);

  // Get available months for the currently selected year
  const currentAvailableMonths = useMemo(() => {
    if (selectedYear === "all") {
      const allMonthsMap = new Map();
      orders?.forEach((order) => {
        const date = new Date(order.currentStatus.timestamp);
        const month = date.getMonth();
        const monthName = date.toLocaleString("default", { month: "long" });
        if (!allMonthsMap.has(month)) {
          allMonthsMap.set(month, monthName);
        }
      });
      return Array.from(allMonthsMap.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([monthNum, monthName]) => ({
          value: monthNum.toString(),
          label: monthName,
          monthNumber: monthNum,
        }));
    }
    return availableMonthsByYear[selectedYear] || [];
  }, [selectedYear, availableMonthsByYear, orders]);

  // Dynamically generate days array based on year and month selection
  const currentAvailableDays = useMemo(() => {
    if (selectedYear === "all" || selectedMonth === "all") return [];

    const yearNum = parseInt(selectedYear, 10);
    const monthNum = parseInt(selectedMonth, 10);
    const daysInMonth = new Date(yearNum, monthNum + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (year) => {
    const params = new URLSearchParams(searchParams);
    if (year && year !== "all") params.set("year", year);
    else params.delete("year");
    params.delete("month");
    params.delete("day");
    params.set("orders", count.toString());
    params.delete("itemLimits");
    setSearchParams(params, { replace: !isInitialLoad });
  };

  const handleMonthChange = (month) => {
    const params = new URLSearchParams(searchParams);
    if (month && month !== "all") params.set("month", month);
    else params.delete("month");
    params.delete("day");
    params.set("orders", count.toString());
    params.delete("itemLimits");
    setSearchParams(params, { replace: !isInitialLoad });
  };

  const handleDayChange = (day) => {
    const params = new URLSearchParams(searchParams);
    if (day && day !== "all") params.set("day", day);
    else params.delete("day");
    params.set("orders", count.toString());
    params.delete("itemLimits");
    setSearchParams(params, { replace: !isInitialLoad });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("year");
    params.delete("month");
    params.delete("day");
    params.set("orders", count.toString());
    params.delete("itemLimits");
    params.delete("top_products");
    params.delete("top_buyers");
    params.delete("top_stores");
    setSearchParams(params, { replace: !isInitialLoad });
  };

  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="flex flex-col w-full z-50">
        <div className="flex w-full justify-between items-center pl-2 pr-2 pt-2 z-20">
          <div className="flex gap-2 justify-between">
            <h1>Analytics</h1>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex w-full px-2">
              {analyticsLayoutNavLinks.length === 0 ? (
                <LengthIsZeroErrorSmall />
              ) : (
                analyticsLayoutNavLinks.map((analyticsLayoutNavLink, index) => (
                  <NavLink
                    key={index}
                    to={analyticsLayoutNavLink.link}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2 py-1 px-3 text-[14px] rounded-t-md transition-all ${
                        isActive
                          ? "bg-[#F3F3F3] text-gray-600 border-t border-l border-r border-[#C2C2C2]"
                          : "bg-white border-t border-l border-r border-white text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <span className="truncate transition-opacity duration-200 ease-in-out">
                      {analyticsLayoutNavLink.label}
                    </span>
                  </NavLink>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex pl-2 pr-2 w-full justify-between items-center bg-[#F3F3F3] border-t border-b border-[#C2C2C2] z-10 py-1">
          <PageHeader
            defaultPage="Products"
            type="analytics-level"
            suffix="Related Analytics"
          />

          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label
                htmlFor="layout-year-select"
                className="text-sm font-medium text-gray-700"
              >
                Year:
              </label>
              <select
                id="layout-year-select"
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="px-3 py-1 border bg-white border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                {availableYears?.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="layout-month-select"
                className="text-sm font-medium text-gray-700"
              >
                Month:
              </label>
              <select
                id="layout-month-select"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="px-3 py-1 border bg-white border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  selectedYear === "all" || currentAvailableMonths.length === 0
                }
              >
                <option value="all">All Months</option>
                {currentAvailableMonths.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="layout-day-select"
                className="text-sm font-medium text-gray-700"
              >
                Day:
              </label>
              <select
                id="layout-day-select"
                value={selectedDay}
                onChange={(e) => handleDayChange(e.target.value)}
                className="px-3 py-1 border bg-white border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedYear === "all" || selectedMonth === "all"}
              >
                <option value="all">All Days</option>
                {currentAvailableDays.map((day) => (
                  <option key={day} value={day.toString()}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {(selectedYear !== "all" ||
              selectedMonth !== "all" ||
              selectedDay !== "all") && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-1 rounded-sm text-sm cursor-pointer border border-amber-300 bg-amber-200 text-red-600 hover:text-red-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full w-full bg-[#F3F3F3] overflow-y-auto">
        <div className="flex w-full p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
