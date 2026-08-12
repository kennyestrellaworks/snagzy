export const TwoGridProfilePicture = ({ participants }) => {
  return (
    <div className="flex relative shrink-0">
      <div className="grid grid-cols-2 grid-rows-2 h-16 w-16 overflow-hidden rounded-md">
        {participants.slice(0, 2).map((item, index) => {
          return (
            <div key={`${item._id}-${index}`} className="contents">
              {index === 0 ? (
                <div className="row-span-2 bg-red-100 border-r border-white">
                  <img
                    src={item.image}
                    alt={`${item.firstName} ${item.lastName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : index === 1 ? (
                <div className="row-span-2 bg-red-100 border-l border-white">
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
