import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { NavLink } from "react-router-dom";

export const NavItemDropdown = ({ dropdownName, listItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  console.log("isOpen", isOpen);

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
    >
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 transition duration-150"
        >
          {dropdownName}
          <MdKeyboardArrowDown
            className={`-mr-1 ml-2 h-5 w-5 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-1" role="none">
            {listItems.map((item) => (
              <NavLink
                key={item}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition duration-100"
                to=""
              >
                {item}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
