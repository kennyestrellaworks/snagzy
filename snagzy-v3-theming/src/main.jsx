import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { DataProvider } from "./context/DataContext";
import { OrdersAnalyticsProvider } from "./context/OrdersAnalyticsContext";
import { ReviewsAnalyticsProvider } from "./context/ReviewsAnalyticsContext";
import { TopAnalyticsProvider } from "./context/TopAnalyticsContext";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <TopAnalyticsProvider>
        <ReviewsAnalyticsProvider>
          <OrdersAnalyticsProvider>
            <DataProvider>
              <App />
            </DataProvider>
          </OrdersAnalyticsProvider>
        </ReviewsAnalyticsProvider>
      </TopAnalyticsProvider>
    </ThemeProvider>
  </StrictMode>,
);
