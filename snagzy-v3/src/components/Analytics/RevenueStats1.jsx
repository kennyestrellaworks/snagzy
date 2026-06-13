import { useState, useMemo, useEffect, useRef } from "react";
import { useData } from "../../context/DataContext";
import { IoIosArrowDown } from "../../components/SVG";
import {
  DollarSign,
  FaEye,
  TbCalendarDollar,
  TbCurrencyDollarOff,
} from "../../components/SVG";
import { MediumAnalyticsStatCard } from "../../components/Analytics/AnalyticsStatCards";
import {
  successfulOrderStatuses,
  pendingOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../../data/orderLifeCycle";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import {
  OrderIdBadge,
  PersonIdBadge,
  VariantBadge,
  ItemStatusBadge,
  OrderVariantAttributeBadege,
} from "../../components/Badges";
import { ImageDoubleExtraSmall } from "../../components/Image";
import { IconedEmail } from "../../components/IconedValue";
import { OrderPlacedUpdated } from "../../components/DateBoxed";
import { AmountFormat, AmountFormatSmall } from "../../components/AmountFormat";
import { TextNormal } from "../../components/Text";
import { PaymentStatusBadge } from "../../components/PaymentStatusBadge";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { dateFormatter } from "../../utils/helpers";
import { Link, useLocation } from "react-router-dom";
import { NoSomethingSmall } from "../../components/NoSomething";

// Import uniform action buttons matching project structural components
import { LoadMoreProduct, LoadMoreVariant } from "../../components/Button";

// Recharts imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ITEM_INCREMENT = 2;

