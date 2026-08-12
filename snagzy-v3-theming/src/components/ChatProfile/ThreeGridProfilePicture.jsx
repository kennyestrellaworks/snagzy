export const ThreeGridProfilePicture = ({ participants }) => {
  return (
    <div className="flex relative shrink-0">
      <div className="grid grid-cols-2 grid-rows-2 h-16 w-16 overflow-hidden rounded-md">
        {participants.slice(0, 3).map((item, index) => {
          return (
            <div key={`${item._id}-${index}`} className="contents">
              {index === 0 && (
                <div className="row-span-2 bg-red-100 border-r-2 border-white">
                  <img
                    src={item.image}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {index === 1 && (
                <div className="bg-blue-100 border-b-2 border-white">
                  <img
                    src={item.image}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {index === 2 && (
                <div className="bg-green-100">
                  <img
                    src={item.image}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
