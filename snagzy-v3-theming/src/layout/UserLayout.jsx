import { NavLink, Outlet, useParams } from "react-router-dom";
import { LengthIsZeroErrorSmall } from "../components/LengthIsZeroError";
import { PageHeader } from "../components/PageHeader";
import { useData } from "../context/DataContext";
import { UserDetail } from "../components/UserDetail";
import { TextNormal } from "../components/Text";
import { birthDateFormatter, getAge } from "../utils/helpers";
import { useOrdersAnalytics } from "../context/OrdersAnalyticsContext";
import {
  AmountFormatSmall,
  AmountFormatSmallThin,
} from "../components/AmountFormat";
import {
  AddressTextIconed,
  EmailTextIconed,
  PhoneTextIconed,
} from "../components/TextIconed";
import { useState } from "react";
import { IoIosArrowDown } from "../components/SVG";

export const UserLayout = () => {
  const [userSummaryOpen, setUserSummaryOpen] = useState(true);
  const { userId } = useParams();
  const {
    getUserById,
    getUserLayoutNavLinks,
    getOrdersByBuyerId,
    getConversationByPersonId,
    getAllReviewsOfPersonId,
    getAllAttributes,
  } = useData();

  // Hide/show Product summary area
  const toggleSidebar = () => setUserSummaryOpen(!userSummaryOpen);

  // Attributes
  const attributes = getAllAttributes();

  // Order analaytics context.
  const ordersAnalytics = useOrdersAnalytics();
  const { getSuccessfullPurchaseTotal, getPendingPurchaseTotal } =
    ordersAnalytics.ordersAnalyticsValue;

  // Current user
  const currentUser = getUserById(userId);

  // User layout nav links
  const userLayoutNavLinks = getUserLayoutNavLinks();

  // Birthdate by this person
  const birthDate = birthDateFormatter(currentUser.birthDate);
  const age = getAge(currentUser.birthDate) + " years";

  // Orders by this person.
  const ordersByThisPerson = getOrdersByBuyerId(currentUser._id);

  // Successful purchases.
  const successfullPurchaseTotal =
    getSuccessfullPurchaseTotal(ordersByThisPerson);

  // Pending purchases
  const pendingPurchaseTotal = getPendingPurchaseTotal(ordersByThisPerson);

  // Conversations / chats.
  const chats = getConversationByPersonId(currentUser._id);
  // console.log("chats", chats);

  // Reviews by this person
  const reviewsByThisPerson = getAllReviewsOfPersonId(currentUser._id);

  // URL information
  // const location = useLocation();
  // const currentLocation = userLayoutNavLinks.filter((navLink) =>
  //   location.pathname.includes(navLink.link),
  // );
  // const urlHasChat = currentLocation.some((item) => item.link === "chats");

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="w-full top-0 z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          <div className="flex gap-2 justify-between pb-2">
            <PageHeader defaultPage="Profile" type="user-level" prefix="User" />
            <div className="flex items-center gap-1">
              {/* Horizontal navlink  */}
              <div className="flex">
                {userLayoutNavLinks.length === 0 ? (
                  <LengthIsZeroErrorSmall />
                ) : (
                  userLayoutNavLinks.map((userLayoutNavLink, index) => {
                    // For Orders link, check if current path starts with "orders"
                    // For other links, check exact match
                    const isOrdersLink = userLayoutNavLink.link === "orders";

                    return (
                      <NavLink
                        key={index}
                        to={userLayoutNavLink.link}
                        end={!isOrdersLink} // Only use 'end' for non-orders links
                        className={({ isActive }) =>
                          `w-full flex items-center gap-2 py-1 px-2 text-[12px] rounded-md transition-all ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`
                        }
                      >
                        <userLayoutNavLink.icon height={"14"} width={"14"} />
                        <span
                          className={`truncate transition-opacity duration-200 ease-in-out `}
                        >
                          {userLayoutNavLink.label}
                        </span>
                      </NavLink>
                    );
                  })
                )}
              </div>
              {/* Horizontal navlink ends */}
              {/* Collapse button  */}
              <button
                onClick={toggleSidebar}
                className={`flex ${userSummaryOpen ? "bg-gray-200" : "bg-gray-100"} rounded px-1 py-1 hover:bg-gray-200 cursor-pointer`}
              >
                <IoIosArrowDown
                  height={16}
                  width={16}
                  className={`${userSummaryOpen ? "rotate-180" : ""} transition-all duration-300 ease-in-out`}
                />
              </button>
              {/* Collapse button ends */}
            </div>
          </div>
          <div
            className={`grid grid-cols-[2.5fr_2fr_3fr_1fr_1fr_.8fr] gap-2 w-full overflow-hidden`}
          >
            {/* User detail box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${userSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col items-start gap-2">
                <UserDetail object={currentUser} showStatus={true} />
              </div>
            </div>
            {/* User detail box ends */}
            {/* User info box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${userSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col items-start gap-2">
                <p className="text-[12px] leading-tight text-gray-500">
                  Contact:
                </p>
                <div className="flex flex-col">
                  <EmailTextIconed object={currentUser} />
                  <PhoneTextIconed object={currentUser} />
                </div>
              </div>
            </div>
            {/* User info box ends */}
            {/* User info box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${userSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col items-start gap-2">
                <p className="text-[12px] leading-tight text-gray-500">
                  Address:
                </p>
                <AddressTextIconed object={currentUser} />
              </div>
            </div>
            {/* User info box ends */}
            {/* Birth date box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${userSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col items-start gap-2">
                <p className="text-[12px] leading-tight text-gray-500">
                  Birth date:
                </p>
                <div className="flex items-start flex-col">
                  <TextNormal text={birthDate} />
                  <TextNormal text={age} />
                </div>
              </div>
            </div>
            {/* Birth date box ends */}
            {/* Spending box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${userSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col items-start gap-2">
                <div className="flex">
                  <div className="flex items-start flex-col gap-2">
                    <div className="flex flex-col">
                      <p className="text-[12px] leading-tight text-gray-500">
                        Spent:
                      </p>
                      <AmountFormatSmall amount={successfullPurchaseTotal} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[12px] leading-tight text-gray-500">
                        Pending:
                      </p>
                      <AmountFormatSmallThin amount={pendingPurchaseTotal} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Spending box ends */}
            {/* Chats, wishlist, reviewed box  */}
            <div
              className={`flex border border-blue-100 bg-blue-50 p-2 ${userSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] leading-tight text-gray-500">
                    Chats:{" "}
                  </p>
                  <TextNormal text={chats.length} />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[12px] leading-tight text-gray-500">
                    Wishlist:
                  </p>

                  {currentUser.wishlist.length === 0 ? (
                    <TextNormal text="NA" />
                  ) : (
                    <TextNormal text={currentUser.wishlist.length} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[12px] leading-tight text-gray-500">
                    Reviewed:
                  </p>

                  {reviewsByThisPerson.length === 0 ? (
                    <TextNormal text="NA" />
                  ) : (
                    <TextNormal text={reviewsByThisPerson.length} />
                  )}
                </div>
              </div>
            </div>
            {/* Chats, wishlist, reviewed box ends */}
          </div>
        </div>
      </div>
      <Outlet
        context={{
          currentUser,
          chats,
          ordersByThisPerson,
          attributes,
          reviewsByThisPerson,
        }}
      />
    </div>
  );
};
