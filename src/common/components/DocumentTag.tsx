// ActionButton.tsx
import { ActionIcon } from "@mantine/core";
import React from "react";

// Define the type for action
interface Action {
  icon: React.ReactNode;
  onClick: () => void;
}

// Define the props for ActionButton component
interface ActionButtonProps {
  gap?: string;
  actions?: Action[];
  badgeColor?: string;
  badgeText?: string;
  orderOne?: string;
  orderTwo?: string;
  dmlIcon?: string;
  childrenOne?: React.ReactNode;
  childrenTwo?: React.ReactNode;
  category?: string; // new
  categoryPosition?: "left" | "right"; // new
}

const DocumentTag = ({
  badgeColor,
  badgeText,
  gap,
  actions = [],
  orderOne,
  orderTwo,
  dmlIcon,
  childrenOne,
  childrenTwo,
  category,
  categoryPosition = "left", // default
}: ActionButtonProps) => {
  return (
    <div className={`inline-block rounded-lg py-3 px-2.5 relative ${badgeColor}`}>
      {/* Category Tag */}
      {/* {category && (
        <span
          className={`absolute text-xs font-semibold text-gray-700 rounded
            ${categoryPosition === "left" ? "left-2 top-1" : "right-2 top-1"}`}
        >
          {category}
        </span>
      )} */}

      <div className={`flex items-center gap-6 ${gap}`}>
        <div className={`extra-form-text-regular flex items-center gap-2 ${orderOne}`}>
          {childrenOne ? childrenOne : <i className={`${dmlIcon} text-base`}></i>}
          {badgeText}
        </div>

        {childrenTwo ? (
          childrenTwo
        ) : (
          <div className={`flex items-center gap-2 ${orderTwo}`}>
            {actions.map((action, index) => (
              <ActionIcon
                key={index}
                onClick={action.onClick}
                variant="transparent"
                color="foreground"
                size={16}
                className="bg-transparent border-0"
              >
                {action.icon}
              </ActionIcon>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentTag;