// Sub-component for displaying chart
const RevenueOverTimeChart = ({
  totalSalesData,
  pendingSalesData,
  cancellationsData,
}) => {
  const chartData = useMemo(() => {
    const dataMap = {};

    const processOrders = (orders, key) => {
      if (!orders || !Array.isArray(orders)) return;
      orders.forEach((order) => {
        const dateStr = order.currentStatus?.timestamp;
        if (!dateStr) return;

        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return;

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const keyDate = `${year}-${month}-${day}`;

        // Tooltip long-form text (e.g., "Nov 4, 2024")
        const fullDateLabel = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        // X-Axis text (e.g., "Nov 4")
        const xAxisLabel = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        const amount = Number(order.summary?.orderTotalPrice) || 0;

        if (!dataMap[keyDate]) {
          dataMap[keyDate] = {
            date: keyDate,
            label: xAxisLabel,
            fullDate: fullDateLabel,
            year: year,
            "Total Sales": 0,
            "Pending Sales": 0,
            Cancellations: 0,
          };
        }
        dataMap[keyDate][key] += amount;
      });
    };

    processOrders(totalSalesData?.ordersToProcess, "Total Sales");
    processOrders(pendingSalesData?.ordersToProcess, "Pending Sales");
    processOrders(cancellationsData?.ordersToProcess, "Cancellations");

    return Object.values(dataMap).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [totalSalesData, pendingSalesData, cancellationsData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (chartData.length === 0) return null;

  // console.log("chartData", chartData);

  return (
    <div className="w-full mt-4 p-3 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800">
          Revenue Over Time
        </h2>
        <p className="text-xs text-gray-500">
          Daily pipeline analytics broken down across statuses
        </p>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 15 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            {/* XAxis with dynamic interval checking to stop dense overlaps */}
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              stroke="#9CA3AF"
              fontSize={11}
              interval="preserveStartEnd"
              minTickGap={45}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#9CA3AF"
              fontSize={11}
              tickFormatter={formatCurrency}
            />
            {/* Tooltip mapping directly to the formatted fullDate label */}
            <Tooltip
              labelKey="fullDate"
              labelFormatter={(label, items) => {
                // Extracts fullDate (e.g. "Nov 4, 2024") from the hovered item dataset
                return items?.[0]?.payload?.fullDate || label;
              }}
              formatter={(value, name) => [formatCurrency(value), name]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "0.375rem",
              }}
            />
            <Legend
              verticalAlign="top"
              height={32}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Bar dataKey="Total Sales" fill="#10B981" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Pending Sales" fill="#F59E0B" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Cancellations" fill="#EF4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const RevenueStats1 = ({
  processOrderLifeCycleData,
  analyticsData,
  activeTab,
  onTabChange,
  ordersLimit,
  setOrdersLimit,
  itemsLimits,
  setItemsLimits,
  defaultItemsCount = 3,
  count = 6,
}) => {
  const [revenueStatsOpen, setRevenueStatsOpen] = useState(true);
  const { sumOrderQuantities, getAllAttributes } = useData();

  const attributes = getAllAttributes();
  const location = useLocation();

  // Track previous analyticsData to detect filter changes
  const prevAnalyticsDataRef = useRef(analyticsData);

  // console.log("analyticsData", analyticsData);

  const toggleRevenueStats = () => setRevenueStatsOpen(!revenueStatsOpen);

  // Reset pagination when filters change (analyticsData reference changes)
  useEffect(() => {
    if (prevAnalyticsDataRef.current !== analyticsData) {
      setOrdersLimit(count);
      setItemsLimits({});
      prevAnalyticsDataRef.current = analyticsData;
    }
  }, [analyticsData, count, setOrdersLimit, setItemsLimits]);

  // Pre-process data for each card
  const totalSalesData = processOrderLifeCycleData(
    successfulOrderStatuses,
    analyticsData,
  );

  const pendingSalesData = processOrderLifeCycleData(
    pendingOrderStatuses,
    analyticsData,
  );

  const cancellationsData = processOrderLifeCycleData(
    unsuccessfulOrderStatuses,
    analyticsData,
  );

  // Get the order data based on active tab
  const getOrderData = () => {
    switch (activeTab) {
      case "total-sales":
        return totalSalesData.ordersToProcess;
      case "pending-sales":
        return pendingSalesData.ordersToProcess;
      case "cancellations":
        return cancellationsData.ordersToProcess;
      default:
        return totalSalesData.ordersToProcess;
    }
  };

  const orderData = getOrderData();

  const tableHeaderBg = useMemo(() => {
    switch (activeTab) {
      case "total-sales":
        return "#7BF1A8"; // green-800
      case "pending-sales":
        return "#FFD230"; // amber-800
      case "cancellations":
        return "#F8A5A5"; // red-800
      default:
        return "#7BF1A8";
    }
  }, [activeTab]);

  // Paginate and sort the orders by the latest currentStatus.timestamp
  const displayedOrders = useMemo(() => {
    return [...orderData]
      .sort((a, b) => {
        const dateA = new Date(a.currentStatus?.timestamp || 0);
        const dateB = new Date(b.currentStatus?.timestamp || 0);
        return dateB - dateA;
      })
      .slice(0, ordersLimit);
  }, [orderData, ordersLimit]);

  const handleLoadMoreOrders = () => {
    const totalOrdersCount = orderData.length;
    const nextLimit = Math.min(ordersLimit + count, totalOrdersCount);
    setOrdersLimit(nextLimit);
  };

  const handleLoadMoreItems = (orderId, totalItems) => {
    const currentLimit = itemsLimits[orderId] || defaultItemsCount;
    const nextLimit = Math.min(currentLimit + ITEM_INCREMENT, totalItems);
    setItemsLimits((prev) => ({ ...prev, [orderId]: nextLimit }));
  };

  const handleResetItems = (orderId) => {
    setItemsLimits((prev) => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex">
        <div
          className={`${revenueStatsOpen ? "h-full" : "h-15"} bg-gray-50 w-full p-3 border border-[#C2C2C2] rounded-md transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <div className="flex relative items-center justify-between">
            <div className="flex">
              <h1 className="font-semibold text-md">Revenue Stats</h1>
            </div>

            <div className="flex gap-6 border-gray-300 items-center">
              <div className="flex">
                <button
                  onClick={toggleRevenueStats}
                  className={`flex ${revenueStatsOpen ? "bg-gray-200" : "bg-gray-100"} rounded px-1 py-1 hover:bg-gray-200 cursor-pointer`}
                >
                  <IoIosArrowDown
                    height={16}
                    width={16}
                    className={`${revenueStatsOpen ? "rotate-180" : ""} transition-all duration-300 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </div>

          {revenueStatsOpen && (
            <>
              {/* Tab buttons as stat cards */}
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 mt-4 cursor-pointer">
                <div onClick={() => onTabChange("total-sales")}>
                  <MediumAnalyticsStatCard
                    miniAnalyticsData={totalSalesData}
                    boxTitle={"Total Sales"}
                    boxStyle={`bg-green-100 border-green-500 ${
                      activeTab === "total-sales"
                        ? "ring-2 ring-green-500 ring-offset-2"
                        : ""
                    } transition-all duration-200`}
                    icon={DollarSign}
                    iconStyle={"bg-green-600 text-white"}
                    amountStyle={"text-green-600"}
                  />
                </div>

                <div onClick={() => onTabChange("pending-sales")}>
                  <MediumAnalyticsStatCard
                    miniAnalyticsData={pendingSalesData}
                    boxTitle={"Pending Sales"}
                    boxStyle={`bg-amber-100 border-amber-400 ${
                      activeTab === "pending-sales"
                        ? "ring-2 ring-amber-500 ring-offset-2"
                        : ""
                    } transition-all duration-200`}
                    icon={TbCalendarDollar}
                    iconStyle={"bg-amber-600 text-white"}
                    amountStyle={"text-amber-600"}
                  />
                </div>

                <div onClick={() => onTabChange("cancellations")}>
                  <MediumAnalyticsStatCard
                    miniAnalyticsData={cancellationsData}
                    boxTitle={"Cancellations"}
                    boxStyle={`bg-red-100 border-red-400 ${
                      activeTab === "cancellations"
                        ? "ring-2 ring-red-500 ring-offset-2"
                        : ""
                    } transition-all duration-200`}
                    icon={TbCurrencyDollarOff}
                    iconStyle={"bg-red-600 text-white"}
                    amountStyle={"text-red-600"}
                  />
                </div>
              </div>
              {/* Tab buttons ends */}

              {/* Render Revenue Over Time Visualizer */}
              <RevenueOverTimeChart
                totalSalesData={totalSalesData}
                pendingSalesData={pendingSalesData}
                cancellationsData={cancellationsData}
              />

              {/* Table Section */}
              <div className="flex w-full mt-6 overflow-hidden">
                <div className="flex flex-col w-full">
                  {/* Table header */}
                  <div
                    className="w-full top-0 z-30 bg-blue-100 border rounded-t-md"
                    style={{
                      borderColor: `${tableHeaderBg}80`,
                    }}
                  >
                    <div className="flex flex-col w-full overflow-hidden">
                      <div className="flex w-full justify-between bg-white">
                        <div
                          className={`grid grid-cols-[3fr_6fr_5fr] w-full text-sm`}
                          style={{
                            backgroundColor: `${tableHeaderBg}50`,
                          }}
                        >
                          <div
                            className={`flex border-r p-1`}
                            style={{
                              borderColor: `${tableHeaderBg}`,
                            }}
                          >
                            Order Detail
                          </div>
                          <div className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full text-sm">
                            <div
                              className={`flex border-r p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}`,
                              }}
                            >
                              Ordered Items
                            </div>
                            <div
                              className={`flex border-r p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}`,
                              }}
                            >
                              Listed Price
                            </div>
                            <div
                              className={`flex border-r p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}`,
                              }}
                            >
                              Qty
                            </div>
                            <div
                              className={`flex border-r p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}`,
                              }}
                            >
                              Sub Total
                            </div>
                          </div>
                          <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full text-sm">
                            <div
                              className={`flex border-r p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}`,
                              }}
                            >
                              Less
                            </div>
                            <div
                              className={`flex border-r p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}`,
                              }}
                            >
                              Shipping
                            </div>
                            <div
                              className={`flex border-r p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}`,
                              }}
                            >
                              Overall Price
                            </div>
                            <div
                              className={`flex border-r p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}80`,
                              }}
                            >
                              Payment Status
                            </div>
                            <div
                              className={`flex border-r p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}80`,
                              }}
                            >
                              Order Status
                            </div>
                            <div
                              className={`flex p-1`}
                              style={{
                                borderColor: `${tableHeaderBg}80`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div
                          className={`flex w-2 bg-blue-100`}
                          style={{
                            backgroundColor: `${tableHeaderBg}50`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {/* Table header ends */}

                  {/* Table Body */}
                  <div className="flex h-180 w-full overflow-y-auto border-l border-r border-b rounded-b-md border-gray-200 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                    <div className="flex flex-col w-full">
                      {displayedOrders.length === 0 ? (
                        <div className="flex items-center w-full h-100">
                          <LengthIsZeroError
                            title="No data found"
                            message="No orders found for this category"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col w-full">
                          {displayedOrders.map((order, orderIndex) => {
                            const totalQuantity = sumOrderQuantities(
                              order.orderedItems,
                            );

                            const itemsTotalCount =
                              order.orderedItems?.length || 0;
                            const orderItemsLimit =
                              itemsLimits[order._id] || defaultItemsCount;
                            const displayedOrderedItems = (
                              order.orderedItems || []
                            ).slice(0, orderItemsLimit);

                            const isShowingAllItems =
                              orderItemsLimit >= itemsTotalCount;
                            const showNestedLoadMore =
                              itemsTotalCount > defaultItemsCount;
                            const remainingItems =
                              itemsTotalCount - orderItemsLimit;
                            const itemsButtonLabel = isShowingAllItems
                              ? "Less"
                              : `More +${remainingItems}`;

                            return (
                              <div
                                key={order._id || orderIndex}
                                className="grid grid-cols-[3fr_11fr] w-full text-sm hover:bg-gray-50 transition-colors border-b border-gray-300 last:border-b-0"
                              >
                                {/* Grid 1 - Order Detail (Left Column) */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <div className="flex flex-col items-start gap-2">
                                    <div className="flex items-start">
                                      <OrderIdBadge id={order._id} />
                                    </div>
                                    <div className="flex gap-2">
                                      <ImageDoubleExtraSmall
                                        image={order.buyerInfo?.image}
                                        alt={
                                          order.buyerInfo?.buyerFirstName +
                                            " " +
                                            order.buyerInfo?.buyerLastName ||
                                          "—"
                                        }
                                        type="circle"
                                      />
                                      <div className="flex flex-col items-start gap-1">
                                        <h1 className="font-semibold text-lg leading-tight">
                                          {order.buyerInfo?.buyerFirstName +
                                            " " +
                                            order.buyerInfo?.buyerLastName ||
                                            "—"}
                                        </h1>
                                        <PersonIdBadge
                                          id={order.buyerInfo?.buyerId}
                                        />
                                        <IconedEmail
                                          data={order.buyerInfo?.email}
                                        />
                                        <OrderPlacedUpdated
                                          createdAt={order.createdAt}
                                          updatedAt={order.updatedAt}
                                        />
                                        <div className="flex text-sm leading-tight gap-2 mt-1">
                                          <div className="bg-gray-100 px-2 py-1 border border-gray-200 rounded-md">
                                            <span className="text-gray-500">
                                              Items:
                                            </span>{" "}
                                            <span className="font-semibold">
                                              {itemsTotalCount}
                                            </span>
                                          </div>
                                          <div className="bg-gray-100 px-2 py-1 border border-gray-200 rounded-md">
                                            <span className="text-gray-500">
                                              Quantity:
                                            </span>{" "}
                                            <span className="font-semibold">
                                              {totalQuantity}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Combined Structural Column Container (11fr) */}
                                <div className="flex flex-col w-full h-full">
                                  <div className="grid grid-cols-[6fr_5fr] w-full h-full">
                                    {/* Grid 2 - Ordered Items (Left Sub-column) */}
                                    <div className="flex flex-col h-full border-r border-gray-300">
                                      {itemsTotalCount === 0 ? (
                                        <div className="flex h-full items-center justify-center p-2">
                                          <NoSomethingSmall text="No data found" />
                                        </div>
                                      ) : (
                                        <div className="flex flex-col h-full">
                                          <div className="grow flex flex-col">
                                            {displayedOrderedItems.map(
                                              (orderedItem, itemIndex) => {
                                                const displayName = [
                                                  orderedItem.productName,
                                                  ...(
                                                    orderedItem.variant
                                                      ?.attributeOptions || []
                                                  ).map(
                                                    (option) => option.value,
                                                  ),
                                                ].join(" | ");

                                                return (
                                                  <div
                                                    key={itemIndex}
                                                    className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full border-b border-gray-200 last:border-b-0 grow items-start"
                                                  >
                                                    {/* Ordered Items descriptor info */}
                                                    <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                                      <div className="flex-col">
                                                        <div className="flex gap-2">
                                                          <VariantBadge
                                                            id={
                                                              orderedItem
                                                                .variant?._id
                                                            }
                                                          />
                                                          <ItemStatusBadge
                                                            statusId={
                                                              orderedItem
                                                                .variant?.status
                                                            }
                                                          />
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                          <ImageDoubleExtraSmall
                                                            image={
                                                              orderedItem
                                                                .variant
                                                                ?.primaryImage
                                                            }
                                                            alt={
                                                              orderedItem.productName
                                                            }
                                                            type="square"
                                                          />
                                                          <div className="flex flex-col">
                                                            <h1 className="font-semibold text-md leading-tight">
                                                              {displayName}
                                                            </h1>
                                                            <p className="leading-tight">
                                                              SKU:{" "}
                                                              {
                                                                orderedItem
                                                                  .variant?.sku
                                                              }
                                                            </p>
                                                            <div className="flex gap-2 mt-2">
                                                              <div className="flex gap-2 text-xs text-gray-600">
                                                                {orderedItem.variant?.attributeOptions?.map(
                                                                  (
                                                                    option,
                                                                    idx,
                                                                  ) => (
                                                                    <OrderVariantAttributeBadege
                                                                      key={idx}
                                                                      option={
                                                                        option
                                                                      }
                                                                      index={
                                                                        idx
                                                                      }
                                                                      attributes={
                                                                        attributes
                                                                      }
                                                                    />
                                                                  ),
                                                                )}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>

                                                    {/* Listed price box */}
                                                    <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                                      <AmountFormatSmall
                                                        amount={
                                                          orderedItem.variant
                                                            ?.price
                                                        }
                                                      />
                                                    </div>

                                                    {/* Quantity box */}
                                                    <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                                      <TextNormal
                                                        text={
                                                          orderedItem.variant
                                                            ?.quantity
                                                        }
                                                      />
                                                    </div>

                                                    {/* Sub total box */}
                                                    <div className="flex items-start p-2 h-full">
                                                      <AmountFormat
                                                        amount={
                                                          orderedItem.variant
                                                            ?.subTotal
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                );
                                              },
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Grid 3 - Summary and Actions Status Metrics (Right Sub-column) */}
                                    <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full h-full">
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <TextNormal
                                          text={order.summary?.discount || 0}
                                        />
                                      </div>
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <AmountFormatSmall
                                          amount={
                                            order.summary?.shippingFee || 0
                                          }
                                        />
                                      </div>
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <AmountFormat
                                          amount={
                                            order.summary?.orderTotalPrice || 0
                                          }
                                        />
                                      </div>
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <PaymentStatusBadge
                                          status={order.paymentInfo}
                                        />
                                      </div>
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <div className="flex flex-col gap-1">
                                          <OrderStatusBadge
                                            status={order.currentStatus?.slug}
                                          />
                                          <p className="text-[13px] leading-tight">
                                            {dateFormatter(
                                              order.currentStatus?.timestamp,
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-start p-2 h-full">
                                        <div className="flex items-start">
                                          <Link
                                            to={`/orders/${order._id}`}
                                            state={{
                                              backUrl:
                                                location.pathname +
                                                location.search +
                                                location.hash,
                                            }}
                                            className="cursor-pointer outline-0 text-gray-400 hover:text-gray-500 transition-all ease-in-out"
                                          >
                                            <FaEye height={16} width={16} />
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {showNestedLoadMore && (
                                    <div className="w-full flex items-center justify-center p-2 border-t border-gray-300 bg-gray-50 mt-auto">
                                      <LoadMoreVariant
                                        onClick={() => {
                                          if (isShowingAllItems) {
                                            handleResetItems(order._id);
                                          } else {
                                            handleLoadMoreItems(
                                              order._id,
                                              itemsTotalCount,
                                            );
                                          }
                                        }}
                                      >
                                        {itemsButtonLabel}
                                      </LoadMoreVariant>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {orderData.length > 0 &&
                        ordersLimit < orderData.length && (
                          <div className="flex items-center justify-center border-t border-gray-200 bg-white">
                            <div className="flex p-2">
                              <LoadMoreProduct onClick={handleLoadMoreOrders}>
                                Load more
                              </LoadMoreProduct>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
