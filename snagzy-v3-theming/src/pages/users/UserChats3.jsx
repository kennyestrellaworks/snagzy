import { useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../../context/DataContext";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { isoToRegularTimestamp } from "../../utils/helpers";
import { ChatBadge } from "../../components/Badges";
import { ThreeGridProfilePicture } from "../../components/ChatProfile/ThreeGridProfilePicture";
import { FourGridProfilePicture } from "../../components/ChatProfile/FourGridProfilePicture";
import { TwoGridProfilePicture } from "../../components/ChatProfile/TwoGridProfilePicture";

export const UserChats3 = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Search params
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedConversationId = searchParams.get("selected_chat");

  const { chats, currentUser } = useOutletContext();
  // console.log("chats", chats);

  const {
    getUserById,
    getConversationLastItem,
    getMessagesByConversationId,
    getAllChatTabs,
  } = useData();

  // Create detailed chats with user information
  const chatsDetailed = useMemo(() => {
    return chats.map((chat) => ({
      ...chat,
      participants: chat.participants.map((participant) => {
        const user = getUserById(participant._id);
        return {
          ...participant,
          firstName: user?.firstName || "",
          middleName: user?.middleName || "",
          lastName: user?.lastName || "",
          jobTitle: user?.jobTitle || "",
          isOnline: user?.isOnline || false,
          gender: user?.gender || "",
          image: user?.image || null,
        };
      }),
    }));
  }, [chats, getUserById]);
  // console.log("chatsDetailed", chatsDetailed);

  const activeTab = searchParams.get("tab") || "chattabsjakBfd56GJ1liyfds135"; // Fallback to default

  const chatTabs = getAllChatTabs();
  const activeTabObject = chatTabs.find((tab) => tab._id === activeTab);
  const ActiveComponent = activeTabObject?.component;
  // console.log("ActiveComponent", ActiveComponent);

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

  const selectedConversation = chatsDetailed.filter(
    (item) => item._id === selectedConversationId,
  );
  // console.log("selectedConversation", selectedConversation);

  // Filtering chatsDetailed
  const filteredChats = useMemo(() => {
    if (!searchTerm.trim()) return chatsDetailed;

    const lowercasedSearch = searchTerm.toLowerCase().trim();

    return chatsDetailed.filter((chat) => {
      // Search through all participants' names
      return chat.participants.some((participant) => {
        const fullName =
          `${participant.firstName} ${participant.middleName} ${participant.lastName}`.toLowerCase();
        const firstName = participant.firstName.toLowerCase();
        const middleName = participant.middleName.toLowerCase();
        const lastName = participant.lastName.toLowerCase();

        return (
          fullName.includes(lowercasedSearch) ||
          firstName.includes(lowercasedSearch) ||
          middleName.includes(lowercasedSearch) ||
          lastName.includes(lowercasedSearch)
        );
      });
    });
  }, [chatsDetailed, searchTerm]);

  return (
    <div className="flex-1 overflow-hidden bg-gray-100">
      <div className="grid grid-cols-[1.5fr_4.5fr_1.5fr] h-full overflow-hidden gap-4 p-4">
        {/* Box 1 */}
        <div className="flex flex-col w-full h-full overflow-hidden">
          {filteredChats.length === 0 ? (
            <LengthIsZeroError
              title="No data found"
              message="Something went wrong while fetching the data!"
            />
          ) : (
            <div className="flex flex-col bg-white border border-slate-300 rounded-lg h-full overflow-hidden">
              <div className="flex p-2 border-b border-slate-300 shrink-0">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full p-3 pr-10 text-sm leading-tight text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Search conversations..."
                />
              </div>
              {/* Clickable conversation list  */}
              <div className="flex-1 w-full overflow-y-auto min-h-0">
                <div className="flex flex-col">
                  {filteredChats.map((item, index) => {
                    // Clicked item from conversation list.
                    const isSelected = item._id === selectedConversationId;

                    // For a specific conversation item:
                    const chatCreator = item.participants.find(
                      (participant) => participant.roleInChat === "creator",
                    );
                    const creatorDetails = chatCreator
                      ? getUserById(chatCreator._id)
                      : null;

                    // For only 2 participants.
                    const otherPerson = item.participants.find(
                      (item) => item.roleInChat !== "creator",
                    );

                    // Check if someone is online among participants.
                    const someoneOnline = item.participants.some(
                      (participant) => participant.isOnline === true,
                    );

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set("selected_chat", item._id);
                          setSearchParams(newParams);
                        }}
                        className={`flex flex-col gap-1 p-2 w-full text-left cursor-pointer border-b border-gray-300 last:border-0 hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-blue-100" : ""
                        }`}
                      >
                        <div className="flex">
                          <ChatBadge id={item._id} />
                        </div>
                        <div className="flex gap-2 w-full">
                          <div className="relative shrink-0 flex items-center justify-center">
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
                            {someoneOnline && (
                              <div className="absolute top-0 left-0">
                                <div className="flex border-2 border-white rounded-full bg-green-500 h-4 w-4"></div>
                              </div>
                            )}

                            {item.participants.length > 4 ? (
                              <div className="absolute bg-white/90 text-[12px] font-bold px-1.5 rounded-md">{`+${
                                item.participants.length - 4
                              }`}</div>
                            ) : null}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            {item.participants.length === 2 ? (
                              <h1 className="font-semibold text-[16px] leading-tight truncate">
                                {`${creatorDetails?.firstName} & `}
                                {otherPerson?.firstName}
                              </h1>
                            ) : item.participants.length === 3 ? (
                              <h1 className="font-semibold text-[16px] leading-tight truncate">{`${creatorDetails?.firstName} & 2 others`}</h1>
                            ) : item.participants.length === 4 ? (
                              <h1 className="font-semibold text-[16px] leading-tight truncate">{`${creatorDetails?.firstName} & 3 others`}</h1>
                            ) : item.participants.length > 4 ? (
                              <h1 className="font-semibold text-[16px] leading-tight truncate">
                                {`${creatorDetails?.firstName} & ${
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
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Box 1 ends */}
        {/* Box 2 */}
        <div
          className={`flex flex-col bg-white border ${selectedConversation.length === 0 ? "border-slate-300" : "border-blue-400"} rounded-lg h-full overflow-hidden`}
        >
          {selectedConversation.length === 0 ? (
            <LengthIsZeroError
              title="No Chat Selected"
              message="Choose a chat from the list to start viewing messages."
            />
          ) : (
            <div className="flex flex-col rounded-lg h-full overflow-hidden">
              {/* Header  */}
              <div className="flex items-center gap-6 justify-between p-2 border-b border-slate-300 shrink-0">
                {selectedConversation.map((item, index) => {
                  // For a specific conversation item:
                  const chatCreator = item.participants.find(
                    (participant) => participant.roleInChat === "creator",
                  );
                  const creatorDetails = chatCreator
                    ? getUserById(chatCreator._id)
                    : null;

                  const otherPerson = item.participants.find(
                    (item) => item.roleInChat !== "creator",
                  );

                  // Check if someone is online among participants.
                  const someoneOnline = item.participants.some(
                    (participant) => participant.isOnline === true,
                  );

                  return (
                    <div key={index} className="flex gap-2">
                      <div className="relative shrink-0 flex items-center justify-center">
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
                        {someoneOnline && (
                          <div className="absolute top-0 left-0">
                            <div className="flex border-2 border-white rounded-full bg-green-500 h-4 w-4"></div>
                          </div>
                        )}

                        {item.participants.length > 4 ? (
                          <div className="absolute bg-white/90 text-[12px] font-bold px-1.5 rounded-md">{`+${
                            item.participants.length - 4
                          }`}</div>
                        ) : null}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        {item.participants.length === 2 ? (
                          <h1 className="font-semibold text-[16px] leading-tight truncate">
                            {`${creatorDetails?.firstName} & ${
                              otherPerson?.firstName
                            }`}
                          </h1>
                        ) : item.participants.length === 3 ? (
                          <h1 className="font-semibold text-[16px] leading-tight truncate">{`${
                            creatorDetails?.firstName
                          } & 2 others`}</h1>
                        ) : item.participants.length === 4 ? (
                          <h1 className="font-semibold text-[16px] leading-tight truncate">{`${
                            creatorDetails?.firstName
                          } & 3 others`}</h1>
                        ) : item.participants.length > 4 ? (
                          <h1 className="font-semibold text-[16px] leading-tight truncate">
                            {`${creatorDetails?.firstName} & ${
                              item.participants.length - 1
                            } others`}
                          </h1>
                        ) : null}
                        <p className="text-[14px] text-gray-600 leading-tight truncate">
                          {/* {item.lastMessage} */}
                          {getConversationLastItem(item._id)}
                        </p>
                        <p className="mt-2 text-[12px] leading-tight text-gray-500">
                          {isoToRegularTimestamp(item.lastMessageTime)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div className="flex w-full">
                  <input
                    type="text"
                    className="flex-1 p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Search a message..."
                  />
                </div>
              </div>
              {/* Header ends */}
              {/* Conversation list  */}
              <div className="flex-1 w-full overflow-y-auto min-h-0 p-2">
                <div className="flex flex-col">
                  {renderSelectedConversationMessage.map((item, index) => {
                    const sender = getUserById(item.senderId);

                    return (
                      <div
                        key={index}
                        className={`flex gap-2 mb-4 ${
                          sender._id !== currentUser._id
                            ? ""
                            : "flex-row-reverse"
                        }`}
                      >
                        <div className="flex shrink-0">
                          <div className="relative">
                            <img
                              src={sender.image}
                              alt={sender.firstName + " " + sender.lastName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {sender.isOnline ? (
                              <div className="absolute  w-3 h-3 top-0 bg-green-500 border-2 border-white rounded-full"></div>
                            ) : null}
                          </div>
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
                                  clipPath:
                                    "polygon(100% 100%, 0% 100%, 0% 0%)",
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
              {/* Conversation list ends */}
            </div>
          )}
        </div>
        {/* Box 2 ends */}
        {/* Box 3  */}
        <div className="flex flex-col bg-white border border-slate-300 rounded-lg h-full overflow-hidden">
          {/* Header - fixed at top */}
          <div className="flex items-center w-full border-b border-slate-300 shrink-0">
            <div className="flex w-full">
              {/* Chat tabs */}
              {chatTabs.length === 0 ? (
                <p>No data found</p>
              ) : (
                chatTabs.map((item, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set("tab", item._id);
                        setSearchParams(newParams);
                      }}
                      className={`flex-1 py-2 text-sm font-medium transition-all cursor-pointer leading-tight ${
                        activeTab === item._id
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })
              )}
            </div>
          </div>
          {/* Header ends  */}
          {/* Scrollable content - takes remaining height */}
          <div className="flex-1 w-full overflow-y-auto min-h-0 p-2">
            {ActiveComponent && selectedConversation.length > 0 && (
              <ActiveComponent
                chatParticipants={selectedConversation[0].participants}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
