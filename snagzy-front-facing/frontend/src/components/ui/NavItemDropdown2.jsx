// src/components/Dropdown.jsx
import { useState, useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { NavLink } from "react-router-dom";

export const Dropdown = ({
  dropdownName,
  listItems,
  hasArrowIcon,
  isButtonStyle,
  isIconStyle,
  Icon,
  position,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const leaveTimer = useRef(null);

  const handleMouseEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <button
          type="button"
          className={`inline-flex justify-center w-full rounded-md ${
            isButtonStyle
              ? `theme-dropdown-btn shadow-sm px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:theme-dropdown-btn-ring transition duration-150 ${
                  isOpen ? "theme-dropdown-btn-hover" : ""
                }`
              : ""
          } ${
            isIconStyle
              ? `hidden sm:flex px-3 py-2 rounded-md text-sm font-medium theme-dropdown-btn transition duration-150 ease-in-out ${
                  isOpen ? "theme-dropdown-btn-hover" : ""
                }`
              : ""
          }`}
        >
          {dropdownName ? dropdownName : null}
          {hasArrowIcon && (
            <MdKeyboardArrowDown
              className={`-mr-1 ml-2 h-5 w-5 transform transition-transform duration-200 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          )}
          {/* Only render Icon if provided */}
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </button>
      </div>

      {isOpen && (
        <div
          className={`${position} mt-2 ${
            isButtonStyle ? "w-56" : "w-32"
          } rounded-md shadow-lg theme-dropdown-list ring-1 ring-black ring-opacity-5 z-10`}
        >
          <div className="py-1" role="none">
            {listItems.map((item, index) => (
              <NavLink
                key={index}
                // Tailwind class for hover effect on dropdown items
                className={`block px-4 py-2 text-sm theme-dropdown-list-text theme-dropdown-list-item transition duration-100`}
                to=""
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
