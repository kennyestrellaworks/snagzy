import React from "react";
import { PageHeader } from "../../components/PageHeader";
import { Outlet } from "react-router-dom";

export const Analytics = () => {
  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="flex w-full z-50">
        <div className="flex w-full justify-between p-2">
          <div className="flex gap-2 justify-between">
            <PageHeader defaultPage="Analytics" type="sidebar-level" />
          </div>

          <div className="flex gap-4 items-center">THIS</div>
        </div>
      </div>

      <div className="flex flex-col w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <Outlet />
      </div>
    </div>
  );
};
