import { NavLink } from "react-router-dom";
import { useData } from "../context/DataContext";
import { ArrowLeft } from "./SVG";

export const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { getSidebarNavLinks } = useData();
  const sidebarNavLinks = getSidebarNavLinks();

  return (
    <aside
      className={`sticky top-0 h-screen ${isSidebarOpen ? "w-50" : "w-20"} z-50 flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
    >
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div
          className={`flex w-full items-center h-14 ${
            isSidebarOpen
              ? "justify-between pl-4 pr-4"
              : "justify-center pl-0 pr-0"
          } border-b`}
          style={{
            background: "var(--bg-sidebar)",
            borderColor: "var(--border)",
          }}
        >
          <div className={`flex ${isSidebarOpen ? "" : "hidden"} logo`}>
            <img
              src="/images/system/snagzy-logo.svg"
              alt="snagzy-logo"
              className="h-8"
            />
          </div>
          <button
            className="cursor-pointer"
            onClick={toggleSidebar}
            style={{ color: "var(--text-sidebar)" }}
          >
            <ArrowLeft
              height={20}
              width={20}
              className={`${
                isSidebarOpen ? "" : "rotate-180"
              } transition-all duration-300 ease-in-out`}
            />
          </button>
        </div>
        <nav className="flex flex-col p-2">
          {sidebarNavLinks.map((sidebarNavLink, index) => {
            return (
              <NavLink
                key={index}
                to={sidebarNavLink.link}
                end={false}
                className={({ isActive }) =>
                  `sidebar-link w-full flex items-center h-10 rounded-lg transition-all ${
                    isSidebarOpen
                      ? "justify-start px-3 gap-4"
                      : "justify-center px-2 gap-0"
                  } ${isActive ? "sidebar-link-active" : ""}`
                }
              >
                <sidebarNavLink.icon height={"20"} width={"20"} />

                <span
                  className={`truncate transition-opacity duration-200 ease-in-out ${
                    isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                  }`}
                >
                  {sidebarNavLink.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
