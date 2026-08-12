import { ImageDoubleExtraSmall } from "./Image";
import { PersonIdBadge } from "./Badges";

import { IconedAddress, IconedEmail, IconedPhone } from "./IconedValue";

export const BuyerDetail = ({ object }) => {
  // console.log("object", object);
  return (
    <div className="flex gap-2">
      <ImageDoubleExtraSmall
        image={object.buyerInfo.image}
        alt={object.buyerInfo.buyerName}
        type="circle"
      />
      <div className="flex flex-col items-start gap-1">
        <div className="flex flex-col items-start">
          <h1 className="font-semibold text-lg leading-tight">
            {object.buyerInfo.buyerFirstName} {object.buyerInfo.buyerLastName}
          </h1>
          <PersonIdBadge id={object.buyerInfo.buyerId} />
          <IconedEmail data={object.buyerInfo.email} />
          <IconedPhone data={object.buyerInfo.phone} />
          <IconedAddress data={object.buyerInfo.shippingInfo} />
        </div>
      </div>
    </div>
  );
};
