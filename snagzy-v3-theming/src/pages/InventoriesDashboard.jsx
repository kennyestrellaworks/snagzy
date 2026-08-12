import { useMemo } from "react";
import { orders } from "../data/orders";
import { products } from "../data/products";

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
  ComposedChart,
} from "recharts";
import { PageHeader } from "../components/PageHeader";

// Helper: Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

// Helper: Get attribute display string
const getAttributeDisplay = (variant) => {
  if (!variant.attributeOptions || variant.attributeOptions.length === 0)
    return "Standard";
  return variant.attributeOptions
    .map((opt) => `${opt.attribute}: ${opt.value}`)
    .join(", ");
};

export const InventoriesDashboard = () => {
  // 1. Flatten all variants into an array with product info
  const allVariants = useMemo(() => {
    const variantsArray = [];
    products.forEach((product) => {
      product.variants.forEach((variant) => {
        variantsArray.push({
          ...variant,
          productId: product._id,
          productName: product.name,
          productSlug: product.slug,
          attributeDisplay: getAttributeDisplay(variant),
          // Use displayedPrice (after discount) or fallback to price
          price: variant.displayedPrice || variant.price,
        });
      });
    });
    return variantsArray;
  }, []);

  // 2. Aggregate sales data per variant (quantity sold and revenue)
  const variantSales = useMemo(() => {
    const salesMap = new Map(); // variantId -> { quantitySold, revenue, variant }

    orders.forEach((order) => {
      order.orderedItems.forEach((item) => {
        const variantId = item.variant._id;
        const quantity = item.variant.quantity;
        const revenue = item.variant.subTotal;

        if (salesMap.has(variantId)) {
          const existing = salesMap.get(variantId);
          existing.quantitySold += quantity;
          existing.revenue += revenue;
        } else {
          // Find the variant details from allVariants
          const variantDetails = allVariants.find((v) => v._id === variantId);
          salesMap.set(variantId, {
            variantId,
            variant: variantDetails,
            quantitySold: quantity,
            revenue,
          });
        }
      });
    });

    return Array.from(salesMap.values()).sort((a, b) => b.revenue - a.revenue);
  }, [allVariants]);

  // 3. Low stock variants (stock <= 5)
  const lowStockVariants = useMemo(() => {
    return allVariants
      .filter((v) => v.stock <= 5)
      .sort((a, b) => a.stock - b.stock);
  }, [allVariants]);

  // 4. Out of stock variants (stock === 0)
  const outOfStockVariants = useMemo(() => {
    return allVariants.filter((v) => v.stock === 0);
  }, [allVariants]);

  // 5. Stock distribution (buckets of stock levels)
  const stockDistribution = useMemo(() => {
    const ranges = [
      { label: "0 (Out of Stock)", min: 0, max: 0, count: 0 },
      { label: "1-5 (Critical)", min: 1, max: 5, count: 0 },
      { label: "6-10 (Low)", min: 6, max: 10, count: 0 },
      { label: "11-25 (Medium)", min: 11, max: 25, count: 0 },
      { label: "26-50 (High)", min: 26, max: 50, count: 0 },
      { label: "50+ (Very High)", min: 51, max: Infinity, count: 0 },
    ];

    allVariants.forEach((variant) => {
      const stock = variant.stock;
      const range = ranges.find((r) => stock >= r.min && stock <= r.max);
      if (range) range.count += 1;
    });

    return ranges;
  }, [allVariants]);

  // 6. Top selling variants (by quantity)
  const topSellingVariants = variantSales.slice(0, 10);

  // 7. Revenue per product (aggregated from variants)
  const productRevenue = useMemo(() => {
    const productMap = new Map(); // productId -> { revenue, quantitySold, productName }
    variantSales.forEach((sale) => {
      const productId = sale.variant?.productId;
      const productName = sale.variant?.productName || "Unknown";
      if (!productId) return;
      if (productMap.has(productId)) {
        const existing = productMap.get(productId);
        existing.revenue += sale.revenue;
        existing.quantitySold += sale.quantitySold;
      } else {
        productMap.set(productId, {
          productId,
          productName,
          revenue: sale.revenue,
          quantitySold: sale.quantitySold,
        });
      }
    });
    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [variantSales]);

  // 8. Inventory value per product (stock * price)
  const inventoryValue = useMemo(() => {
    const productValueMap = new Map(); // productId -> { value, productName, variantCount }
    allVariants.forEach((variant) => {
      const productId = variant.productId;
      const productName = variant.productName;
      const value = variant.stock * variant.price;
      if (productValueMap.has(productId)) {
        const existing = productValueMap.get(productId);
        existing.value += value;
        existing.variantCount += 1;
      } else {
        productValueMap.set(productId, {
          productId,
          productName,
          value,
          variantCount: 1,
        });
      }
    });
    return Array.from(productValueMap.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [allVariants]);

  // Summary metrics
  const totalVariants = allVariants.length;
  const totalStock = allVariants.reduce((sum, v) => sum + v.stock, 0);
  const totalInventoryValue = allVariants.reduce(
    (sum, v) => sum + v.stock * v.price,
    0,
  );
  const totalVariantsSold = variantSales.length;
  const totalItemsSold = variantSales.reduce(
    (sum, s) => sum + s.quantitySold,
    0,
  );
  const lowStockCount = lowStockVariants.length;
  const outOfStockCount = outOfStockVariants.length;

  // Colors for pie chart
  const COLORS = [
    "#EF4444",
    "#F59E0B",
    "#FBBF24",
    "#34D399",
    "#60A5FA",
    "#8B5CF6",
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

      <div>THIS</div>

      <div className="flex flex-col w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex flex-col w-full p-2 gap-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-blue-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Total Variants (SKU)
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {totalVariants}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-green-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Inventory Value
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {formatCurrency(totalInventoryValue)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-yellow-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Total Stock Units
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {totalStock.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-red-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Low / Out of Stock
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {lowStockCount} / {outOfStockCount}
              </p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Stock Distribution (Pie Chart) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                📊 Stock Level Distribution
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={stockDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ label, percent }) =>
                      `${label}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stockDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} variants`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top 10 Selling Variants */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                🏆 Top Selling Variants
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={topSellingVariants}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="variant.productName"
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(value) => `${value} units`} />
                  <Legend />
                  <Bar
                    dataKey="quantitySold"
                    fill="#10B981"
                    name="Units Sold"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Inventory Value by Product */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                💰 Inventory Value by Product
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={inventoryValue} margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="productName"
                    tick={{ fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" name="Inventory Value" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Product (from sales) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                📈 Revenue by Product (Sold)
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={productRevenue} margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="productName"
                    tick={{ fontSize: 10 }}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#F59E0B" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Table */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              ⚠️ Low Stock Alert (Stock ≤ 5)
            </h2>
            {lowStockVariants.length === 0 ? (
              <p className="text-gray-500">No low stock items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variant (SKU)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attributes
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
                    {lowStockVariants.map((variant) => (
                      <tr key={variant._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {variant.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.attributeDisplay}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                          {variant.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(variant.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Out of Stock Table */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              🚫 Out of Stock Variants
            </h2>
            {outOfStockVariants.length === 0 ? (
              <p className="text-gray-500">No out of stock items.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variant (SKU)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attributes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {outOfStockVariants.map((variant) => (
                      <tr key={variant._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {variant.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.attributeDisplay}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(variant.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* All Variants Summary Table (optional, paginated? Here just top 20) */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              📋 All Variants Summary (Top 20 by Stock Value)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allVariants
                    .sort((a, b) => b.stock * b.price - a.stock * a.price)
                    .slice(0, 20)
                    .map((variant) => (
                      <tr key={variant._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {variant.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {variant.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(variant.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatCurrency(variant.stock * variant.price)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {allVariants.length > 20 && (
              <p className="text-sm text-gray-400 mt-2">
                Showing top 20 of {allVariants.length} variants.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
