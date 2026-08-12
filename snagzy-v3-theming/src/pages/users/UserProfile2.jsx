import { useOutletContext } from "react-router-dom";
import {
  Cake,
  GrDocumentUser,
  IoCameraOutline,
  LuSquareUser,
  Mail,
  MapPin,
  MdOutlineEmergency,
  Phone,
  PiFolderSimpleUser,
  RiHome8Line,
  User,
} from "../../components/SVG";
import { birthDateFormatter, getAge } from "../../utils/helpers";

export const UserProfile2 = () => {
  const { currentUser } = useOutletContext();
  // console.log("currentUser", currentUser);

  // Birthdate
  const birthDate = birthDateFormatter(currentUser.birthDate);
  const age = getAge(currentUser.birthDate) + " years";

  return (
    <div className="h-full w-full bg-white">
      {/* Scrollable container with background */}
      <div className="h-full w-full bg-gray-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        {/* Centered content container - added extra bottom padding */}
        <div className="max-w-350 mx-auto py-6 px-4 pb-12">
          {/* Two-column layout */}
          <div className="flex gap-6">
            {/* Sidebar - fixed width */}
            <div className="w-64 shrink-0 space-y-6">
              {/* Avatar Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <User className="w-4 h-4" />
                  <span>Avatar</span>
                </div>
                <div className="relative w-24 h-24 mb-4">
                  <img
                    src={currentUser.image}
                    alt="User avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 ">
                    <button className="p-1.5 bg-gray-200 hover:bg-blue-500 rounded-full flex items-center justify-center text-xs text-gray-500 hover:text-gray-100 border-2 border-white cursor-pointer transition-all duration-200 ease-in-out">
                      <IoCameraOutline width={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 cursor-pointer rounded-md text-sm hover:bg-blue-200 transition-colors">
                    New
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 cursor-pointer rounded-md text-sm hover:bg-gray-200 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
              {/* User ID Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <LuSquareUser className="w-4 h-4" />
                  <span>User Id</span>
                </div>
                <div className="text-sm text-gray-700 break-all">
                  {currentUser._id}
                </div>
              </div>
            </div>

            {/* Main Content - fills remaining space */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-8 border border-blue-400 rounded-lg bg-white p-8">
                {/* User Section */}
                <div className="flex flex-col">
                  <h2 className="text-xl text-gray-900 mb-6">User</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Short Bio */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <GrDocumentUser className="w-4 h-4" />
                        <span>Short Bio</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {currentUser.shortBio}
                      </p>
                    </div>
                    {/* Name */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <PiFolderSimpleUser className="w-4 h-4" />
                        <span>Name</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <div>
                          <span className="text-gray-400">First Name: </span>
                          {currentUser.middleName}
                        </div>
                        <div>
                          <span className="text-gray-400">Middle Name: </span>
                          {currentUser.firstName}
                        </div>
                        <div>
                          <span className="text-gray-400">Last Name: </span>
                          {currentUser.lastName}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col">
                  <h2 className="text-xl text-gray-900 mb-6">Contact</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Phone */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <Phone className="w-4 h-4" />
                        <span>Phone</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {currentUser.contact.phone}
                      </p>
                    </div>
                    {/* Emergency */}
                    {currentUser.emergencyContact.map((item, index) => {
                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                            <MdOutlineEmergency className="w-4 h-4" />
                            <span>Emergency</span>
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="text-gray-400">
                              {item.relation}
                            </span>
                            <div className="flex">
                              {item.firstName}&nbsp;
                              {item.middleName}&nbsp;
                              {item.lastName}
                            </div>
                            <div>{item.phone}</div>
                          </div>
                        </div>
                      );
                    })}
                    {/* Email */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {currentUser.contact.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="flex flex-col">
                  <h2 className="text-xl text-gray-900 mb-6">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Birth Date */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <Cake className="w-4 h-4" />
                        <span>Birth Date</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <div>{birthDate}</div>
                        <div>{age}</div>
                      </div>
                    </div>
                    {/* Address */}
                    {currentUser.address.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 relative"
                        >
                          {item.type === "home" && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
                                Primary
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            {item.type === "home" ? (
                              <RiHome8Line className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}

                            <span>Address</span>
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="text-gray-400 capitalize">
                              {item.type}
                            </span>
                            <div>{item.addressLine1}</div>
                            <div>{item.addressLine2}</div>
                            <div>
                              {item.city}&nbsp;{item.stateOrProvince}
                            </div>
                            <div>
                              {item.barangay}&nbsp;{item.zipCode}
                            </div>
                            <div>{item.country}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Employment Section */}
                <div className="flex flex-col">
                  <h2 className="text-xl text-gray-900 mb-6">Employment</h2>
                  <div className="bg-gray-50 rounded-lg p-4 h-10"></div>
                </div>

                {/* Education Section */}
                <div className="flex flex-col">
                  <h2 className="text-xl text-gray-900 mb-6">Education</h2>
                  <div className="bg-gray-50 rounded-lg p-4 h-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-30"></div>
      </div>
    </div>
  );
};
