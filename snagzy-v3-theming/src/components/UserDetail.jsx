import { ItemStatusBadge, PersonIdBadge } from "./Badges";
import { ImageDoubleExtraSmall } from "./Image";

export const UserDetail = ({ object, showStatus }) => {
  // console.log("object", object._id);
  return (
    <div className="flex gap-2 text-sm">
      <ImageDoubleExtraSmall
        image={object.image}
        alt={object.firstName + object.lastName}
        type="circle"
      />
      <div className="flex flex-col items-start gap-1">
        <div className="flex flex-col items-start">
          <div className="flex gap-2 items-center">
            <h1 className="font-semibold text-lg leading-tight">
              {object.firstName + " " + object.lastName}
            </h1>
            {showStatus ? (
              <ItemStatusBadge statusId={object.profileStatus} />
            ) : null}
          </div>
          <div className="flex flex-col">
            <PersonIdBadge id={object._id} />
            <p className="text-md text-gray-600">{object.jobTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
