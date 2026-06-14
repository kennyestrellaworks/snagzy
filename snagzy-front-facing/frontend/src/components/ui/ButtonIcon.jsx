import { MdKeyboardArrowDown } from "react-icons/md";

export const ButtonIcon = ({
  dropdownName,
  hasArrowIcon,
  isButtonStyle,
  isIconStyle,
  Icon,
  link,
  isOpen,
}) => {
  return (
    <button
      className={`${link} inline-flex justify-center rounded-md ${
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
  );
};
