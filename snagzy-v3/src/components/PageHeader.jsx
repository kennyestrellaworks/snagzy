import { useLocation } from "react-router-dom";
import { useData } from "../context/DataContext";

export const PageHeader = ({ defaultPage, type, prefix, suffix }) => {
  const {
    getSidebarNavLinks,
    getUserLayoutNavLinks,
    getProductLayoutNavLinks,
    getAnalyticsLayoutNavLinks,
  } = useData();

  let navLinkObject = [];

  if (type === "sidebar-level") {
    navLinkObject = getSidebarNavLinks();
  } else if (type === "user-level") {
    navLinkObject = getUserLayoutNavLinks();
  } else if (type === "product-level") {
    navLinkObject = getProductLayoutNavLinks();
  } else if (type === "analytics-level") {
    navLinkObject = getAnalyticsLayoutNavLinks();
  }

  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, "");

  const getBasePath = () => {
    if (type === "analytics-level") return "/analytics";
    if (type === "product-level") return "/products";
    if (type === "user-level") return "/users";
    return "";
  };

  const matchedNavLink =
    navLinkObject.find((navLink) => {
      const link = navLink.link?.trim();

      if (!link) return false;

      const basePath = getBasePath();
      const targetPath = basePath ? `${basePath}/${link}` : `/${link}`;

      return (
        normalizedPath === targetPath ||
        normalizedPath.startsWith(`${targetPath}/`) ||
        normalizedPath.endsWith(`/${link}`)
      );
    }) ||
    navLinkObject.find((navLink) => !navLink.link?.trim()) ||
    null;

  const currentLabel = matchedNavLink?.label || defaultPage;

  return (
    <h1>
      {prefix && `${prefix} `}
      {currentLabel}
      {suffix && ` ${suffix}`}
    </h1>
  );
};
