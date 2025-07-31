import NoData from "@/common/components/NoData";
import Notification from "@/common/components/Notification";
import { useNotification } from "@/context/NotificationContextProvider";
import { Anchor, Button, Menu } from "@mantine/core";
import { useEffect, useState } from "react";
import { NavLink as RdNavLink } from "react-router-dom";

interface NotificationDDPropsType {
  onClose: () => void;
}

const NotificationDropdown = ({ onClose }: NotificationDDPropsType) => {
  const [isRead, setIsRead] = useState<number>(0);
  const dmlNotification = useNotification();

  useEffect(() => {
    dmlNotification?.loadUnreadNotifications();
  }, []);

  const changeNotificationType = (status) => {
    setIsRead(status);
    if (status == 1) {
      dmlNotification?.loadNotification();
    } else {
      dmlNotification?.loadUnreadNotifications();
    }
  };

  return (
    <Menu.Dropdown
      classNames={{
        dropdown: "sm:!w-[432px] !w-[95%]",
      }}
    >
      <div className="dropdown-header px-5 pt-5">
        <h6 className="text-foreground">Notifications</h6>
        {dmlNotification?.notificationData?.length == 0 && !dmlNotification.notificationLoading ? (
          // <div className="flex items-center justify-center h-[320px]">
          //   <NoData
          //     imgClass="w-[200px] m-0 mb-4"
          //     titleClass="h6 text-foreground mb-2"
          //     title="No notifications available yet!"
          //   />
          // </div>
          ""
        ) : (
          <div className="flex items-center justify-between border-b border-b-grey-low py-2.5">
            <div className="flex gap-2">
              <Button
                variant={`${isRead == 1 ? "primary" : "transparent"}`}
                radius="28px"
                size="sm"
                c={`${isRead == 1 ? "" : "grey.5"}`}
                onClick={() => changeNotificationType(1)}
              >
                All ({dmlNotification?.allNotificationCount})
              </Button>
              <Button
                variant={`${isRead == 1 ? "transparent" : "primary"}`}
                radius="28px"
                size="sm"
                c={`${isRead == 1 ? "grey.5" : ""}`}
                onClick={() => changeNotificationType(0)}
              >
                Unread ({dmlNotification?.unreadCount})
              </Button>
            </div>
            <Anchor
              underline="always"
              fw="500"
              fs="14px"
              c="grey.6"
              onClick={() => {
                dmlNotification?.handleMarkAllReadNotification(isRead);
                changeNotificationType(1);
              }}
            >
              Mark all as read
            </Anchor>
          </div>
        )}
      </div>

      <div className="dropdown-body pb-3">
        {isRead == 0 ? (
          dmlNotification?.unReadNotificationData?.length == 0 && !dmlNotification.notificationLoading ? (
            <div className="flex items-center justify-center h-[320px]">
              <NoData
                imgClass="w-[200px] m-0 mb-4"
                titleClass="h6 text-foreground mb-2"
                title="No unread notifications available!"
              />
            </div>
          ) : (
            <Notification
              isRead={isRead}
              height={424}
              NotificationData={dmlNotification?.unReadNotificationData}
            />
          )
        ) : dmlNotification?.notificationData?.length == 0 && !dmlNotification.notificationLoading ? (
          <div className="flex items-center justify-center h-[320px]">
            <NoData
              imgClass="w-[200px] m-0 mb-4"
              titleClass="h6 text-foreground mb-2"
              title="No notifications available!"
            />
          </div>
        ) : (
          <Notification
            isRead={isRead}
            height={424}
            NotificationData={dmlNotification?.notificationData}
          />
        )}
        {/* <Notification
          closeMenu={onClose}
          height={424}
          NotificationData={isRead == 1 ? dmlNotification?.notificationData : dmlNotification?.unReadNotificationData}
        /> */}
      </div>
      {dmlNotification?.notificationData?.length == 0 ? (
        ""
      ) : (
        <Button
          classNames={{
            root: "bg-grey-low h-11 w-full rounded-tr-none rounded-tl-none group hover:bg-primary",
            label: "text-foreground text-sm group-hover:text-white",
          }}
          component={RdNavLink}
          to="./notifications"
          onClick={onClose}
        >
          See All
        </Button>
      )}
    </Menu.Dropdown>
  );
};

export default NotificationDropdown;
