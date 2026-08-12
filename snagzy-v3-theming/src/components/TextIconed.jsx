import { useData } from "../context/DataContext";
import { Mail, MapPin, Phone } from "./SVG";

export const EmailTextIconed = ({ object }) => {
  return (
    <div className="flex items-start gap-1 text-sm">
      <Mail height={14} width={14} className="mt-1" />
      <p className="text-md text-gray-700">{object.contact.email}</p>
    </div>
  );
};

export const PhoneTextIconed = ({ object }) => {
  return (
    <div className="flex items-start gap-1 text-sm">
      <Phone height={14} width={14} className="mt-1" />
      <p className="text-md text-gray-700">{object.contact.phone}</p>
    </div>
  );
};

export const AddressTextIconed = ({ object }) => {
  const { getUserHomeAddress } = useData();
  const homeAddress = getUserHomeAddress(object._id);
  return (
    <div className="flex items-start gap-1 text-sm">
      <MapPin height={14} width={14} className="mt-1" />
      <p className="text-gray-700 leading-tight">
        {homeAddress.addressLine1 || ""} {homeAddress.addressLine2 || ""}{" "}
        {homeAddress.city || ""}
        <br />
        {homeAddress.stateOrProvince || ""}, {homeAddress.barangay || ""}{" "}
        {homeAddress.zipCode || ""} {homeAddress.country || ""}
      </p>
    </div>
  );
};
