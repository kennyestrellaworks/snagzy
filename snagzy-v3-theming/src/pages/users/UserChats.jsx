import { useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../../context/DataContext";
import {
  LengthIsZeroError,
  LengthIsZeroErrorMedium,
} from "../../components/LengthIsZeroError";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { isoToRegularTimestamp } from "../../utils/helpers";
import { ChatBadge } from "../../components/Badges";
import { ThreeGridProfilePicture } from "../../components/ChatProfile/ThreeGridProfilePicture";
import { FourGridProfilePicture } from "../../components/ChatProfile/FourGridProfilePicture";
import { TwoGridProfilePicture } from "../../components/ChatProfile/TwoGridProfilePicture";
import { IoClose, IoSearch } from "../../components/SVG";

export const UserChats = () => {
  // Selected chat params
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedConversationId = searchParams.get("selected_chat");

  // Chat search and params
  const initialChatSearch = searchParams.get("chat_search") || "";
  const [chatSearch, setChatSearch] = useState(initialChatSearch);
  const [chatSearchInput, setChatSearchInput] = useState(initialChatSearch);

  // Message search and params
  const initialMessageSearch = searchParams.get("message_search") || "";
  const [messageSearch, setMessageSearch] = useState(initialMessageSearch);
  const [messageSearchInput, setMessageSearchInput] =
    useState(initialMessageSearch);

  const { chats, currentUser } = useOutletContext();
  // console.log("chats", chats);

  const {
    getUserById,
    getConversationLastItem,
    getMessagesByConversationId,
    getAllChatTabs,
    getUserDetailMinimal,
  } = useData();

  // Create detailed chats with user information
  const chatsDetailed = useMemo(() => {
    return chats.map((chat) => ({
      ...chat,
      participants: chat.participants.map((participant) => {
        const userDetail = getUserDetailMinimal(participant._id);
        return {
          ...participant,
          ...userDetail,
        };
      }),
    }));
  }, [chats, getUserById, getUserDetailMinimal]);
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

  // Url params and state
  useEffect(() => {
    const urlChatSearch = searchParams.get("chat_search") || "";
    const urlMessageSearch = searchParams.get("message_search") || "";

    if (urlChatSearch !== chatSearch) setChatSearch(urlChatSearch);
    if (urlChatSearch !== chatSearchInput) setChatSearchInput(urlChatSearch);

    if (urlMessageSearch !== messageSearch) setMessageSearch(urlMessageSearch);
    if (urlMessageSearch !== messageSearchInput)
      setMessageSearchInput(urlMessageSearch);
  }, [
    searchParams,
    chatSearch,
    chatSearchInput,
    messageSearch,
    messageSearchInput,
  ]);

  // Render selected chat sorted to the latest message.
  const renderSelectedConversationMessage = useMemo(() => {
    return getMessagesByConversationId(selectedConversationId).sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
  }, [selectedConversationId, getMessagesByConversationId]);
  // console.log("THIS", renderSelectedConversationMessage);

  // Filter messages (renderSelectedConversationMessage) based on search
  const filteredMessages = useMemo(() => {
    if (!messageSearch.trim() || !renderSelectedConversationMessage)
      return renderSelectedConversationMessage;

    const lowercasedSearch = messageSearch.toLowerCase().trim();

    return renderSelectedConversationMessage.filter((message) => {
      // Search in message text
      if (message.text?.toLowerCase().includes(lowercasedSearch)) return true;

      // Search in sender name
      const sender = getUserById(message.senderId);
      const senderName =
        `${sender?.firstName || ""} ${sender?.lastName || ""}`.toLowerCase();
      if (senderName.includes(lowercasedSearch)) return true;

      return false;
    });
  }, [renderSelectedConversationMessage, messageSearch, getUserById]);

  const selectedConversation = chatsDetailed.filter(
    (item) => item._id === selectedConversationId,
  );
  // console.log("selectedConversation", selectedConversation);

  // Filtering chatsDetailed - using chatSearch (from URL) not chatSearchInput
  const filteredChats = useMemo(() => {
    if (!chatSearch.trim()) return chatsDetailed;

    const lowercasedSearch = chatSearch.toLowerCase().trim();

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
  }, [chatsDetailed, chatSearch]);

  // Search change handler
  const onSearchChange = (e) => {
    e.preventDefault();
    const val = e.target.value;

    setChatSearchInput(val);
    setChatSearch(val);

    const params = {};

    if (val && val.trim()) {
      params.chat_search = val;
    }
    if (selectedConversationId) params.selected_chat = selectedConversationId;
    if (activeTab) params.tab = activeTab;

    setSearchParams(params);
  };

  // Message search change handler
  const onMessageSearchChange = (e) => {
    e.preventDefault();
    const val = e.target.value;

    setMessageSearchInput(val);
    setMessageSearch(val);

    const params = {};

    if (chatSearch && chatSearch.trim()) params.chat_search = chatSearch;
    if (val && val.trim()) params.message_search = val;
    if (selectedConversationId) params.selected_chat = selectedConversationId;
    if (activeTab) params.tab = activeTab;

    setSearchParams(params);
  };
  return (
    <div className="flex-1 overflow-hidden bg-gray-100">
      <div className="grid grid-cols-[1.5fr_4.5fr_1.5fr] h-full overflow-hidden gap-4 p-4">
        {/* Box 1 */}
        <div className="flex flex-col w-full h-full overflow-hidden">
          <div className="flex flex-col bg-white border border-slate-300 rounded-lg h-full overflow-hidden">
            <div className="flex relative p-2 border-b border-slate-300 shrink-0">
              {/* CHANGED: Input now uses chatSearchInput and onSearchChange */}
              <input
                type="text"
                value={chatSearchInput}
                onChange={onSearchChange}
                className="block w-full p-3 pr-10 text-sm leading-tight text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Search conversations..."
              />
              {/* CHANGED: Icon toggle logic - shows X when there's input, search icon when empty */}
              {chatSearchInput ? (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setChatSearchInput("");
                    setChatSearch("");

                    const params = {};
                    if (selectedConversationId)
                      params.selected_chat = selectedConversationId;
                    if (activeTab) params.tab = activeTab;

                    setSearchParams(params);
                  }}
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <IoClose
                    height={20}
                    width={20}
                    className="text-gray-400 cursor-pointer hover:text-gray-500 transition-all duration-300 ease-in-out"
                  />
                </button>
              ) : (
                <IoSearch
                  height={20}
                  width={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              )}
            </div>
            {/* Clickable conversation list  */}
            <div className="flex-1 w-full overflow-y-auto min-h-0 custom-scrollbar">
              <div className="flex flex-col w-full">
                {filteredChats.length === 0 ? (
                  <div className="flex items-center mt-20">
                    <LengthIsZeroErrorMedium
                      title="No chats found"
                      message="Something went wrong while fetching the data!"
                    />
                  </div>
                ) : (
                  filteredChats.map((item, index) => {
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
                  })
                )}
              </div>
            </div>
          </div>
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
                    <div key={index} className="flex min-w-100 gap-2">
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
                <div className="flex w-full relative">
                  <input
                    type="text"
                    value={messageSearchInput}
                    onChange={onMessageSearchChange}
                    className="flex-1 p-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Search messages by text or sender..."
                  />
                  {messageSearchInput ? (
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setMessageSearchInput("");
                        setMessageSearch("");

                        const params = {};
                        if (chatSearch && chatSearch.trim())
                          params.chat_search = chatSearch;
                        if (selectedConversationId)
                          params.selected_chat = selectedConversationId;
                        if (activeTab) params.tab = activeTab;

                        setSearchParams(params);
                      }}
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <IoClose
                        height={20}
                        width={20}
                        className="text-gray-400 cursor-pointer hover:text-gray-500 transition-all duration-300 ease-in-out"
                      />
                    </button>
                  ) : (
                    <IoSearch
                      height={20}
                      width={20}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  )}
                </div>
              </div>
              {/* Header ends */}
              {/* Conversation list  */}
              <div className="flex-1 w-full overflow-y-auto min-h-0 p-2 custom-scrollbar">
                <div className="flex flex-col">
                  {filteredMessages.length === 0 ? (
                    <div className="flex mt-30">
                      <LengthIsZeroError
                        title="No message found"
                        message="There's no message found with your searched term."
                      />
                    </div>
                  ) : (
                    filteredMessages.map((item, index) => {
                      // const sender = getUserById(item.senderId);

                      const senderDetail = getUserDetailMinimal(item.senderId);
                      const sender = { _id: item.senderId, ...senderDetail };

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
                    })
                  )}

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
          <div className="flex-1 w-full overflow-y-auto min-h-0 p-2 custom-scrollbar">
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
