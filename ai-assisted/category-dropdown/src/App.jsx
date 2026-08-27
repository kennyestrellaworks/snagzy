import CategoryDropdown from "./components/CategoryDropdown";

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-24 gap-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Category Dropdown
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Hover a category to reveal nested submenus.
        </p>
      </div>
      <CategoryDropdown />
    </div>
  );
};
