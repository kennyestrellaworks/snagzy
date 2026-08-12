import { useData } from "../../context/DataContext";

export const Participants = ({ chatParticipants }) => {
  const { getUserById } = useData();

  // console.log("this", chatParticipants);
  if (!chatParticipants) return <div></div>;

  // Sort participants so creator appears first
  const sortedParticipants = [...chatParticipants].sort((a, b) => {
    if (a.roleInChat === "creator") return -1;
    if (b.roleInChat === "creator") return 1;
    return 0;
  });

  return (
    <div className="flex flex-col w-full items-start gap-2">
      {sortedParticipants.map((participant, index) => {
        const participantDetail = getUserById(participant._id);
        return (
          <div
            key={index}
            className={`flex items-center gap-3 p-2 border rounded-md w-full ${
              participant.roleInChat === "creator"
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <div className="relative">
              <img
                src={participantDetail.image}
                alt={participantDetail.firstName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {participantDetail.isOnline ? (
                <div className="absolute  w-3 h-3 top-0 bg-green-500 border-2 border-white rounded-full"></div>
              ) : null}
            </div>
            <div className="flex flex-col">
              <p className="font-medium leading-tight">
                {participantDetail.firstName} {participantDetail.lastName}
              </p>

              <p className="text-sm text-gray-600 leading-tight">
                {participantDetail.jobTitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
