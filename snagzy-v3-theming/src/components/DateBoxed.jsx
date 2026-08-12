import { dateFormatter } from "../utils/helpers";

export const OrderPlacedUpdated = ({ createdAt, updatedAt }) => {
  return (
    <div className="flex flex-col items-start bg-amber-50 p-2 border-b border border-amber-100">
      <p className="text-[12px] text-gray-600">
        <span className="text-gray-400">Placed:</span>{" "}
        {dateFormatter(createdAt)}
      </p>
      <p className="text-[12px] text-gray-600">
        <span className="text-gray-400">Updated:</span>{" "}
        {dateFormatter(updatedAt)}
      </p>
    </div>
  );
};

export const CreatedUpdated = ({ createdAt, updatedAt }) => {
  return (
    <div className="flex flex-col items-start bg-blue-50 p-2 border-b border border-blue-100">
      <p className="text-[12px] text-gray-600">
        <span className="text-gray-400">Created:</span>{" "}
        {dateFormatter(createdAt)}
      </p>
      <p className="text-[12px] text-gray-600">
        <span className="text-gray-400">Updated:</span>{" "}
        {dateFormatter(updatedAt)}
      </p>
    </div>
  );
};
