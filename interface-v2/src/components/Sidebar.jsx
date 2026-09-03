import { ArrowLeft } from "../components/SVG";

export const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside
      className={`${isSidebarOpen ? "w-50" : "w-20"} z-50 flex h-full min-h-0 flex-col overflow-hidden transition-all duration-300 ease-in-out`}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={`flex h-14 w-full shrink-0 items-center ${
            isSidebarOpen
              ? "justify-between pl-4 pr-4"
              : "justify-center pl-0 pr-0"
          } border-b`}
        >
          <div className={`flex ${isSidebarOpen ? "" : "hidden"} logo`}>
            <img
              src="/images/snagzy-logo.svg"
              alt="snagzy-logo"
              className="h-8"
            />
          </div>
          <button className="cursor-pointer" onClick={toggleSidebar}>
            <ArrowLeft
              height={20}
              width={20}
              className={`${
                isSidebarOpen ? "" : "rotate-180"
              } transition-all duration-300 ease-in-out`}
            />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full w-full flex-col overflow-y-auto bg-[#F3F3F3] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <div className="flex w-full p-2">
              <div className="flex flex-col w-full">
                <div className="flex w-full flex-col gap-2">
                  {Array.from({ length: 20 }, (_, index) => (
                    <li key={index} className="border p-2">
                      Item {index + 1}
                    </li>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
