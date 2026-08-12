import { useLocation } from "react-router-dom";
import { useData } from "../context/DataContext";

export const PageHeader = ({ defaultPage, type, prefix, suffix }) => {
  const {
    getSidebarNavLinks,
    getUserLayoutNavLinks,
    getProductLayoutNavLinks,
    getAnalyticsLayoutNavLinks,
  } = useData();

  let navLinkObject = {};

  if (type === "sidebar-level") {
    navLinkObject = getSidebarNavLinks();
  }

  if (type === "user-level") {
    navLinkObject = getUserLayoutNavLinks();
  }

  if (type === "product-level") {
    navLinkObject = getProductLayoutNavLinks();
  }

  if (type === "analytics-level") {
    navLinkObject = getAnalyticsLayoutNavLinks();
  }

  // URL information
  const location = useLocation();
  const currentLocation = navLinkObject.filter((navLink) =>
    location.pathname.includes(navLink.link),
  );
  // console.log("currentLocation", currentLocation);

  return (
    <h1>
      {prefix && `${prefix} `}
      {currentLocation.length === 1
        ? defaultPage
        : currentLocation[1]?.label}{" "}
      {suffix && suffix}
    </h1>
  );
};
