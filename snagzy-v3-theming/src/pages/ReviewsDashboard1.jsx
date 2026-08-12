import { useMemo, useState } from "react";
import { reviews } from "../data/reviews";
import { users } from "../data/users";
import { stores } from "../data/stores";
import { products } from "../data/products";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import { PageHeader } from "../components/PageHeader";

export const ReviewsDashboard1 = () => {
  // Analytical breakdown view options selector state ('distribution' vs 'pie')
  const [activeMetricTab, setActiveMetricTab] = useState("distribution");

  // Comprehensive data aggregation pipeline
  const dashboardData = useMemo(() => {
    // 1. General Metrics Calculations
    const totalReviews = reviews.length;
    const averageGlobalRating =
      totalReviews > 0
        ? (
            reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
          ).toFixed(2)
        : 0;

    // 2. Rating Star Distributions (Updated with Bucket Averages)
    const ratingDistribution = [5, 4, 3, 2, 1].map((starLevel) => {
      // 1. Filter the reviews array down to ONLY the ones in this star's range
      const matchingReviews = reviews.filter((r) => {
        const ratingNum = Number(r.rating);
        if (starLevel === 5) return ratingNum === 5;
        return ratingNum >= starLevel && ratingNum < starLevel + 1;
      });

      // 2. Sum up the ratings inside this bucket and compute the average
      const bucketSum = matchingReviews.reduce(
        (sum, r) => sum + Number(r.rating),
        0,
      );
      const bucketAverage =
        matchingReviews.length > 0
          ? Number((bucketSum / matchingReviews.length).toFixed(1))
          : 0;

      // 3. Return the count and the 1-decimal average to Recharts
      return {
        name: `${starLevel} ★`,
        count: matchingReviews.length,
        average: bucketAverage,
      };
    });

    // 3. Leaderboard Pipeline: Aggregation helper matrix mapping function
    const getLeaderboard = (groupKey, rawDataRef) => {
      const tracker = {};

      reviews.forEach((rev) => {
        const targetId =
          groupKey === "productId"
            ? rev.orderInfo?.productId
            : groupKey === "storeId"
              ? rev.orderInfo?.storeInfoStoreId
              : rev.buyerId;

        if (!targetId) return;

        if (!tracker[targetId]) {
          tracker[targetId] = { id: targetId, sum: 0, count: 0 };
        }
        tracker[targetId].sum += rev.rating;
        tracker[targetId].count += 1;
      });

      return Object.values(tracker)
        .map((item) => {
          const entity = rawDataRef.find((e) => e._id === item.id);
          let resolvedName = "Unknown Entity";
          let resolvedImage = "";

          if (entity) {
            if (groupKey === "buyerId") {
              resolvedName =
                `${entity.firstName || ""} ${entity.lastName || ""}`.trim();
              resolvedImage = entity.image;
            } else if (groupKey === "storeId") {
              resolvedName = entity.storeName;
              resolvedImage = entity.logoUrl || entity.bannerUrl;
            } else if (groupKey === "productId") {
              resolvedName = entity.name;
              resolvedImage = entity.variants?.[0]?.primaryImage || "";
            }
          } else {
            if (
              groupKey === "storeId" &&
              reviews.find((r) => r.orderInfo?.storeInfoStoreId === item.id)
            ) {
              const rMatch = reviews.find(
                (r) => r.orderInfo?.storeInfoStoreId === item.id,
              );
              resolvedName =
                rMatch.orderInfo.storeInfoStoreName || "Unknown Store";
              resolvedImage = rMatch.orderInfo.storeInfoStoreImage || "";
            } else if (
              groupKey === "productId" &&
              reviews.find((r) => r.orderInfo?.productId === item.id)
            ) {
              resolvedName =
                reviews.find((r) => r.orderInfo?.productId === item.id)
                  .orderInfo.productName || "Unknown Product";
            }
          }

          return {
            id: item.id,
            name: resolvedName,
            image: resolvedImage,
            totalReviews: item.count,
            averageRating: Number((item.sum / item.count).toFixed(2)),
          };
        })
        .sort(
          (a, b) =>
            b.averageRating - a.averageRating ||
            b.totalReviews - a.totalReviews,
        )
        .slice(0, 5);
    };

    const topBuyers = getLeaderboard("buyerId", users);
    const topStores = getLeaderboard("storeId", stores);
    const topProducts = getLeaderboard("productId", products);

    return {
      totalReviews,
      averageGlobalRating,
      ratingDistribution,
      topBuyers,
      topStores,
      topProducts,
    };
  }, []);

  // Palette array running from 5 down to 1 Star
  const PIE_COLORS = ["#10b981", "#34d399", "#f59e0b", "#f97316", "#ef4444"];

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
          {/* Main Charts Matrix Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Rating Breakdown Chart Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs lg:col-span-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    Rating Analysis
                  </h3>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveMetricTab("distribution")}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        activeMetricTab === "distribution"
                          ? "bg-white text-slate-800 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Spread
                    </button>
                    <button
                      onClick={() => setActiveMetricTab("pie")}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        activeMetricTab === "pie"
                          ? "bg-white text-slate-800 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Share
                    </button>
                  </div>
                </div>

                {activeMetricTab === "distribution" ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={dashboardData.ratingDistribution}
                      margin={{ left: -20, top: 25 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 11,
                          fill: "#64748b",
                          fontWeight: 600,
                        }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        content={({ active, payload }) => {
                          if (active && payload?.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-2 border border-slate-100 shadow-md rounded-lg text-xs flex flex-col gap-0.5">
                                <span className="font-bold text-slate-800">
                                  {data.name} Range
                                </span>
                                <span className="text-slate-600 font-medium">
                                  Total: {data.count} reviews
                                </span>
                                <span className="text-indigo-600 font-semibold">
                                  Average: {data.average.toFixed(1)} ★
                                </span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={30}
                        background={{ fill: "#f1f5f9", radius: 4 }}
                      >
                        <LabelList
                          dataKey="count"
                          position="top"
                          content={(props) => {
                            const { x, y, width, value, index } = props;
                            const matchedData =
                              dashboardData.ratingDistribution[index];
                            const avg = matchedData ? matchedData.average : 0;

                            return (
                              <text
                                x={x + width / 2}
                                y={y - 18} // Adjusted up slightly to make room for two vertical lines
                                fill="#64748b"
                                textAnchor="middle"
                                style={{ fontSize: 10, fontWeight: 700 }}
                              >
                                {/* First Line: Display the count */}
                                <tspan x={x + width / 2}>{value}</tspan>

                                {/* Second Line: Display the average shifted down by 12 pixels */}
                                <tspan
                                  x={x + width / 2}
                                  dy="12"
                                  style={{ fontWeight: 600, fill: "#475569" }}
                                >
                                  {`(${avg.toFixed(1)}★)`}
                                </tspan>
                              </text>
                            );
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={dashboardData.ratingDistribution.filter(
                          (d) => d.count > 0,
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="count"
                        label={({
                          cx,
                          cy,
                          midAngle,
                          outerRadius,
                          name,
                          value,
                          payload,
                        }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = outerRadius + 12;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#475569"
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              className="text-[10px] font-bold"
                            >
                              {`${name} (${payload.average.toFixed(1)}★): ${value}`}
                            </text>
                          );
                        }}
                        labelLine={true}
                      >
                        {dashboardData.ratingDistribution
                          .filter((d) => d.count > 0)
                          .map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Top Rated Stores */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs lg:col-span-1">
              <h3 className="text-sm font-bold text-slate-800 mb-4">
                Top Rated Stores
              </h3>
              <div className="space-y-3.5">
                {dashboardData.topStores.map((store, i) => (
                  <div
                    key={store.id}
                    className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-none last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-slate-400 w-4">
                        {i + 1}
                      </span>
                      {store.image ? (
                        <img
                          src={store.image}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-100"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {store.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate">
                          {store.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {store.totalReviews} Reviews
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                        {store.averageRating} ★
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Rated Products */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs lg:col-span-1">
              <h3 className="text-sm font-bold text-slate-800 mb-4">
                Top Rated Products
              </h3>
              <div className="space-y-3.5">
                {dashboardData.topProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-none last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-slate-400 w-4">
                        {i + 1}
                      </span>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-100"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                          📦
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {product.totalReviews} Reviews
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {product.averageRating} ★
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Reviewers Listing Matrix */}
          <div className="w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Top Reviewers Listing Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-3 px-4">Rank No.</th>
                    <th className="py-3 px-4">User Profile Identifier</th>
                    <th className="py-3 px-4 text-center">Reviews Published</th>
                    <th className="py-3 px-4 text-right">
                      Aggregated Score Average
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {dashboardData.topBuyers.map((buyer, index) => (
                    <tr
                      key={buyer.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-400">
                        #{index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {buyer.image ? (
                            <img
                              src={buyer.image}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover bg-slate-100"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px]">
                              {buyer.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-800">
                              {buyer.name}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400 select-all">
                              {buyer.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-700">
                        {buyer.totalReviews}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                          {buyer.averageRating} / 5.00
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
