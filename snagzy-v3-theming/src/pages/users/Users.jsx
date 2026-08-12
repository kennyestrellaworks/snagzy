import { Link } from "react-router-dom";
import {
  AmountFormatSmall,
  AmountFormatSmallThin,
} from "../../components/AmountFormat";
import { GenderBadge, ItemStatusBadge } from "../../components/Badges";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { PageHeader } from "../../components/PageHeader";
import { TextNormal } from "../../components/Text";
import { UserDetail } from "../../components/UserDetail";
import { useData } from "../../context/DataContext";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { birthDateFormatter, getAge } from "../../utils/helpers";
import { FaEye } from "../../components/SVG";
import {
  IconedEmail,
  IconedPhone,
  IconedAddress,
} from "../../components/IconedValue";
import {
  pendingOrderStatuses,
  successfulOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../../data/orderLifeCycle";

export const Users = () => {
  const {
    getAllUsers,
    getAllItemStatus,
    getConversationByPersonId,
    getOrdersByBuyerId,
    getAllReviewsOfPersonId,
    setSelectedUserId,
  } = useData();

  // Order analaytics context.
  const ordersAnalytics = useOrdersAnalytics();
  const {
    // getSuccessfullPurchaseTotal,
    // getPendingPurchaseTotal,
    getOrderTotalPriceByOrdersOFAUser,
  } = ordersAnalytics.ordersAnalyticsValue;

  const users = getAllUsers();
  const itemStatus = getAllItemStatus();
  // const

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      {/* Header  */}
      <div className="sticky w-full top-0 z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          <div className="flex gap-2">
            <PageHeader defaultPage="Analytics" type="sidebar-level" />
          </div>
        </div>
      </div>
      {/* Header ends */}
      {/* Table header  */}
      <div className="sticky w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[2.6fr_2.4fr_1fr_1fr_1fr_.5fr_1fr_.5fr_.6fr_.5fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">User Detail</div>
            <div className="flex border-r border-gray-300 p-1">User Info</div>
            <div className="flex border-r border-gray-300 p-1">Age</div>
            <div className="flex border-r border-gray-300 p-1">Status</div>
            <div className="flex border-r border-gray-300 p-1">Gender</div>
            <div className="flex border-r border-gray-300 p-1">Chats</div>
            <div className="flex border-r border-gray-300 p-1">Spending</div>
            <div className="flex border-r border-gray-300 p-1">Wishlist</div>
            <div className="flex border-r border-gray-300 p-1">Reviews</div>
            <div className="flex border-r border-gray-300 p-1"></div>
          </div>
          <div className="flex w-2 bg-blue-100"></div>
        </div>
      </div>
      {/* Table header ends */}
      {/* List area */}
      <div className="flex w-full overflow-y-auto bg-white custom-scrollbar">
        <div className="flex flex-col w-full">
          {users.length === 0 ? (
            <LengthIsZeroError
              title="No data found"
              message="Something went wrong while fetching the data!"
            />
          ) : (
            users.map((user, index) => {
              // Product status
              const profileStatus = itemStatus.find(
                (item) => item._id === user.profileStatus,
              );

              // Birthdate
              const birthDate = birthDateFormatter(user.birthDate);
              const age = getAge(user.birthDate) + " years";

              // Conversations / chats.
              const chats = getConversationByPersonId(user._id)?.length;

              // Orders by this person.
              const ordersByThisPerson = getOrdersByBuyerId(user._id);

              // Total spent
              const purchasedAmountTotal = getOrderTotalPriceByOrdersOFAUser(
                successfulOrderStatuses,
                ordersByThisPerson,
              );
              // Pending spent
              const pendingAmountTotal = getOrderTotalPriceByOrdersOFAUser(
                pendingOrderStatuses,
                ordersByThisPerson,
              );
              // Cancellations spent
              const cancellationsAmountTotal =
                getOrderTotalPriceByOrdersOFAUser(
                  unsuccessfulOrderStatuses,
                  ordersByThisPerson,
                );

              // Reviews by this person
              const reviewsByThisPerson = getAllReviewsOfPersonId(user._id);

              // Primary address of this person
              const primaryAddress = user.address?.find(
                (address) => address.isDefault === true,
              );
              // console.log("primaryAddress", primaryAddress);
              // console.log("user", user);

              return (
                <div key={index} className="flex flex-col w-full">
                  <div
                    key={index}
                    className={`grid grid-cols-[2.6fr_2.4fr_1fr_1fr_1fr_.5fr_1fr_.5fr_.6fr_.5fr] border-b border-gray-300 bg-white ${profileStatus?.slug === "inactive" ? "opacity-50" : profileStatus?.slug === "active" ? "" : ""} hover:bg-blue-50/30 transition-all duration-300 ease-in-out`}
                  >
                    {/* User detail box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col gap-2">
                        <UserDetail object={user} />
                      </div>
                    </div>
                    {/* User info box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col text-[14px]">
                        <IconedEmail data={user.contact?.email} />
                        <IconedPhone data={user.contact?.phone} />
                        <IconedAddress data={primaryAddress} />
                      </div>
                    </div>
                    {/* Birth date box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col">
                        <TextNormal text={birthDate} />
                        <TextNormal text={age} />
                      </div>
                    </div>
                    {/* Profile status box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col gap-2">
                        <ItemStatusBadge statusId={user.profileStatus} />
                      </div>
                    </div>
                    {/* Gender box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col gap-2">
                        <GenderBadge gender={user.gender} />
                      </div>
                    </div>
                    {/* Chats box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col gap-2">
                        <TextNormal text={chats} />
                      </div>
                    </div>
                    {/* Spending box */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      {(() => {
                        // 1. Strip commas and convert strings to actual floating numbers safely
                        const spentNum =
                          parseFloat(
                            String(purchasedAmountTotal).replace(/,/g, ""),
                          ) || 0;
                        const pendingNum =
                          parseFloat(
                            String(pendingAmountTotal).replace(/,/g, ""),
                          ) || 0;
                        const cancelNum =
                          parseFloat(
                            String(cancellationsAmountTotal).replace(/,/g, ""),
                          ) || 0;

                        // 2. Check if absolutely everything is zero
                        if (
                          spentNum === 0 &&
                          pendingNum === 0 &&
                          cancelNum === 0
                        ) {
                          return (
                            <p className="text-sm text-gray-500">No Data</p>
                          );
                        }

                        return (
                          <div className="flex items-start flex-col gap-2">
                            {/* 3. Now > 0 checks will work flawlessly because they are pure numbers */}
                            {spentNum > 0 && (
                              <div className="flex flex-col">
                                <p className="text-[12px] text-gray-400 leading-tight">
                                  Spent:
                                </p>
                                {/* Pass the original value back to your formatter component */}
                                <AmountFormatSmallThin
                                  amount={purchasedAmountTotal}
                                />
                              </div>
                            )}

                            {pendingNum > 0 && (
                              <div className="flex flex-col">
                                <p className="text-[12px] text-gray-400 leading-tight">
                                  Pending:
                                </p>
                                <AmountFormatSmallThin
                                  amount={pendingAmountTotal}
                                />
                              </div>
                            )}

                            {cancelNum > 0 && (
                              <div className="flex flex-col">
                                <p className="text-[12px] text-gray-400 leading-tight">
                                  Cancellations:
                                </p>
                                <AmountFormatSmallThin
                                  amount={cancellationsAmountTotal}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    {/* Wishlist box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col">
                        {user.wishlist.length === 0 ? (
                          <TextNormal text="NA" />
                        ) : (
                          <TextNormal text={user.wishlist.length} />
                        )}
                      </div>
                    </div>
                    {/* Reviewed products box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col">
                        {reviewsByThisPerson.length === 0 ? (
                          <TextNormal text="NA" />
                        ) : (
                          <TextNormal text={reviewsByThisPerson.length} />
                        )}
                      </div>
                    </div>
                    <div className="flex p-2">
                      <div className="flex items-start">
                        <Link
                          to={`/users/${user?.slug}/${user._id}`}
                          state={{
                            backUrl:
                              location.pathname +
                              location.search +
                              location.hash,
                          }}
                          onClick={() => setSelectedUserId(user._id)}
                          className="cursor-pointer outline-0 text-gray-400 hover:text-gray-500 transition-all ease-in-out"
                        >
                          <FaEye height={16} width={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
