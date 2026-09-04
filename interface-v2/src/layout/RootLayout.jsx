import { useState } from "react";
import { Sidebar } from "../components/Sidebar";

export const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full lg:w-800 relative flex h-screen overflow-hidden">
        {/* Sidebar  */}
        {/* <div className="flex flex-col border-r bg-cyan-300">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div> */}

        {/* Content  */}
        <div className="flex flex-col w-full z-40 overflow-hidden">
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

        {/* Sidebar  */}
        <div className="flex flex-col border-r bg-cyan-300">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
      </div>
    </div>
  );
};
