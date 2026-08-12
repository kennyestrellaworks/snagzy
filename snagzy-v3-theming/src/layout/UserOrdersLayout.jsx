import {
  Link,
  NavLink,
  Outlet,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/DataContext";

export const UserOrdersLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAllAttributes, sumOrderQuantities, getOrdersLayoutNavLinks } =
    useData();

  const { ordersByThisPerson } = useOutletContext();
  // console.log("orders", orders);

  const orders = ordersByThisPerson;
  const attributes = getAllAttributes();
  const ordersLayoutNavLinks = getOrdersLayoutNavLinks();

  const count = 6;
  // Orders count params
  const initialOrderParams = parseInt(searchParams.get("orders") || 0);
  const [ordersParams, setOrdersParams] = useState(initialOrderParams);

  // useEffect mount values.
  useEffect(() => {
    const urlOrders = parseInt(searchParams.get("orders")) || count;

    setOrdersParams(urlOrders);
  }, [searchParams]);

  const filteredOrders = useMemo(() => {
    let result = orders || [];

    return result;
  }, [orders]);
  // console.log("filteredOrders", filteredOrders);

  const displayedOrders = useMemo(() => {
    return (filteredOrders || []).slice(0, ordersParams);
  }, [filteredOrders, ordersParams]);

  // Load more button
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};

      params.orders = newCount;

      setSearchParams(params);
    };

    const totalItems =
      filteredOrders && filteredOrders.length > 0
        ? filteredOrders.length
        : orders.length;
    const newCount = Math.min(ordersParams + count, totalItems);

    if (newCount > ordersParams) {
      setOrdersParams(newCount); // Fixed: changed from setordersParams to setOrdersParams
      updateUrlParams(newCount);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Orders nav links  */}
      <div className="flex w-full px-2 pb-2">
        {ordersLayoutNavLinks.length === 0 ? (
          <LengthIsZeroErrorSmall />
        ) : (
          ordersLayoutNavLinks.map((ordersLayoutNavLink, index) => {
            return (
              <NavLink
                key={index}
                to={ordersLayoutNavLink.link}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 py-1 px-2 text-[12px] rounded-md transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {/* <ordersLayoutNavLink.icon height={"18"} width={"18"} /> */}
                <span
                  className={`truncate transition-opacity duration-200 ease-in-out `}
                >
                  {ordersLayoutNavLink.label}
                </span>
              </NavLink>
            );
          })
        )}
      </div>
      {/* Orders nav links ends */}

      {/* Table header  */}
      <div
        className={`w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300`}
      >
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[3fr_6fr_5fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">
              Order Detail
            </div>
            <div className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full text-sm">
              <div className="flex border-r border-gray-300 p-1">
                Ordered Items
              </div>
              <div className="flex border-r border-gray-300 p-1">
                Listed Price
              </div>
              <div className="flex border-r border-gray-300 p-1">Qty</div>
              <div className="flex border-r border-gray-300 p-1">Sub Total</div>
            </div>
            <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full text-sm">
              <div className="flex border-r border-gray-300 p-1">Less</div>
              <div className="flex border-r border-gray-300 p-1">Shipping</div>
              <div className="flex border-r border-gray-300 p-1">
                Overall Price
              </div>
              <div className="flex border-r border-gray-300 p-1">
                Payment Status
              </div>
              <div className="flex border-r border-gray-300 p-1">
                Order Status
              </div>
              <div className="flex border-r border-gray-300 p-1"></div>
            </div>
          </div>
          <div className="flex w-2 bg-blue-100"></div>
        </div>
      </div>
      {/* Table header ends  */}

      {/* List area */}
      <div className="flex w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <Outlet
          context={{
            filteredOrders,
            orders,
            ordersParams,
            loadMore,
            attributes,
            displayedOrders,
            sumOrderQuantities,
          }}
        />
      </div>
      {/* List area ends */}
    </div>
  );
};
