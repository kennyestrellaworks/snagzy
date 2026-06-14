// src/components/Dropdown.jsx
import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";

export const NavItemDropdown = ({
  dropdownName,
  listItems,
  hasArrowIcon,
  isButtonStyle,
  isIconStyle,
  Icon,
  defaultClass,
  position,
  dropdownList,
  dropdownListHover,
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
      <button
        className={`${defaultClass} inline-flex justify-center rounded-md ${
          isButtonStyle
            ? `shadow-sm px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:theme-btn-ring transition duration-150 ${
                isOpen ? "" : ""
              }`
            : ""
        } ${
          isIconStyle
            ? `hidden sm:flex px-3 py-2 rounded-md text-sm font-medium theme-btn transition duration-150 ease-in-out ${
                isOpen ? "" : ""
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
        {Icon ? <Icon className="h-5 w-5" /> : null}
      </button>

      {isOpen && (
        <div
          className={`${position} ${dropdownList} mt-2 ${
            isButtonStyle ? "w-44" : "w-32"
          } rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10`}
        >
          <div className="py-1" role="none">
            {listItems.map((item, index) => (
              <NavLink
                key={index}
                className={`${dropdownListHover} block px-4 py-2 text-sm transition duration-100`}
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
