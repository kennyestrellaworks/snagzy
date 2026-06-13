import { useState } from "react";
import { Bell, ChevronDown, Logout, Settings, User } from "./SVG";
import { useData } from "../context/DataContext";

export const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { getUserById } = useData();
  const loggedInUser = getUserById("people43210987nopqrstu");

  return (
    <header className="sticky w-full top-0 z-60 bg-white border-b border-gray-200 p-2">
      <div className="flex w-full h-10 items-center justify-between">
        <div className="flex">
          <h1 className="text-sm">Agent View</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex gap-1 items-center px-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* <div className="w-5 h-5 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div> */}
                <img
                  src={loggedInUser.image}
                  alt={loggedInUser.firstName + " " + loggedInUser.lastName}
                  className="h-8 w-8 rounded-full"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs text-gray-500">Welcome</p>
                  <p className="text-sm font-medium text-gray-900">
                    {loggedInUser.firstName + " " + loggedInUser.lastName}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {loggedInUser.firstName + " " + loggedInUser.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {loggedInUser.contact[0].email}
                      </p>
                    </div>

                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>

                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-gray-200 my-2" />

                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <Logout className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
