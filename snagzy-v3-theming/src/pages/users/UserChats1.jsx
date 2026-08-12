import { useOutletContext } from "react-router-dom";
import { Search } from "../../components/SVG";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { useData } from "../../context/DataContext";

export const UserChats = () => {
  const { chats, currentUser } = useOutletContext();
  // const {getEmpty} = useData()
  // const empty = getEmpty()

  // console.log("chats", chats);

  return (
    <div className="flex-1 overflow-hidden p-4">
      <div className="grid grid-cols-[2fr_4fr_2fr] h-full overflow-hidden gap-4">
        {/* Box 1 */}
        <div className="flex flex-col bg-green-200 p-4 overflow-hidden rounded-lg">
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search in green..."
              className="w-full p-2 rounded-lg border border-green-400 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex-1 bg-green-300 w-full p-2 overflow-y-auto rounded">
            {[...Array(20)].map((_, index) => {
              return (
                <div
                  key={index}
                  className="flex border border-gray-300 bg-white p-2 mb-2 last:mb-0"
                >
                  Item {index}
                </div>
              );
            })}
          </div>
        </div>

        {/* Box 2 */}
        <div className="flex flex-col bg-green-200 p-4 overflow-hidden rounded-lg">
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search in green..."
              className="w-full p-2 rounded-lg border border-green-400 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex-1 bg-green-300 w-full p-2 overflow-y-auto rounded">
            {[...Array(20)].map((_, index) => {
              return (
                <div
                  key={index}
                  className="flex border border-gray-300 bg-white p-2 mb-2 last:mb-0"
                >
                  Item {index}
                </div>
              );
            })}
          </div>
        </div>

        {/* Box 3 */}
        <div className="flex flex-col bg-green-200 p-4 overflow-hidden rounded-lg">
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search in green..."
              className="w-full p-2 rounded-lg border border-green-400 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex-1 bg-green-300 w-full p-2 overflow-y-auto rounded">
            {[...Array(20)].map((_, index) => {
              return (
                <div
                  key={index}
                  className="flex border border-gray-300 bg-white p-2 mb-2 last:mb-0"
                >
                  Item {index}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
