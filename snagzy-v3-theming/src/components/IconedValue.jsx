import { Mail, MapPin, Phone } from "./SVG";

export const IconedEmail = ({ data }) => {
  return (
    <div className="flex items-start gap-1">
      <Mail height={14} width={14} className="shrink-0 mt-1" />
      <p className="text-md text-gray-600">{data}</p>
    </div>
  );
};

export const IconedPhone = ({ data }) => {
  return (
    <div className="flex items-start gap-1">
      <Phone height={14} width={14} className="shrink-0 mt-1" />
      <p className="text-md text-gray-600">{data}</p>
    </div>
  );
};

export const IconedAddress = ({ data }) => {
  //   console.log("IconedAddress", data);
  return (
    <div className="flex items-start gap-1">
      <MapPin height={14} width={14} className="shrink-0 mt-1" />
      <p className="text-gray-700 leading-tight">
        {data?.addressLine1 || ""} {data?.addressLine2 || ""} {data?.city || ""}{" "}
        {/* <br /> */}
        {data?.stateOrProvince || ""}, {data?.barangay || ""}{" "}
        {data?.zipCode || ""} {data?.country || ""}
      </p>
    </div>
  );
};
