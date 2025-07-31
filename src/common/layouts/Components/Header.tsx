import { IMessageing } from "@/common/api/models/interfaces/Payment.model";
import { IUserData } from "@/common/api/models/interfaces/User.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import dmlToast from "@/common/configs/toaster.config";
import useAuthToken from "@/common/hooks/useAuthToken";
import { incrementNotificationCountAtom, notificationCountAtom, resetNotificationCountAtom } from "@/common/states/sms_notification.atom";
import { userAtom } from "@/common/states/user.atom";
import ChangePasswordModal from "@/pages/admin-app/users/components/ChangePasswordModal";
import { getUserTypeText } from "@/utils/userType.utils";
import { ActionIcon, Avatar, Divider, Group, Image, Menu, NavLink, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai/react";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { Link, NavLink as RdNavLink, useNavigate } from "react-router-dom";

interface HeaderPropsType {
  onToggle: () => void;
}

declare global {
  interface Window {
    pusher?: Pusher; // Declaring window.pusher as a possible Pusher instance
  }
}

const Header = ({ onToggle }: HeaderPropsType) => {
  const userData = useAtomValue<IUserData | null>(userAtom);
  const { removeAccessToken, removeCurrentUser, removeAuthAccessCode, removeFcmToken, removeOtpExpired, removeStoredEmail } = useAuthToken();
  const navigate = useNavigate();
  const [openedNotify, setOpenedNotify] = useDisclosure();
  const [openChangePassModal, changePassModalHandler] = useDisclosure();
  // const dmlNotification = useNotification();
  const [, incrementNotificationCount] = useAtom(incrementNotificationCountAtom);
  const [, resetNotificationCount] = useAtom(resetNotificationCountAtom);
  const [notificationCount] = useAtom(notificationCountAtom);

  const handleClick = () => {
    // Reset the notification count
    resetNotificationCount();
  };

  useEffect(() => {
    // Initialize Pusher only if the user is 'admin' or 'doctor'
    if (userData?.userable_type === "spa_clinic" || userData?.userable_type === "spa_medical") {
      // Initialize Pusher instance
      const pusher = new Pusher("7f6a820029a653d460bf", {
        cluster: "ap2",
      });

      // Assign Pusher to the global window object
      window.pusher = pusher;

      // Subscribe to the channel
      const channel = pusher.subscribe("Docmedilink");

      channel.bind("message.textsent", (data: IMessageing) => {
        if (userData?.id !== data?.sender_user_id && data?.clinic_id == userData?.clinic_id) {
          incrementNotificationCount();
          dmlToast.success({ title: `New Message Received` });
        }
      });

      // Cleanup when component unmounts
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [userData?.userable_type]);

  // useEffect(() => {
  //   dmlNotification?.loadNotification();
  // }, []);

  const logoutMutation = useMutation({
    mutationFn: () => authApiRepository.logout(),
    onSuccess: () => {
      removeAccessToken();
      removeCurrentUser();
      removeFcmToken();
      removeOtpExpired();
      localStorage.removeItem("isSpaClinic");
      localStorage.removeItem("isPartner");
      removeStoredEmail();
      removeAuthAccessCode();
      navigate("/login");
    },
    onError: () => {
      removeAccessToken();
      removeCurrentUser();
      removeFcmToken();
      localStorage.removeItem("isSpaClinic");
      localStorage.removeItem("isPartner");
      removeOtpExpired();
      removeStoredEmail();
      removeAuthAccessCode();
      navigate("/login");
    },
  });
  const logout = () => {
    logoutMutation.mutate();
  };

  const hiddenTypes = ["admin", "client", "customer", "partner_patient", "customer_standard_user"];

  const shouldShowMessage = !hiddenTypes.includes(userData?.userable_type ?? "");

  return (
    <Group className="flex items-center h-full sm:pl-[30px] pl-4 sm:pr-6 pr-4">
      <Group
        gap="lg"
        className="h-full flex items-center dml-header-logo-area"
      >
        <i
          className="icon-menu text-foreground text-2xl leading-none cursor-pointer"
          onClick={onToggle}
        ></i>
        <div className="hidden sm:flex items-center gap-2">
          <NavLink
            to={
              userData?.userable_type == "client"
                ? "/client/dashboard"
                : userData?.userable_type == "customer"
                ? "/partner/dashboard"
                : userData?.userable_type == "customer_standard_user"
                ? "/partner/dashboard"
                : userData?.userable_type == "partner_patient"
                ? "/partner-patient/dashboard"
                : "/admin-client/dashboard"
            }
            component={RdNavLink}
            className={`p-0 bg-transparent hover:bg-transparent h-8 border-r border-r-grey-low`}
            label={
              <Image
                src="/images/wellness-logo.svg"
                alt="Wellness Logo"
                w={148}
                h={32}
              />
            }
          />
        </div>
      </Group>
      <Group
        className="ml-auto"
        gap={20}
      >
        {shouldShowMessage && (
          <Tooltip
            label="Message"
            arrowSize={8}
            withArrow
          >
            <Link
              to={userData?.userable_type === "spa_clinic" ? `messages` : userData?.userable_type === "spa_medical" ? `messages` : ""}
              onClick={handleClick}
            >
              <div style={{ position: "relative" }}>
                <ActionIcon
                  size="lg"
                  radius="md"
                  variant="light"
                >
                  <i className="icon-message text-2xl"></i>
                </ActionIcon>

                {notificationCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      backgroundColor: "red",
                      border: "2px solid white", // To create a small white border around the dot
                    }}
                  ></span>
                )}
              </div>
            </Link>
          </Tooltip>
        )}

        {/* <Menu
          shadow="md"
          width={432}
          opened={openedNotify}
          onClose={setOpenedNotify.close}
        >
          <Menu.Target>
            <Tooltip label="Notifications">
              <ActionIcon
                size="lg"
                radius="md"
                variant="light"
                onClick={setOpenedNotify.toggle}
                classNames={{
                  root: "relative !overflow-visible",
                }}
              >
                <i className="icon-notification text-2xl"></i>

                {dmlNotification?.unreadCount != undefined && dmlNotification?.unreadCount > 0 ? (
                  <div className="bg-danger-badge text-white text-sm font-bold font-uber absolute -top-1.5 -right-5 rounded-full h-5 w-8 flex items-center justify-center">
                    {dmlNotification?.unreadCount > 99 ? "99+" : dmlNotification?.unreadCount}
                  </div>
                ) : (
                  ""
                )}
              </ActionIcon>
            </Tooltip>
          </Menu.Target>

          <NotificationDropdown onClose={setOpenedNotify.close} />
        </Menu> */}
        <Menu
          shadow="md"
          width={200}
          transitionProps={{ transition: "pop-top-left", duration: 200 }}
        >
          <Menu.Target>
            <Group
              className="cursor-pointer items-start flex"
              gap={8}
              ml={4}
            >
              <div className="relative overflow-visible after:absolute after:block after:top-[75%] after:right-0 after:h-2.5 after:w-2.5 after:rounded-full after:bg-[#009A51]">
                <Avatar
                  src={`${import.meta.env.VITE_BASE_PATH}/storage/${userData?.profile_image}` || "/images/profile-blank.svg"}
                  size={52}
                  radius="xl"
                >
                  <img
                    src="/images/profile-blank.svg"
                    alt=""
                    className="rounded-full"
                  />
                </Avatar>
              </div>
              <div className="md:flex flex-col gap-1 hidden">
                <Text className="text-foreground text-base font-bold font-uber">{`${userData?.name}`}</Text>
                <Text className="text-xs text-grey-medium capitalize">{getUserTypeText(userData)}</Text>
              </div>
            </Group>
          </Menu.Target>

          <Menu.Dropdown>
            {userData?.userable_type == "clinic" ? (
              <>
                {userData?.can_prescribe == 1 ? (
                  <>
                    <Menu.Item
                      to={userData?.can_prescribe == 1 ? "/clinic/prescriber-profile" : "profile"}
                      leftSection={<i className="icon-profile text-lg/none"></i>}
                      className={"text-secondary text-sm py-2.5 px-3"}
                      component={RdNavLink}
                    >
                      Prescriber Profile
                    </Menu.Item>
                    <Divider />
                  </>
                ) : (
                  ""
                )}
                <Menu.Item
                  to={userData?.userable_type == "clinic" ? "/clinic/profile" : "profile"}
                  leftSection={<i className="icon-Icon1 text-lg/none"></i>}
                  className={"text-secondary text-sm py-2.5 px-3"}
                  component={RdNavLink}
                >
                  {userData?.can_prescribe == 1 ? "Clinic Admin Profile" : "My Profile"}
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item
                  to={userData?.userable_type == "admin" ? "/admin/profile" : "profile"}
                  leftSection={<i className="icon-profile text-lg/none"></i>}
                  className={"text-secondary text-sm py-2.5 px-3"}
                  component={RdNavLink}
                >
                  Profile
                </Menu.Item>
              </>
            )}
            <Divider />
            <Menu.Item
              onClick={() => changePassModalHandler.open()}
              leftSection={<i className="icon-change_password text-lg/none"></i>}
              className={"text-secondary text-sm py-2.5 px-3"}
            >
              Change Password
            </Menu.Item>
            <Divider />
            <Menu.Item
              onClick={logout}
              leftSection={<i className="icon-logout text-lg/none text-danger"></i>}
              className={"text-sm py-2.5 px-3"}
              classNames={{
                itemLabel: "text-danger",
              }}
            >
              Log Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <ChangePasswordModal
          openModal={openChangePassModal}
          onModalClose={changePassModalHandler.close}
        />
      </Group>
    </Group>
  );
};

export default Header;
