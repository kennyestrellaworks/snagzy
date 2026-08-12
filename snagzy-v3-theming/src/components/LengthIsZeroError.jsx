import { Search } from "./SVG";

export const LengthIsZeroError = ({ title, message }) => {
  return (
    // <div className="flex items-center w-full h-screen"></div>
    <div className="w-100 m-auto text-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          {/* <Search className="w-12 h-12 text-gray-400" /> */}
          <img
            src="/images/system/snagzy-logo-sad.svg"
            className="w-14 h-14 text-gray-400"
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {title || "No data found"}
        </h2>
        <p className="text-gray-600">{message || "Something went wrong!"}</p>
      </div>
    </div>
  );
};

export const LengthIsZeroErrorMedium = ({ title, message }) => {
  return (
    // <div className="flex items-center w-full h-screen"></div>
    <div className="w-60 m-auto text-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          {/* <Search className="w-12 h-12 text-gray-400" /> */}
          <img
            src="/images/system/snagzy-logo-sad.svg"
            className="w-10 h-10 text-gray-400"
          />
        </div>
        <h2 className="text-[20px] font-semibold text-gray-900 mb-2">
          {title || "No data found"}
        </h2>
        <p className="text-gray-600">{message || "Something went wrong!"}</p>
      </div>
    </div>
  );
};

export const LengthIsZeroErrorSmall = ({ title, message }) => {
  return (
    <div className="flex items-center w-full h-screen">
      <div className="w-full m-auto text-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-[18px] font-semibold text-gray-900 mb-2">
            {title || "No data found"}
          </h2>
          <p className="text-gray-600 text-[14px]">
            {message || "Something went wrong!"}
          </p>
        </div>
      </div>
    </div>
  );
};
