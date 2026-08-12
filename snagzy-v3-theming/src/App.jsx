import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { RootLayout } from "./layout/RootLayout";
import { Products } from "./pages/products/Products";
import { Inventory } from "./pages/inventory/Inventory";
import { Users } from "./pages/users/Users";
import { Order } from "./pages/orders/Order";
import { Orders } from "./pages/orders/Orders";
import { ProductLayout } from "./layout/ProductLayout";
import { ProductVariants } from "./pages/products/ProductVariants";
import { ProductReviews } from "./pages/products/ProductReviews";
import { ProductOrders } from "./pages/products/ProductOrders";
// import { Test } from "./testers/Test";
import { Analytics } from "./pages/analytics/Analytics";
import { ProductSales } from "./pages/products/ProductSales";
import { Reviews } from "./pages/reviews/Reviews";
import { UserProfile } from "./pages/users/UserProfile";
import { UserChats } from "./pages/users/UserChats";
import { UserWishlist } from "./pages/users/UserWishlist";
import { UserReviews } from "./pages/users/UserReviews";
import { UserSettings } from "./pages/users/UserSettings";
import { UserLayout } from "./layout/UserLayout";
import { UserOrdersLayout } from "./layout/UserOrdersLayout";
import { UserOrdersAll } from "./pages/users/orders/UserOrdersAll";
import { UserOrdersPending } from "./pages/users/orders/UserOrdersPending";
import { UserOrdersPurchased } from "./pages/users/orders/UserOrdersPurchased";
import { Stores } from "./pages/stores/Stores";
import { Dashboard } from "./pages/Dashboard";
import { Dashboard1 } from "./pages/Dashboard1";
import { Dashboard2 } from "./pages/Dashboard2";
import { Dashboard3 } from "./pages/Dashboard3";
import { ReviewsDashboard } from "./pages/ReviewsDashboard";
import { ProductsDashboard } from "./pages/ProductsDashboard";
import { ReviewsDashboard1 } from "./pages/ReviewsDashboard1";
import { UserDashboard } from "./pages/UserDashboard";
import { UserDashboard1 } from "./pages/UserDashboard1";
import { StoresDashboard } from "./pages/StoresDashboard";
import { InventoriesDashboard } from "./pages/InventoriesDashboard";

import { AnalyticsLayout } from "./layout/AnalyticsLayout";
import { ProductsAnalytics } from "./pages/analytics/ProductsAnalytics";
import { InventoriesAnalytics } from "./pages/analytics/InventoriesAnalytics";
import { UsersAnalytics } from "./pages/analytics/UsersAnalytics";
import { StoresAnalytics } from "./pages/analytics/StoresAnalytics";
import { OrdersAnalytics } from "./pages/analytics/OrdersAnalytics";
import { ReviewsAnalytics } from "./pages/analytics/ReviewsAnalytics";

export const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="analytics" element={<AnalyticsLayout />}>
          {/* <Route index element={<ProductsAnalytics />} /> */}
          <Route index element={<OrdersAnalytics />} />
          <Route path="inventories" element={<InventoriesAnalytics />} />
          <Route path="users" element={<UsersAnalytics />} />
          <Route path="stores" element={<StoresAnalytics />} />
          <Route path="products" element={<ProductsAnalytics />} />
          <Route path="reviews" element={<ReviewsAnalytics />} />
        </Route>

        <Route path="products" element={<Products />} />

        <Route path="products/:slug/:productId" element={<ProductLayout />}>
          <Route index element={<ProductVariants />} />
          <Route path="reviews" element={<ProductReviews />} />
          <Route path="orders" element={<ProductOrders />} />
          <Route path="sales" element={<ProductSales />} />
        </Route>

        <Route path="inventory" element={<Inventory />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard1" element={<Dashboard1 />} />
        <Route path="dashboard2" element={<Dashboard2 />} />
        <Route path="dashboard3" element={<Dashboard3 />} />
        <Route path="userdashboard" element={<UserDashboard />} />
        <Route path="userdashboard1" element={<UserDashboard1 />} />
        <Route path="reviewsdashboard" element={<ReviewsDashboard />} />
        <Route path="reviewsdashboard1" element={<ReviewsDashboard1 />} />
        <Route path="productsdashboard" element={<ProductsDashboard />} />
        <Route path="storesdashboard" element={<StoresDashboard />} />
        <Route path="inventoriesdashboard" element={<InventoriesDashboard />} />

        <Route path="users" element={<Users />} />
        <Route path="stores" element={<Stores />} />

        <Route path="users/:slug/:userId" element={<UserLayout />}>
          <Route index element={<UserProfile />} />
          <Route path="chats" element={<UserChats />} />
          {/* <Route path="orders" element={<UserOrders />} /> */}
          <Route path="orders" element={<UserOrdersLayout />}>
            <Route index element={<UserOrdersAll />} />
            <Route path="pending" element={<UserOrdersPending />} />
            <Route path="purchased" element={<UserOrdersPurchased />} />
          </Route>
          <Route index element={<UserProfile />} />
          <Route path="wishlist" element={<UserWishlist />} />
          <Route path="reviews" element={<UserReviews />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>

        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderId" element={<Order />} />
        <Route path="reviews" element={<Reviews />} />
        {/* <Route path="test" element={<Test />} /> */}
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};
