import { IoIosArrowDown } from "../SVG";

export const LimitSelector = ({ id, value, onChangeValue }) => {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChangeValue(Number(e.target.value))}
        className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1 pl-2 pr-7 text-xs font-medium rounded-md cursor-pointer hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-colors"
      >
        <option value={3}>Top 3</option>
        <option value={5}>Top 5</option>
        <option value={10}>Top 10</option>
        <option value={20}>Top 20</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500">
        <IoIosArrowDown className="w-3 h-3" />
      </div>
    </div>
  );
};
