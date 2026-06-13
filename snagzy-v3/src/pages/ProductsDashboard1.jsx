import React, { useMemo } from "react";
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
import { orders } from "../data/orders";
import { products } from "../data/products";
import { reviews } from "../data/reviews";

// Helper: Format currency (USD)
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

// Helper: Get product name by ID
const getProductName = (productId) => {
  const product = products.find((p) => p._id === productId);
  return product ? product.name : "Unknown Product";
};

export const ProductsDashboard1 = () => {
  // Process sales data from orders
  const productSalesData = useMemo(() => {
    const salesMap = new Map(); // productId -> { quantity, revenue }

    orders.forEach((order) => {
      order.orderedItems.forEach((item) => {
        const { productId, variant } = item;
        const quantity = variant.quantity;
        const revenue = variant.subTotal;

        if (salesMap.has(productId)) {
          const existing = salesMap.get(productId);
          existing.quantity += quantity;
          existing.revenue += revenue;
        } else {
          salesMap.set(productId, {
            quantity,
            revenue,
            productName: getProductName(productId),
          });
        }
      });
    });

    // Convert to array and sort by revenue (desc)
    const salesArray = Array.from(salesMap, ([productId, data]) => ({
      productId,
      ...data,
    }));
    salesArray.sort((a, b) => b.revenue - a.revenue);
    return salesArray;
  }, []);

  // Process ratings data from reviews
  const productRatings = useMemo(() => {
    const ratingMap = new Map(); // productId -> { totalRating, count }

    reviews.forEach((review) => {
      const { productId, rating } = review;
      if (ratingMap.has(productId)) {
        const existing = ratingMap.get(productId);
        existing.totalRating += rating;
        existing.count += 1;
      } else {
        ratingMap.set(productId, { totalRating: rating, count: 1 });
      }
    });

    // Compute average rating for each product
    const ratingsArray = Array.from(ratingMap, ([productId, data]) => ({
      productId,
      productName: getProductName(productId),
      averageRating: data.totalRating / data.count,
      reviewCount: data.count,
    }));
    ratingsArray.sort((a, b) => b.averageRating - a.averageRating);
    return ratingsArray;
  }, []);

  // Calculate low stock products (stock <= 5)
  const lowStockProducts = useMemo(() => {
    const lowStock = [];
    products.forEach((product) => {
      product.variants.forEach((variant) => {
        if (variant.stock <= 5) {
          lowStock.push({
            productName: product.name,
            variantSku: variant.sku,
            stock: variant.stock,
            price: variant.displayedPrice,
          });
        }
      });
    });
    return lowStock;
  }, []);

  // Top 10 products by revenue
  const topRevenueProducts = productSalesData.slice(0, 10);

  // Top 10 products by quantity sold
  const topQuantityProducts = [...productSalesData]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  // Data for category pie chart (count of products per store category? We'll use store names from products)
  const storeProductCounts = useMemo(() => {
    const storeMap = new Map();
    products.forEach((product) => {
      const storeName = product.storeOwnerInfo?.storeId
        ? `Store ${product.storeOwnerInfo.storeId.slice(-6)}`
        : "Unknown Store";
      storeMap.set(storeName, (storeMap.get(storeName) || 0) + 1);
    });
    return Array.from(storeMap, ([name, value]) => ({ name, value }));
  }, []);

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
    "#FF6B6B",
  ];

  // Summary Metrics
  const totalRevenue = productSalesData.reduce((sum, p) => sum + p.revenue, 0);
  const totalItemsSold = productSalesData.reduce(
    (sum, p) => sum + p.quantity,
    0,
  );
  const totalProductsSold = productSalesData.length;
  const averageRatingOverall =
    productRatings.reduce((sum, r) => sum + r.averageRating, 0) /
    (productRatings.length || 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        📊 Products Analytics
      </h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-blue-500">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Total Revenue
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-green-500">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Items Sold
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {totalItemsSold.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-yellow-500">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Products Sold (SKU)
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {totalProductsSold}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-purple-500">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Avg. Product Rating
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {averageRatingOverall.toFixed(1)} ⭐
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top 10 Products by Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            💰 Top 10 Products by Revenue
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={topRevenueProducts}
              layout="vertical"
              margin={{ left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                type="category"
                dataKey="productName"
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Products by Quantity Sold */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            📦 Top 10 Products by Quantity Sold
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={topQuantityProducts}
              layout="vertical"
              margin={{ left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="productName"
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#10B981" name="Quantity Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Rated Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            ⭐ Top Rated Products
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={productRatings.slice(0, 10)}
              layout="vertical"
              margin={{ left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis
                type="category"
                dataKey="productName"
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => `${value.toFixed(1)} / 5`} />
              <Legend />
              <Bar
                dataKey="averageRating"
                fill="#F59E0B"
                name="Average Rating"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Products per Store (Pie Chart) */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            🏪 Product Distribution by Store
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={storeProductCounts}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {storeProductCounts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} products`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          ⚠️ Low Stock Alert (Stock ≤ 5)
        </h2>
        {lowStockProducts.length === 0 ? (
          <p className="text-gray-500">No low stock items found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variant SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockProducts.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.variantSku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
