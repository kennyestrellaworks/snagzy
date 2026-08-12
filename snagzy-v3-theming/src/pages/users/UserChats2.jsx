import { useOutletContext } from "react-router-dom";
import { Search } from "../../components/SVG";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { useEffect, useMemo, useRef, useState } from "react";
import { TwoGridProfilePicture } from "../../components/ChatProfile/TwoGridProfilePicture";
import { ThreeGridProfilePicture } from "../../components/ChatProfile/ThreeGridProfilePicture";
import { FourGridProfilePicture } from "../../components/ChatProfile/FourGridProfilePicture";
import { useData } from "../../context/DataContext";
import { isoToRegularTimestamp } from "../../utils/helpers";

export const UserChats2 = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const { chats, currentUser } = useOutletContext();
  const {
    getUserById,
    getOtherPerson,
    getConversationLastItem,
    getMessagesByConversationId,
  } = useData();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversationId]);

  // Render selected chat sorted to the latest message.
  const renderSelectedConversationMessage = useMemo(() => {
    return getMessagesByConversationId(selectedConversationId).sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
  }, [selectedConversationId, getMessagesByConversationId]);
  // console.log("THIS", renderSelectedConversationMessage);

  const selectedConversation = chats.filter(
    (item) => item._id === selectedConversationId,
  );
  // console.log("selectedConversation", selectedConversation);

  return (
    <div className="flex-1 overflow-hidden bg-gray-100">
      <div className="grid grid-cols-[2fr_4fr_1.5fr] h-full overflow-hidden gap-4 p-4">
        {/* Box 1 - FIXED: Added proper height constraints */}
        <div className="flex flex-col w-full h-full overflow-hidden">
          {chats.length === 0 ? (
            <LengthIsZeroError
              title="No data found"
              message="Something went wrong while fetching the data!"
            />
          ) : (
            <div className="flex flex-col bg-white border border-slate-300 rounded-lg h-full overflow-hidden">
              <div className="flex p-2 border-b border-slate-300 shrink-0">
                <input
                  type="text"
                  className="block w-full p-3 pr-10 text-sm leading-tight text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Search conversations..."
                />
              </div>

              <div className="flex-1 w-full overflow-y-auto min-h-0">
                <div className="flex flex-col">
                  {chats.map((item, index) => {
                    const isSelected = item._id === selectedConversationId;

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedConversationId(item._id)}
                        className={`conversation flex gap-2 p-2 border-b border-gray-300 w-full text-left hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-blue-100" : ""
                        }`}
                      >
                        <div
                          key={`profile-${item._id}`}
                          className="relative shrink-0 flex items-center justify-center"
                        >
                          {item.participants.length === 3 ? (
                            <ThreeGridProfilePicture
                              participants={item.participants}
                            />
                          ) : item.participants.length > 3 ? (
                            <FourGridProfilePicture
                              participants={item.participants}
                            />
                          ) : (
                            <TwoGridProfilePicture
                              participants={item.participants}
                            />
                          )}
                          <div className="absolute top-0 left-0">
                            <div className="flex border-2 border-white rounded-full bg-green-700 h-4 w-4"></div>
                          </div>
                          {item.participants.length > 4 ? (
                            <div className="absolute bg-white/90 text-[12px] font-bold px-1.5 rounded-md">{`+${
                              item.participants.length - 4
                            }`}</div>
                          ) : null}
                        </div>
                        <div
                          key={`title-${item._id}`}
                          className="flex flex-col flex-1 min-w-0"
                        >
                          {item.participants.length === 2 ? (
                            <h1 className="font-semibold text-[16px] leading-tight truncate">
                              {`${getUserById(item.createdBy)?.firstName} & `}
                              {getOtherPerson(item.participants)?.firstName}
                            </h1>
                          ) : item.participants.length === 3 ? (
                            <h1 className="font-semibold text-[16px] leading-tight truncate">{`${
                              getUserById(item.createdBy)?.firstName
                            } & 2 others`}</h1>
                          ) : item.participants.length === 4 ? (
                            <h1 className="font-semibold text-[16px] leading-tight truncate">{`${
                              getUserById(item.createdBy)?.firstName
                            } & 3 others`}</h1>
                          ) : item.participants.length > 4 ? (
                            <h1 className="font-semibold text-[16px] leading-tight truncate">
                              {`${getUserById(item.createdBy)?.firstName} & ${
                                item.participants.length - 1
                              } others`}
                            </h1>
                          ) : null}
                          <p className="text-[14px] text-gray-600 truncate">
                            {getConversationLastItem(item._id)}
                          </p>
                          <p className="mt-2 text-[12px] text-gray-500">
                            {isoToRegularTimestamp(item.lastMessageTime)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Box 2 */}
        <div className="flex flex-col bg-white border border-slate-300 rounded-lg h-full overflow-hidden">
          {selectedConversation.length === 0 ? (
            <LengthIsZeroError
              title="No Chat Selected"
              message="Choose a chat from the list to start viewing messages."
            />
          ) : (
            <div className="flex-1 bg-white w-full">
              {/* Header  */}
              <div className="flex items-center w-full border-b border-slate-300 p-2">
                <div className="flex w-full gap-2 justify-between">
                  <div
                    key={`selected-profile-${selectedConversation[0]._id}`}
                    className="relative shrink-0 flex items-center justify-center"
                  >
                    {selectedConversation[0].participants.length === 3 ? (
                      <ThreeGridProfilePicture
                        participants={selectedConversation[0].participants}
                      />
                    ) : selectedConversation[0].participants.length > 3 ? (
                      <FourGridProfilePicture
                        participants={selectedConversation[0].participants}
                      />
                    ) : (
                      <TwoGridProfilePicture
                        participants={selectedConversation[0].participants}
                      />
                    )}
                    <div className="absolute top-0 left-0">
                      <div className="flex border-2 border-white rounded-full bg-green-700 h-4 w-4"></div>
                    </div>
                    {selectedConversation[0].participants.length > 4 ? (
                      <div className="absolute bg-white/90 text-[12px] font-bold px-1.5 rounded-md">{`+${
                        selectedConversation[0].participants.length - 4
                      }`}</div>
                    ) : null}
                  </div>
                  <div
                    key={`selected-title-${selectedConversation[0]._id}`}
                    className="flex flex-col flex-1 min-w-0"
                  >
                    {selectedConversation[0].participants.length === 2 ? (
                      <h1 className="font-semibold text-[16px] leading-tight truncate">
                        {`${
                          getUserById(selectedConversation[0].createdBy)
                            ?.firstName
                        } & ${
                          getOtherPerson(selectedConversation[0].participants)
                            ?.firstName
                        }`}
                      </h1>
                    ) : selectedConversation[0].participants.length === 3 ? (
                      <h1 className="font-semibold text-[16px] leading-tight truncate">{`${
                        getUserById(selectedConversation[0].createdBy)
                          ?.firstName
                      } & 2 others`}</h1>
                    ) : selectedConversation[0].participants.length === 4 ? (
                      <h1 className="font-semibold text-[16px] leading-tight truncate">{`${
                        getUserById(selectedConversation[0].createdBy)
                          ?.firstName
                      } & 3 others`}</h1>
                    ) : selectedConversation[0].participants.length > 4 ? (
                      <h1 className="font-semibold text-[16px] leading-tight truncate">
                        {`${
                          getUserById(selectedConversation[0].createdBy)
                            ?.firstName
                        } & ${
                          selectedConversation[0].participants.length - 1
                        } others`}
                      </h1>
                    ) : null}
                    <p className="text-[14px] text-gray-600 leading-tight truncate">
                      {/* {selectedConversation[0].lastMessage} */}
                      {getConversationLastItem(selectedConversation[0]._id)}
                    </p>
                    <p className="mt-2 text-[12px] leading-tight text-gray-500">
                      {isoToRegularTimestamp(
                        selectedConversation[0].lastMessageTime,
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="block w-full p-3 pr-10 text-sm leading-tight text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Search conversations..."
                    />
                  </div>
                </div>
              </div>
              {/* Header ends */}
              <div className="flex flex-col p-4 overflow-y-auto rounded min-h-0">
                {renderSelectedConversationMessage.map((item, index) => {
                  const sender = getUserById(item.senderId);

                  return (
                    <div
                      key={index}
                      className={`flex gap-2 mb-4 ${
                        sender._id !== currentUser._id ? "" : "flex-row-reverse"
                      }`}
                    >
                      <div className="flex shrink-0">
                        <img
                          src={sender.image}
                          alt={sender.firstName + " " + sender.lastName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="relative">
                          <div
                            className={`px-4 py-2 rounded-tl-2xl rounded-tr-2xl ${
                              sender._id !== currentUser._id
                                ? "rounded-br-2xl bg-gray-200 text-gray-800"
                                : "rounded-bl-2xl bg-blue-700 text-white"
                            } text-[15px] max-w-xs  `}
                          >
                            {item.text}
                          </div>
                          {sender._id !== currentUser._id ? (
                            <div
                              className={`absolute bottom-0 -left-2 bg-gray-200 w-3 h-3`}
                              style={{
                                clipPath:
                                  "polygon(100% 0%, 0% 100%, 100% 100%)",
                              }}
                            ></div>
                          ) : (
                            <div
                              className={`absolute bottom-0 -right-2 bg-blue-700 w-3 h-3`}
                              style={{
                                clipPath: "polygon(100% 100%, 0% 100%, 0% 0%)",
                              }}
                            ></div>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 mt-1">
                          {isoToRegularTimestamp(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Box 3 */}
        <div className="flex flex-col bg-white border border-slate-300 rounded-lg h-full overflow-hidden">
          THIS
        </div>
      </div>
    </div>
  );
};
