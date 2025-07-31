import { INotificationData } from "@/common/api/models/interfaces/Notifications";
import { useNotification } from "@/context/NotificationContextProvider";
import { Anchor, ScrollArea, Skeleton } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

interface MenuDropdownProps {
  isRead: number;
  height: number;
  NotificationData: INotificationData[] | null | undefined;
}

function Notification({ isRead, height, NotificationData }: MenuDropdownProps) {
  const dmlNotification = useNotification();
  const containerRef = useRef<HTMLDivElement>(null);

  const navigateTo = useNavigate();

  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0.9,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      dmlNotification?.loadMoreNotification(isRead);
    }
  }, [entry?.isIntersecting]);

  useEffect(() => {
    containerRef.current!.scrollTo({ top: 0, behavior: "smooth" });
  }, [isRead]);

  const renderBody = (type, body?: string, name?: string, time?: string) => {
    switch (type) {
      case "doctor_registration":
        return (
          <div className="text-grey font-medium">
            <span className="text-primary font-medium">{name}</span> has completed the registration.
          </div>
        );
        break;
      case "pa_registration":
        return (
          <div className="text-grey font-medium">
            <span className="text-primary font-medium">{name}</span> has completed the registration.
          </div>
        );
        break;
      case "pa_approved":
        return (
          <div className="text-grey font-medium">
            Your PA request for <span className="text-primary font-medium">{name}</span> has been accepted by admin!
          </div>
        );
        break;
      case "test_upload":
        return (
          <div className="text-grey font-medium">
            You have received a test report from <span className="text-primary font-medium">{name}</span>.
          </div>
        );
        break;
      case "appointment_confirm":
        return (
          <div className="text-grey font-medium">
            <span className="text-primary font-medium">{name}</span> has confirmed a meeting schedule.
          </div>
        );
        break;
      case "appointment_reminder":
        return (
          <div className="text-grey font-medium">
            You have a meeting with <span className="text-primary font-medium">{name}</span> in {time} minutes. Get ready! has confirmed a meeting schedule.
          </div>
        );
        break;
      case "patient_request":
        return <div className="text-grey font-medium">{body}</div>;
        break;
      default:
        return <span className="text-grey font-medium">{body}</span>;
        break;
    }
  };

  const redirectToPath = (id, isRead, type, u_id) => {
    switch (type) {
      case "appointment_confirm":
        navigateTo(`/doctor/schedules`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      case "appointment_reminder":
        navigateTo(`/meeting-via/${u_id}`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      case "doctor_registration":
        navigateTo(`/admin/doctors/details/${u_id}`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      case "pa_registration":
        navigateTo(`/admin/pa-list/pa-details/${u_id}`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      case "pa_approved":
        navigateTo(`/doctor/physician-assistants/${u_id}`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      case "test_upload":
        navigateTo(`/doctor/patient-in-progress/${u_id}/details`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      case "patient_request":
        navigateTo(`/doctor/patient-requests/${u_id}/details`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      case "docu_spa_clinic_patient_request":
        navigateTo(`/prescriber-spa/patient-in-progress/${u_id}/details`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      case "docu_spa_clinic_patient_review":
        navigateTo(`/clinical-spa/reviews/${u_id}/details`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      case "docu_spa_patient_review":
        navigateTo(`/medical-spa/reviews/${u_id}/details`);
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
      default:
        "";
        dmlNotification?.handleMarkNotification(id, isRead);
        break;
    }
  };

  const renderNotificationListItem = NotificationData?.map((item, index) => {
    return (
      <li
        key={index}
        className="border-b border-grey-low pb-2.5 cursor-pointer"
        onClick={() => redirectToPath(item?.notification?.id, item?.is_read, item?.notification?.type, item?.notification?.data?.u_id)}
      >
        <div className="flex items-start justify-between relative pt-3.5">
          <div>
            <span className="heading-xxxs text-foreground">{item?.notification?.title}</span>
            <div className="flex gap-1 text-fs-xs">
              {item?.notification?.type && item?.notification?.data?.name ? (
                renderBody(item?.notification?.type, item?.notification?.body, item?.notification?.data?.name)
              ) : (
                <span className="text-grey font-medium">{item?.notification?.body}</span>
              )}
            </div>
          </div>

          {!item?.is_read ? <span className="absolute top-3.4 right-0 size-2 bg-green rounded-full"></span> : ""}
        </div>
        <div className="flex justify-between items-end">
          <span className="text-fs-xs text-grey !font-medium">{item?.created_at ? dayjs(item?.created_at).fromNow() : ""}</span>
          {!item?.is_read ? (
            <Anchor
              underline="always"
              className="link-text-sm text-primary"
              onClick={() => (item?.notification?.id ? dmlNotification?.handleMarkNotification(item?.notification?.id, item?.is_read || 0) : false)}
            >
              Marked as read
            </Anchor>
          ) : (
            ""
          )}
        </div>
      </li>
    );
  });

  const loadingSkeleton = [...Array(4)].map((e, i) => (
    <li
      key={i}
      className="border-b border-grey-low pb-2.5"
    >
      <div
        ref={ref}
        className="pt-3.5"
      >
        <div className="mb-1">
          <Skeleton
            height={16}
            width="40%"
            className="mb-2 mt-1"
          ></Skeleton>
          <Skeleton
            height={14}
            width="65%"
          ></Skeleton>
        </div>
        <div className="flex justify-between items-end mb-1">
          <Skeleton
            height={14}
            width={60}
          />
          <Skeleton
            height={16}
            width={90}
          />
        </div>
      </div>
    </li>
  ));

  return (
    <ul className="space-y-2.5">
      <ScrollArea.Autosize
        type="hover"
        mah={height}
        scrollbarSize={6}
        scrollbars="y"
        offsetScrollbars="y"
        classNames={{
          viewport: "!px-5",
        }}
        ref={containerRef}
      >
        {(renderNotificationListItem?.length == 0 || renderNotificationListItem == undefined) && dmlNotification?.isLoading ? loadingSkeleton : renderNotificationListItem}
        {/* </InfiniteScroll> */}
        {isRead ? (
          dmlNotification?.itemsLoaded == dmlNotification?.allNotificationCount ? (
            ""
          ) : (
            <li>
              <div
                ref={ref}
                className="mt-3"
              >
                <div className="mb-1">
                  <Skeleton
                    height={16}
                    width="40%"
                    className="mb-1"
                  ></Skeleton>
                  <Skeleton
                    height={14}
                    width="65%"
                  ></Skeleton>
                </div>
                <div className="flex justify-between items-end">
                  <Skeleton
                    height={14}
                    width={60}
                  />
                  <Skeleton
                    height={16}
                    width={90}
                  />
                </div>
              </div>
            </li>
          )
        ) : dmlNotification?.itemsLoaded == dmlNotification?.unreadCount ? (
          ""
        ) : (
          <li>
            <div
              ref={ref}
              className="mt-3"
            >
              <div className="mb-1">
                <Skeleton
                  height={16}
                  width="40%"
                  className="mb-1"
                ></Skeleton>
                <Skeleton
                  height={14}
                  width="65%"
                ></Skeleton>
              </div>
              <div className="flex justify-between items-end">
                <Skeleton
                  height={14}
                  width={60}
                />
                <Skeleton
                  height={16}
                  width={90}
                />
              </div>
            </div>
          </li>
        )}
      </ScrollArea.Autosize>
    </ul>
  );
}

export default Notification;
