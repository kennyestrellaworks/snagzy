import { IoClose, IoSearch } from "../SVG";

export const FilterInput = ({
  searchInput,
  setSearchInput,
  onSearchChange,
}) => {
  return (
    <div className="flex w-full relative">
      <input
        value={searchInput}
        onChange={onSearchChange}
        className="flex-1 p-2 border border-gray-400 rounded text-sm leading-tight"
        placeholder="Search..."
        type="text"
      />
      {searchInput ? (
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setSearchInput("");
          }}
          type="button"
          className="absolute top-2 right-2"
        >
          <IoClose
            height={20}
            width={20}
            className={
              "text-gray-400 cursor-pointer hover:text-gray-500 transition-all duration-300 ease-in-out"
            }
          />
        </button>
      ) : (
        <IoSearch
          height={20}
          width={20}
          className={
            "absolute top-2 right-2 text-gray-400 cursor-pointer hover:text-gray-500 transition-all duration-300 ease-in-out"
          }
        />
      )}
    </div>
  );
};
