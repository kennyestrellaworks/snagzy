import { useState } from "react";
import {
  Calendar,
  CreditCard,
  IoIosArrowDown,
  LuShoppingBasket,
  Package,
  PiMoney,
  Truck,
  User,
} from "../../components/SVG";
import { useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { IconedEmail, IconedPhone } from "../../components/IconedValue";
import { dateFormatter } from "../../utils/helpers";
import { PaymentStatusBadge } from "../../components/PaymentStatusBadge";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import {
  ItemStatusBadge,
  OrderVariantAttributeBadege,
  ProductVariantAttributeBadge,
  StoreDetailBadge,
  StoreDetailBadgeSmall,
  VariantBadge,
} from "../../components/Badges";
import { ImageDoubleExtraSmall, ImageMedium } from "../../components/Image";
import { ProductNameNAttributes } from "../../components/ProductNameNAttributes";
import { TimelineCircle } from "../../components/Timeline/TimelineCircle";
import { TimelineCard } from "../../components/Timeline/TimelineCard";

export const Order = () => {
  const { orderId } = useParams();
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(true);
  const { getOrderById, sumOrderQuantities, getAllAttributes } = useData();

  const order = getOrderById(orderId);
  // console.log("order", order);

  const attributes = getAllAttributes();

  // Total quantity of this order.
  const totalQuanity = sumOrderQuantities(order.orderedItems);

  // Hide/show Product summary area.
  const toggleSidebar = () => setOrderSummaryOpen(!orderSummaryOpen);

  // Placed at date.
  // const placedTimestamp =
  //   order.timeline?.find((t) => t.slug === "order_placed")?.timestamp || null;
  // const placedAt = dateFormatter(placedTimestamp);

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="flex w-full z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          {/* Header  */}
          <div className="flex gap-2 justify-between pb-2">
            <h1>Order Summary</h1>
            <div className="flex items-center gap-1">
              {/* Collapse button  */}
              <button
                onClick={toggleSidebar}
                className={`flex ${orderSummaryOpen ? "bg-gray-200" : "bg-gray-100"} rounded px-1 py-1 hover:bg-gray-200 cursor-pointer`}
              >
                <IoIosArrowDown
                  height={16}
                  width={16}
                  className={`${orderSummaryOpen ? "rotate-180" : ""} transition-all duration-300 ease-in-out`}
                />
              </button>
              {/* Collapse button ends */}
            </div>
          </div>
          {/* Summary  */}
          <div
            className={`grid grid-cols-[1.6fr_2fr_1.6fr_1.6fr_1.6fr] gap-2 w-full overflow-hidden`}
          >
            {/* Order detail box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${orderSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col">
                <div className="flex items-center text-gray-600">
                  <Package height={16} width={16} />
                  <h1 className="ml-1 text-[14px] font-semibold">Order</h1>
                </div>
                <div className="flex flex-col gap-1 mt-4 text-[14px]">
                  <div className="flex flex-col leading-tight">
                    <p className="text-xs text-gray-500 font-thin">Order ID</p>
                    <p className="text-gray-700">{order._id || "—"}</p>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <p className="text-xs text-gray-500 font-thin">Orders</p>
                    <p className="text-gray-700">
                      {`${order.orderedItems.length} ${
                        order.orderedItems.length < 2 ? "Product" : "Products"
                      }`}
                    </p>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <p className="text-xs text-gray-500 font-thin">Quantity</p>
                    <p className="text-gray-700">
                      {`${totalQuanity} ${totalQuanity < 2 ? "Item" : "Items"}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Buyer detail box */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${orderSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col">
                <div className="flex items-center text-gray-600">
                  <User height={16} width={16} />
                  <h1 className="ml-1 text-[14px] font-semibold">Buyer</h1>
                </div>
                <div className="flex gap-2 mt-4 text-[14px]">
                  <div className="flex">
                    <img
                      className="shrink-0 w-8 h-8 rounded-full"
                      src={order.buyerInfo.image || ""}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-500 font-thin">
                        Name
                      </div>
                      <p className="text-gray-700">
                        {order.buyerInfo.buyerFirstName +
                          " " +
                          order.buyerInfo.buyerLastName || "—"}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-500 font-thin">
                        Contact
                      </div>
                      <IconedEmail data={order.buyerInfo.email} />
                      <IconedPhone data={order.buyerInfo.phone} />
                    </div>
                    {/* <div className="flex flex-col">
                      <div className="text-xs text-gray-500 font-thin">
                        Date Ordered
                      </div>
                      <p className="text-gray-700">{placedAt || "—"}</p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            {/* Shipping box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${orderSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col">
                <div className="flex items-center text-gray-600">
                  <Truck height={16} width={16} />
                  <h1 className="ml-1 text-[14px] font-semibold">Shipping</h1>
                </div>
                <div className="flex flex-col gap-1 mt-4 text-[14px]">
                  <div className="flex flex-col leading-tight">
                    <p className="text-xs text-gray-500 font-thin">
                      Shipping Address
                    </p>
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-700">
                        {order.buyerInfo.shippingInfo.address.addressLine1 ||
                          ""}{" "}
                        {order.buyerInfo.shippingInfo.address.addressLine2 ||
                          ""}{" "}
                        {order.buyerInfo.shippingInfo.address.city || ""}{" "}
                        {order.buyerInfo.shippingInfo.address.stateOrProvince ||
                          ""}
                        , {order.buyerInfo.shippingInfo.address.barangay || ""}{" "}
                        {order.buyerInfo.shippingInfo.address.zipCode || ""}{" "}
                        {order.buyerInfo.shippingInfo.address.country || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Payment box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${orderSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col">
                <div className="flex items-center text-gray-600">
                  <CreditCard height={16} width={16} />
                  <h1 className="ml-1 text-[14px] font-semibold">Payment</h1>
                </div>
                <div className="flex flex-col gap-1 mt-4 text-[14px]">
                  <div className="flex flex-col leading-tight">
                    <p className="text-xs text-gray-500 font-thin">
                      Payment Method
                    </p>
                    <div className="flex items-start">
                      <p className="text-gray-700 bg-amber-200 px-2 rounded border border-amber-400">
                        {order.paymentInfo.method}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <p className="text-xs text-gray-500 font-thin">
                      Payment Status
                    </p>
                    <div className="flex text-gray-700 gap-2">
                      <PaymentStatusBadge status={order.paymentInfo} />
                      {dateFormatter(order.paymentInfo.paidAt)}
                    </div>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <p className="text-xs text-gray-500 font-thin">
                      Transaction ID
                    </p>
                    <p className="text-gray-700">
                      {order.paymentInfo.transactionId || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Sales box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${orderSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col">
                <div className="flex items-center text-gray-600">
                  <PiMoney height={16} width={16} />
                  <h1 className="ml-1 text-[14px] font-semibold">Sales</h1>
                </div>
                <div className="flex flex-col gap-1 mt-4 text-[14px]">
                  <div className="flex flex-col leading-tight">
                    <p>
                      <span className="text-xs text-gray-500 font-thin">
                        Sub Total{" "}
                      </span>
                      <span className="text-gray-700 ml-2">
                        ${order.summary.itemsTotalPrice.toFixed(2) || "0.00"}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <p>
                      <span className="text-xs text-gray-500 font-thin">
                        Shipping Fee
                      </span>
                      <span className="text-gray-700 ml-2">
                        ${order.summary.shippingFee.toFixed(2) || "0.00"}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <p>
                      <span className="text-xs text-gray-500 font-thin">
                        Discount
                      </span>
                      <span className="text-gray-700 ml-2">
                        ${order.summary.discount.toFixed(2) || "0.00"}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <p>
                      <span className="text-xs text-gray-500 font-thin">
                        Total Amount
                      </span>
                      <span className="text-gray-700 ml-2">
                        ${order.summary.orderTotalPrice.toFixed(2) || "0.00"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-gray-100">
        <div className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <div className="grid grid-cols-[6fr_3fr] p-4 gap-4 min-w-400 mx-auto">
            {/* Grid 1  */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                {/* Header  */}
                <div className="flex justify-between">
                  <div className="flex items-center text-gray-600">
                    <LuShoppingBasket height={20} width={20} />
                    <h1 className="ml-1 text-[16px]">Ordered Items</h1>
                  </div>
                  <div className="flex items-center text-gray-600 gap-2">
                    <h1 className="ml-1 text-[15px]">Order Status</h1>
                    <OrderStatusBadge status={order.currentStatus.slug} />
                  </div>
                </div>
                {/* Ordered items  */}
                <div className="flex flex-col gap-2 mt-4">
                  {order.orderedItems.map((orderedItem, orderedItemIndex) => {
                    const displayName = [
                      orderedItem.productName,
                      ...orderedItem.variant.attributeOptions.map(
                        (option) => option.value,
                      ),
                    ].join(" | ");

                    return (
                      <div
                        key={orderedItemIndex}
                        className="grid grid-cols-[5fr_1fr] w-full justify-between bg-gray-100 gap-20 p-2"
                      >
                        {/* Grid 1 box 1  */}
                        <div className="flex flex-col text-sm">
                          <div className="flex gap-2">
                            <VariantBadge id={orderedItem.variant._id} />
                            <ItemStatusBadge
                              statusId={orderedItem.variant.status}
                            />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <ImageMedium
                              image={orderedItem.variant.primaryImage}
                              alt={orderedItem.productName}
                              type="square"
                            />
                            <div className="flex flex-col">
                              <h1 className="font-semibold text-md leading-tight">
                                {displayName}
                              </h1>
                              <p className="leading-tight">
                                {orderedItem.description}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <div className="flex">
                                  <StoreDetailBadgeSmall
                                    type="store-name"
                                    content={
                                      orderedItem.variant.storeInfo.storeName ||
                                      ""
                                    }
                                  />
                                </div>
                                <div className="flex gap-2 text-xs text-gray-600">
                                  {orderedItem.variant.attributeOptions.map(
                                    (option, index) => {
                                      return (
                                        <OrderVariantAttributeBadege
                                          key={index}
                                          option={option}
                                          index={index}
                                          attributes={attributes}
                                        />
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Grid 1 box 2  */}
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex flex-col items-end">
                            <p className="text-gray-500">Price: </p>
                            <p className="text-gray-500">Qty: </p>
                            <p>Total: </p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-gray-500">
                              <strong>
                                $
                                {orderedItem.variant.price.toFixed(2) || "0.00"}
                              </strong>
                            </p>
                            <p className="text-gray-500">
                              <strong>{orderedItem.variant.quantity}</strong>
                            </p>
                            <p>
                              <strong>
                                $
                                {orderedItem.variant.subTotal.toFixed(2) ||
                                  "0.00"}
                              </strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Order total  */}
                <div className="flex">
                  <div className="grid grid-cols-[1fr_1fr] w-full mt-4">
                    <div className="flex flex-col text-lg">
                      <p>Sub Total:</p>
                      <p className="text-gray-500">Shipping Fee:</p>
                      <p className="text-gray-500">Discount:</p>
                    </div>
                    <div className="flex flex-col text-lg items-end">
                      <p className="font-semibold">
                        ${order.summary.itemsTotalPrice.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-gray-500">
                        ${order.summary.shippingFee.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-gray-500">
                        ${order.summary.discount.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex mt-4 border-t-2 border-gray-300">
                  <div className="grid grid-cols-[1fr_1fr] w-full mt-2">
                    <div className="flex flex-col text-lg">
                      <p>Order Total:</p>
                    </div>
                    <div className="flex flex-col text-2xl items-end">
                      <p className="font-semibold">
                        ${order.summary.orderTotalPrice.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Grid 2  */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                {/* Header  */}
                <div className="flex items-center text-gray-600">
                  <Calendar height={20} width={20} />
                  <h1 className="ml-1 text-[16px]">Timeline</h1>
                </div>
                {/* Timeline  */}
                <div className="relative w-full mt-4">
                  <div className="flex flex-col gap-2">
                    {order.timeline.map((item, index) => {
                      const hasVerticalLine =
                        order.timeline.length !== index + 1;
                      console.log("hasVerticalLine", hasVerticalLine);
                      return (
                        <div key={index} className="grid grid-cols-[.8fr_3fr]">
                          <TimelineCircle
                            item={item}
                            hasVerticalLine={hasVerticalLine}
                          />
                          <TimelineCard item={item} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
