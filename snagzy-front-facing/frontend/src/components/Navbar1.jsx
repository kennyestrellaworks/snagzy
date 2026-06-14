import logov2 from "../assets/images/logo-v2.svg";
import { SearchInput } from "./ui/SearchInput";
import { IoSearch } from "react-icons/io5";
import { NavItemDropdown } from "./ui/NavItemDropdown";
import { FaRegHeart } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import { themeOptions } from "../data/system";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { NavLinkItem } from "./ui/NavLinkItem";
import { NavButton } from "./ui/NavButton";

export const Navbar = () => {
  // Filter the array to get only the top-level categories
  const topLevelCategories = categories.filter(
    (item) => item.parent_id === null
  );

  return (
    <div className="flex h-16 w-full items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/">
          <img src={logov2} alt="Snagzy logo" className="w-[6rem]" />
        </Link>
      </div>

      <div className="flex flex-row items-center gap-4">
        <div className="hidden md:flex">
          <NavItemDropdown
            dropdownName={"Categories"}
            listItems={topLevelCategories}
            hasArrowIcon={true}
            isButtonStyle={true}
            isIconStyle={false}
            Icon={null}
            defaultClass={"theme-navbar-dropdown"}
            position={"origin-top-left absolute left-0"}
            dropdownList={""}
            dropdownListHover={""}
          />
          {/* No name 
          <NavDropdown
            dropdownName={null}
            listItems={topLevelCategories}
            hasArrowIcon={false}
            isButtonStyle={false}
            isIconStyle={true}
            Icon={IoColorPaletteOutline}
            link={"theme-navbar-link"}
            position={"origin-top-left absolute left-0"}
            dropdownList={"theme-navbar-nav-dropdown"}
            dropdownListHover={"theme-navbar-nav-dropdown-item"}
          /> */}
        </div>

        {/* Search  */}
        <div className="hidden lg:flex flex-1 w-[50%]">
          <div className="relative w-full">
            <IoSearch
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 theme-navbar-search-icon`}
            />
            <SearchInput
              type="search"
              placeholder="Search products..."
              className={`pl-10 w-full theme-navbar-search`}
            />
          </div>
        </div>
      </div>

      {/* Right side  */}
      <div className="flex flex-row items-center gap-1">
        <ThemeSwitcher
          dropdownName={"Categories"}
          listItems={themeOptions}
          hasArrowIcon={true}
          isButtonStyle={false}
          isIconStyle={true}
          Icon={null}
          link={"theme-navbar-link"}
          position={"origin-top-right absolute right-0"}
          dropdownList={"theme-navbar-nav-dropdown"}
          dropdownListHover={"theme-navbar-nav-dropdown-item"}
        />
        <NavButton
          isIconStyle={true}
          Icon={FaRegHeart}
          link={"theme-navbar-link"}
        />
        <NavButton
          isIconStyle={true}
          Icon={IoCartOutline}
          link={"theme-navbar-link"}
        />
        <nav className="flex flex-row flex-nowrap gap-1">
          <NavLinkItem to="" link={"theme-navbar-link"}>
            Sign up
          </NavLinkItem>
          <NavLinkItem to="" link={"theme-navbar-link"}>
            Sign in
          </NavLinkItem>
        </nav>
      </div>
    </div>
  );
};
