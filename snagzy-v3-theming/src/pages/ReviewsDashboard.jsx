import { useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import { reviews } from "../data/reviews";
import { products } from "../data/products";
import { users } from "../data/users";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

// Helper: Format date to YYYY-MM-DD
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// Helper: Get product name by ID
const getProductName = (productId) => {
  const product = products.find((p) => p._id === productId);
  return product ? product.name : "Unknown Product";
};

// Helper: Get user name by ID
const getUserName = (userId) => {
  const user = users.find((u) => u._id === userId);
  if (user) return `${user.firstName} ${user.lastName}`;
  return "Unknown User";
};

// Helper: Format average rating
const formatRating = (value) => value.toFixed(1);

export const ReviewsDashboard = () => {
  // 1. Rating distribution (count of reviews per rating)
  const ratingDistribution = useMemo(() => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      const rating = Math.round(review.rating);
      if (distribution[rating] !== undefined) distribution[rating] += 1;
    });
    return Object.keys(distribution).map((rating) => ({
      rating: `${rating} Star${rating !== "1" ? "s" : ""}`,
      count: distribution[rating],
    }));
  }, []);

  // 2. Average rating per product (top 10)
  const productRatings = useMemo(() => {
    const ratingMap = new Map();
    reviews.forEach((review) => {
      const { productId, rating } = review;
      if (ratingMap.has(productId)) {
        const data = ratingMap.get(productId);
        data.total += rating;
        data.count += 1;
      } else {
        ratingMap.set(productId, { total: rating, count: 1 });
      }
    });
    const result = Array.from(ratingMap, ([productId, data]) => ({
      productId,
      productName: getProductName(productId),
      averageRating: data.total / data.count,
      reviewCount: data.count,
    }));
    result.sort((a, b) => b.averageRating - a.averageRating);
    return result.slice(0, 10);
  }, []);

  // 3. Review volume over time (group by date)
  const reviewsOverTime = useMemo(() => {
    const dateMap = new Map();
    reviews.forEach((review) => {
      const date = formatDate(review.createdAt);
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });
    const sorted = Array.from(dateMap, ([date, count]) => ({ date, count }));
    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted;
  }, []);

  // 4. Top reviewers (users with most reviews)
  const topReviewers = useMemo(() => {
    const reviewerMap = new Map();
    reviews.forEach((review) => {
      const { buyerId } = review;
      reviewerMap.set(buyerId, (reviewerMap.get(buyerId) || 0) + 1);
    });
    const result = Array.from(reviewerMap, ([userId, reviewCount]) => ({
      userId,
      userName: getUserName(userId),
      reviewCount,
    }));
    result.sort((a, b) => b.reviewCount - a.reviewCount);
    return result.slice(0, 10);
  }, []);

  // 5. Reviews per store (by product store)
  const storeReviews = useMemo(() => {
    const storeMap = new Map();
    reviews.forEach((review) => {
      const storeName = review.orderInfo?.storeInfoStoreName || "Unknown Store";
      storeMap.set(storeName, (storeMap.get(storeName) || 0) + 1);
    });
    return Array.from(storeMap, ([name, count]) => ({ name, count })).sort(
      (a, b) => b.count - a.count,
    );
  }, []);

  // 6. Average rating per store (top 5)
  const storeAvgRating = useMemo(() => {
    const storeData = new Map(); // storeName -> { totalRating, count }
    reviews.forEach((review) => {
      const storeName = review.orderInfo?.storeInfoStoreName || "Unknown Store";
      const rating = review.rating;
      if (storeData.has(storeName)) {
        const data = storeData.get(storeName);
        data.totalRating += rating;
        data.count += 1;
      } else {
        storeData.set(storeName, { totalRating: rating, count: 1 });
      }
    });
    const result = Array.from(storeData, ([name, data]) => ({
      name,
      averageRating: data.totalRating / data.count,
    }));
    result.sort((a, b) => b.averageRating - a.averageRating);
    return result.slice(0, 5);
  }, []);

  // Summary metrics
  const totalReviews = reviews.length;
  const averageRatingOverall =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (totalReviews || 1);
  const fiveStarPercentage =
    ((ratingDistribution.find((r) => r.rating === "5 Stars")?.count || 0) /
      totalReviews) *
    100;
  const uniqueReviewers = new Set(reviews.map((r) => r.buyerId)).size;
  const uniqueProductsReviewed = new Set(
    reviews.map((r) => r.orderInfo?.productId),
  ).size;

  // Colors for pie chart
  const COLORS = ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA"];

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
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-purple-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Total Reviews
              </p>
              <p className="text-3xl font-bold text-gray-800">{totalReviews}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-yellow-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Avg. Rating
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {averageRatingOverall.toFixed(1)} ⭐
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-green-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Unique Reviewers
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {uniqueReviewers}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-blue-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Products Reviewed
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {uniqueProductsReviewed}
              </p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Rating Distribution (Pie Chart) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                📊 Rating Distribution
              </h2>
              <div className="text-sm text-gray-500 mb-2">
                5-star reviews: {fiveStarPercentage.toFixed(1)}%
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ rating, percent }) =>
                      `${rating}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} reviews`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top 10 Products by Average Rating */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                🏆 Top Rated Products
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={productRatings}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis
                    type="category"
                    dataKey="productName"
                    width={130}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(value) => formatRating(value)} />
                  <Legend />
                  <Bar
                    dataKey="averageRating"
                    fill="#F59E0B"
                    name="Avg Rating (out of 5)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Reviews Over Time (Line Chart) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                📅 Review Volume Over Time
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={reviewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip labelFormatter={(label) => `Date: ${label}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    name="Number of Reviews"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Reviewers */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                👥 Top Reviewers
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={topReviewers}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="userName"
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="reviewCount"
                    fill="#10B981"
                    name="Reviews Written"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Reviews per Store */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                🏪 Reviews by Store
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={storeReviews} margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8B5CF6"
                    name="Number of Reviews"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Average Rating per Store */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                ⭐ Average Rating by Store
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={storeAvgRating} margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis domain={[0, 5]} tickCount={6} />
                  <Tooltip formatter={(value) => formatRating(value)} />
                  <Legend />
                  <Bar
                    dataKey="averageRating"
                    fill="#EC4899"
                    name="Avg Rating"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Optional: Detailed review list (latest 5) */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              📝 Latest Reviews
            </h2>
            <div className="space-y-4">
              {reviews
                .slice(-5)
                .reverse()
                .map((review) => (
                  <div key={review._id} className="border-b pb-3 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {getUserName(review.buyerId)}
                      </span>
                      <span className="text-yellow-500">
                        {"⭐".repeat(Math.floor(review.rating))}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({review.rating})
                      </span>
                    </div>
                    <p className="text-gray-700 italic">"{review.feedback}"</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Product: {getProductName(review.orderInfo?.productId)} |{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              {reviews.length === 0 && (
                <p className="text-gray-500">No reviews available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
