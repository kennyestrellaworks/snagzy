import { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export const RootLayout1 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full lg:w-800 relative flex h-screen bg-cyan-100">
        {/* Left Sticky Sidebar - Full height */}
        <div className="flex flex-col bg-white border-r border-gray-200">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        <div className="flex flex-col w-full z-40">
          <Header />
          {/* Main content  */}
          <div className="w-full relative flex h-screen bg-cyan-100 overflow-y-hidden p-4">
            <Outlet />
            {/* Left Sticky Sidebar - Full height */}
            {/* <div className="sticky top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 flex flex-col">
              <div className="flex">
                <h1>THIS</h1>
              </div>
              <div className="flex">
                <Sidebar />
              </div>
            </div>

            <div className="flex flex-col w-full">
              <Header />
              <Header />

              <div className="sticky w-full h-16 top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
                <div className="flex w-full justify-between">
                  <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] w-full text-sm">
                    <div className="flex border-r border-gray-300 p-2">
                      Column
                    </div>
                    <div className="flex border-r border-gray-300 p-2">
                      Column
                    </div>
                    <div className="flex border-r border-gray-300 p-2">
                      Column
                    </div>
                    <div className="flex border-r border-gray-300 p-2">
                      Column
                    </div>
                    <div className="flex border-r border-gray-300 p-2">
                      Column
                    </div>
                  </div>
                  <div className="flex w-2 bg-blue-100"></div>
                </div>
              </div>
              <div className="flex w-full overflow-y-auto bg-slate-400 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                <div className="flex flex-col w-full">
                  {[...Array(60)].map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] bg-white border-b border-gray-200 last:border-b-0 text-sm"
                    >
                      <div className="flex border-r border-gray-200 p-2">
                        Row {i}
                      </div>
                      <div className="flex border-r border-gray-200 p-2">
                        Item
                      </div>
                      <div className="flex border-r border-gray-200 p-2">
                        Item
                      </div>
                      <div className="flex border-r border-gray-200 p-2">
                        Item
                      </div>
                      <div className="flex border-r border-gray-200 p-2">
                        Item
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
          {/* Main content ends */}
        </div>
      </div>
    </div>
  );
};
