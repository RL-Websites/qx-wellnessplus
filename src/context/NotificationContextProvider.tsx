import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import { INotificationData, INotificationMarkAsReadRequest } from "@/common/api/models/interfaces/Notifications";
import notificationApiRepository from "@/common/api/repositories/notificationRepository";
import dmlToast from "@/common/configs/toaster.config";
import useFcmToken from "@/common/hooks/useFcmToken";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
// import { getCookie } from "cookies-next";
import React, { createContext, useContext, useState } from "react";
// import toast from "react-hot-toast";

interface INotificationContext {
  notificationData: INotificationData[];
  unReadNotificationData: INotificationData[];
  notificationLoading: boolean;
  unreadCount: number;
  allNotificationCount: number;
  itemsLoaded: number;
  loadNotification: () => void;
  loadMoreNotification: (isRead: number) => void;
  handleMarkAllReadNotification: (isRead: number) => void;
  loadUnreadNotifications: () => void;
  handleMarkNotification: (id: number, isRead: number) => void;
  isLoading: boolean;
  // handleChildNotificationStatusChange: (type: string, id: number) => Promise<any>;
}

export const NotificationContext = createContext<INotificationContext | null>(null);

const NotificationContextProvider = ({ children }: React.PropsWithChildren) => {
  const { fcmToken } = useFcmToken();
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationData, setNotificationData] = useState<INotificationData[]>([]);
  const [unReadNotificationData, setUnReadNotificationData] = useState<INotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [allNotificationCount, setAllNotificationCount] = useState<number>(0);
  const [itemsLoaded, setItemsLoaded] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(7);
  const [unReadPageSize, setUnReadPageSize] = useState<number>(7);

  const notificationQuery = useMutation({
    mutationFn: (params: ICommonParams) => notificationApiRepository.getNotificationList(params),
    mutationKey: ["allNotificationQuery"],
  });
  const unreadNotificationQuery = useMutation({
    mutationFn: (params: ICommonParams) => notificationApiRepository.getNotificationList(params),
    mutationKey: ["unreadNotificationQuery"],
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApiRepository.markAllAsRead(),
  });

  const loadNotification = (pageIndex: number = 1, notificationPageSize: number = pageSize) => {
    const params = {
      per_page: notificationPageSize,
      paginate: true,
      sort_column: "id",
      sort_direction: "desc",
      page: pageIndex,
    };
    setNotificationLoading(true);
    notificationQuery.mutate(params, {
      onSuccess: (res) => {
        setNotificationData(res?.data?.data?.notifications?.data || []);
        setAllNotificationCount(res?.data?.data?.notifications?.total || 0);
        setUnreadCount(res?.data?.data?.totalUnread || 0);
        setItemsLoaded(res?.data?.data?.notifications?.to || 0);
        setNotificationLoading(false);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const loadUnreadNotifications = (pageIndex: number = 1, notificationPageSize: number = unReadPageSize) => {
    const params = {
      per_page: notificationPageSize,
      paginate: true,
      sort_column: "id",
      sort_direction: "desc",
      page: pageIndex,
      isRead: 0,
    };
    setNotificationLoading(true);
    unreadNotificationQuery.mutate(params, {
      onSuccess: (res) => {
        setUnReadNotificationData(res?.data?.data?.notifications?.data || []);
        // setAllNotificationCount(res?.data?.data?.notifications?.total || 0);
        setUnreadCount(res?.data?.data?.totalUnread || 0);
        setItemsLoaded(res?.data?.data?.notifications?.to || 0);
        setNotificationLoading(false);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const loadMoreNotification = (isRead: number) => {
    if (isRead) {
      if (itemsLoaded < allNotificationCount) {
        loadNotification(1, itemsLoaded < allNotificationCount ? itemsLoaded + pageSize : allNotificationCount);
      }
    } else {
      if (itemsLoaded < unreadCount) {
        loadUnreadNotifications(1, itemsLoaded < unreadCount ? itemsLoaded + unReadPageSize : unreadCount);
      }
    }
  };

  const markAsReadMutation = useMutation({ mutationFn: (payload: INotificationMarkAsReadRequest) => notificationApiRepository.markAsRead(payload) });

  const handleMarkNotification = (id, is_read?: number) => {
    // if (is_read) {
    //   const itemToChange = notificationData.findIndex((item) => item.notification_id == id);
    //   const newNotificationData = { ...notificationData };
    //   if (itemToChange > -1) {
    //     newNotificationData[itemToChange].is_read = 1;
    //     setNotificationData(newNotificationData);
    //   }
    // } else {
    //   const itemToChange = unReadNotificationData.findIndex((item) => item.notification_id == id);
    //   const newNotificationData = { ...unReadNotificationData };
    //   if (itemToChange > -1) {
    //     unReadNotificationData[itemToChange].is_read = 1;
    //     setUnReadNotificationData(newNotificationData);
    //   }
    // }
    if (is_read == 0) {
      const allNotifications = [...notificationData];
      const itemsToChange = allNotifications.findIndex((item) => item.notification.id === id);
      if (itemsToChange > -1) {
        allNotifications[itemsToChange].is_read = 1;
      }
      setNotificationData(allNotifications);
      console.log(allNotifications);
      const unreadNotifications = [...unReadNotificationData];
      const changeItem = allNotifications.findIndex((item) => item.notification.id === id);
      if (changeItem > -1 && unreadNotifications.length > 0) {
        unreadNotifications[changeItem].is_read = 1;
      }
      setUnReadNotificationData(unreadNotifications);

      const payload: INotificationMarkAsReadRequest = {
        notification_id: id || null,
      };

      markAsReadMutation.mutate(payload, {
        onSuccess: (res) => {
          console.log(res);
          setUnreadCount((prevCount) => prevCount - 1);
        },
        onError: (error) => {
          const err = error as AxiosError<IServerErrorResponse>;
          console.log(err?.response?.data?.message);
        },
      });
    }
    // console.log(id);

    // console.log(unreadNotifications);
  };

  const handleMarkAllReadNotification = (isRead: number) => {
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => {
        dmlToast.success({
          title: "All notifications has been marked as read.",
        });
        if (isRead == 0) {
          setUnReadNotificationData((prevNotificationData) => prevNotificationData?.map((item) => ({ ...item, is_read: 0 })));
        } else {
          setNotificationData((prevNotificationData) => prevNotificationData?.map((item) => ({ ...item, is_read: 0 })));
        }
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;

        console.log(error?.response?.data?.message);
      },
    });
  };

  // useEffect(() => {
  //   const fcmTokenStore = () => {
  //     userRepository
  //       .storeDeviceToken({ tokenData: fcmToken })
  //       .then((response) => {
  //         console.log(response);
  //         localStorage.setItem("fcmToken", fcmToken);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  //     const messaging = getMessaging(firebaseApp);
  //     const exitingToken = localStorage.getItem("fcmToken");
  //     if (fcmToken) {
  //       if (!exitingToken) {
  //         fcmTokenStore();
  //       } else {
  //         if (exitingToken != fcmToken) {
  //           fcmTokenStore();
  //         }
  //       }
  //     }

  //     const unsubscribe = onMessage(messaging, (payload) => {
  //       const currentTimeFormatted = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ");
  //       console.log(payload);

  //       if (payload.notification && payload?.data) {
  //         const notiObject: INotificationData = {
  //           notification: {
  //             id: Number(payload?.data?.id),
  //             title: payload.notification.title,
  //             body: payload.notification.body,
  //             type: payload?.data?.type,
  //             data: payload.data,
  //           },
  //           id: Number(payload?.data?.id),
  //           notification_id: Number(payload?.data?.id),
  //           is_read: 0,
  //           created_at: currentTimeFormatted,
  //           // id: "",
  //           // notification_id: "",
  //         };
  //         setUnreadCount((prevCount) => {
  //           return prevCount + 1;
  //         });
  //         setAllNotificationCount((prevCount) => {
  //           return prevCount + 1;
  //         });
  //         let newNotificationDataArray: INotificationData[] = [];
  //         if (notificationData?.length) {
  //           newNotificationDataArray = [notiObject, ...notificationData];
  //         } else {
  //           newNotificationDataArray = [notiObject];
  //         }
  //         console.log(newNotificationDataArray);
  //         setNotificationData(newNotificationDataArray);

  //         // loadNotification();
  //       }

  //       // const audio: HTMLAudioElement = new Audio("https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7");
  //       // audio.play();
  //       dmlToast.success({
  //         title: payload?.notification?.title,
  //         message: payload?.notification?.body,
  //       });
  //     });
  //     // return;
  //     return () => {
  //       unsubscribe(); // Unsubscribe from the onMessage event
  //     };
  //   }
  // }, [fcmToken]);

  return (
    <NotificationContext.Provider
      value={{
        notificationLoading,
        loadNotification,
        loadMoreNotification,
        notificationData,
        allNotificationCount,
        itemsLoaded,
        unreadCount,
        handleMarkAllReadNotification,
        loadUnreadNotifications,
        unReadNotificationData,
        handleMarkNotification,
        isLoading: notificationQuery.isPending,
        // handleChildNotificationStatusChange,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

export default NotificationContextProvider;
