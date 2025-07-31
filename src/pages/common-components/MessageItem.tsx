// components/MessageItem.tsx
import { IMessageing } from "@/common/api/models/interfaces/Payment.model";
import { Avatar, Tooltip } from "@mantine/core";
import React from "react";

interface MessageItemProps {
  message: IMessageing;
  isSender: boolean;
  basePath: string; // for VITE_BASE_PATH
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isSender, basePath }) => {
  const formattedDate = new Date(message.created_at).toLocaleString();
  const profileImage = message?.user?.profile_image ? `${basePath}/storage/${message.user.profile_image}` : "/images/profile-blank.svg";

  return (
    <li className={`flex items-start gap-2 ${isSender ? "justify-end" : "justify-start"}`}>
      {/* Avatar (Left if not sender) */}
      {!isSender && (
        <Tooltip label={`${message?.user?.name} (${message?.user?.email})`}>
          <Avatar
            src={profileImage}
            className="user-profile-img-sm !rounded-full"
            radius="md"
          >
            <img
              src="/images/profile-blank.svg"
              alt="Avatar"
            />
          </Avatar>
        </Tooltip>
      )}

      {/* Message + Timestamp */}
      <div className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
        <div className={`p-3.5 rounded-lg text-sm ${isSender ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}>{message?.message}</div>
        <span className="text-[10px]/none text-gray-400 mt-1">{formattedDate}</span>
      </div>

      {/* Avatar (Right if sender) */}
      {isSender && (
        <Avatar
          src={profileImage}
          className="user-profile-img-sm !rounded-full"
          radius="md"
        >
          <img
            src="/images/profile-blank.svg"
            alt="Avatar"
          />
        </Avatar>
      )}
    </li>
  );
};

export default MessageItem;
