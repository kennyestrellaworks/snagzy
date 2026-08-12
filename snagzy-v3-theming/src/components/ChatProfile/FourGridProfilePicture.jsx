export const FourGridProfilePicture = ({ participants }) => {
  return (
    <div className="flex relative shrink-0">
      <div className="grid grid-cols-2 grid-rows-2 h-16 w-16 overflow-hidden rounded-md gap-0.5 bg-white">
        {participants.slice(0, 4).map((item, index) => {
          return (
            <div key={`${item._id}-${index}`} className="contents">
              {index === 0 ? (
                <div className="bg-red-100">
                  <img
                    src={item.image}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : index === 1 ? (
                <div className="bg-blue-100">
                  <img
                    src={item.image}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : index === 2 ? (
                <div className="bg-green-100">
                  <img
                    src={item.image}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : index === 3 ? (
                <div className="bg-gray-100">
                  <img
                    src={item.image}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
