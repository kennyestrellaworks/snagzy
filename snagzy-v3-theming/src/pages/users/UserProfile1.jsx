import { useOutletContext } from "react-router-dom";
import { User } from "../../components/SVG";

export const UserProfile1 = () => {
  const { currentUser } = useOutletContext();
  console.log("currentUser", currentUser);

  return (
    <div className="h-full w-full bg-white">
      {/* Scrollable container with background */}
      <div className="h-full w-full overflow-y-auto bg-green-200 custom-scrollbar">
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
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500 border-2 border-white">
                    @
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                    New
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
              {/* User ID Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <User className="w-4 h-4" />
                  <span>User Id</span>
                </div>
                <div className="text-sm text-gray-700 break-all">
                  people1518582sybguno
                </div>
              </div>
            </div>

            {/* Main Content - fills remaining space */}
            <div className="flex-1 min-w-0">
              <div className="border border-gray-600 rounded-lg bg-white p-8">
                {/* User Section */}
                <h2 className="text-xl text-gray-900 mb-6">User</h2>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Short Bio */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Short Bio</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Creative storyteller and illustrator who loves bringing
                      small wonders to life.
                    </p>
                  </div>
                  {/* Name */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Name</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>First Name: Dawn</div>
                      <div>Middle Name: Jackson</div>
                      <div>Last Name: Sullivan</div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <h2 className="text-xl text-gray-900 mb-6">Contact</h2>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* Phone */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Phone</span>
                    </div>
                    <p className="text-sm text-gray-700">+639074905700</p>
                  </div>
                  {/* Emergency */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Emergency</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div>Husband</div>
                      <div>Charles Sullivan</div>
                      <div>+639962620300</div>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      dawn.sullivan@gmail.com
                    </p>
                  </div>
                </div>

                {/* Personal Information Section */}
                <h2 className="text-xl text-gray-900 mb-6">
                  Personal Information
                </h2>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* Birth Date */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Birth Date</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div>Aug 9 1996</div>
                      <div>29 yrs</div>
                    </div>
                  </div>
                  {/* Address - Home (Primary) */}
                  <div className="bg-gray-50 rounded-lg p-4 relative">
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
                        Primary
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Address</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div>Home</div>
                      <div>13450 Nicholas Trail Suite</div>
                      <div>095 Chelseamouth, ME,</div>
                      <div>32554, United States</div>
                    </div>
                  </div>

                  {/* Address - Other */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Address</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div>Other</div>
                      <div>Purok 38 Sta, Catalina,</div>
                      <div>Negros Occidental, Tibolo</div>
                      <div>6769, Philippines</div>
                    </div>
                  </div>
                </div>

                {/* Employment Section */}
                <h2 className="text-xl text-gray-900 mb-6">Employment</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-8 h-20"></div>

                {/* Education Section */}
                <h2 className="text-xl text-gray-900 mb-6">Education</h2>
                <div className="bg-gray-50 rounded-lg p-4 h-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
