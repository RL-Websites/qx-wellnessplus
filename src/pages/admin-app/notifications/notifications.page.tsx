import NoData from "@/common/components/NoData";
import Notification from "@/common/components/Notification";
import { useNotification } from "@/context/NotificationContextProvider";
import { Anchor, Button } from "@mantine/core";
import { useState } from "react";

function NotificationsPage() {
  const dmlNotification = useNotification();
  const [isRead, setIsRead] = useState<number>(1);

  const changeNotificationType = (status) => {
    setIsRead(status);
    if (status == 1) {
      dmlNotification?.loadNotification();
    } else {
      dmlNotification?.loadUnreadNotifications();
    }
  };

  return (
    <div>
      <div className="card-title pb-10">
        <h6 className="sm:h2 text-foreground">Notifications</h6>
      </div>
      <div className="card max-w-[789px] mx-auto">
        {dmlNotification?.notificationData?.length == 0 && !dmlNotification.notificationLoading ? (
          <div className="flex items-center justify-center h-[320px]">
            <NoData
              imgClass="w-[200px] m-0 mb-4"
              titleClass="h6 text-foreground mb-2"
              title="No notifications available yet!"
            />
          </div>
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
                setIsRead(isRead);
                changeNotificationType(isRead);
              }}
            >
              Mark all as read
            </Anchor>
          </div>
        )}
        <div className="pb-3 -mx-5">
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
                height={600}
                NotificationData={dmlNotification?.unReadNotificationData}
              />
            )
          ) : (
            <Notification
              isRead={isRead}
              height={600}
              NotificationData={dmlNotification?.notificationData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
