import { AppShell, ScrollArea, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { Outlet, useLocation } from "react-router-dom";
import useAuthToken from "../hooks/useAuthToken";
import { ISidebarOrganization } from "../models/sidebar";
import Header from "./Components/Header";
import SessionExpire from "./Components/SessionExpire";
import Sidebar from "./Components/Sidebar";

interface IAppLayoutProps {
  sidebarData: ISidebarOrganization[];
}

const timeout = 1800000;
// const timeout = 5000;

const AppLayout = ({ sidebarData }: IAppLayoutProps) => {
  const [opened, { toggle, close }] = useDisclosure();
  const [sessionExpiringOpen, handleSessionExpiring] = useDisclosure();

  const { removeAllAndLogout } = useAuthToken();

  const location = useLocation();

  useEffect(() => {
    if (opened) {
      close();
    }
  }, [location.pathname, close]);

  const onIdle = () => {
    handleSessionExpiring.open();
    removeAllAndLogout();
  };
  const onActive = () => {};
  const onAction = () => {};

  useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout,
    throttle: 500,
  });

  return (
    <AppShell
      header={{ height: 102 }}
      navbar={{
        width: 268,
        breakpoint: "md",
        collapsed: { mobile: !opened, desktop: opened },
      }}
      padding="md"
      withBorder={false}
    >
      <AppShell.Header className="dml-header items-center">
        <Header onToggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar className={opened ? `${sidebarData?.length == 1 ? "lg:w-[84px]" : "lg:w-[121px]"} lg:translate-x-0 dml-sideNavbar-closed` : ""}>
        <Sidebar
          opened={opened}
          sidebarData={sidebarData}
        />
      </AppShell.Navbar>
      <AppShell.Main className={`bg-background pb-[68px] ${opened ? `${sidebarData?.length == 1 ? "lg:!pl-[85px]" : "lg:!pl-[122px]"}` : ""}`}>
        <ScrollArea
          type="auto"
          scrollbarSize={6}
          styles={{
            root: { height: "calc(100vh - 102px - 68px)" },
          }}
          classNames={{
            viewport: "only-vertical-scroll",
          }}
          scrollbars="y"
        >
          <div className="dml-appShell-main-custom-style">
            <Outlet />
          </div>
        </ScrollArea>
        <SessionExpire
          openModal={sessionExpiringOpen}
          closeModal={() => handleSessionExpiring.close()}
        />
      </AppShell.Main>
      <AppShell.Footer className={`border-t-0 footer-bottom ${opened ? `${sidebarData?.length == 1 ? "lg:!pl-[85px]" : "lg:!pl-[122px]"}` : ""}`}>
        <Text
          className="text-grey text-fs-xs"
          px={20}
          py={24}
        >
          Copyright &copy; {dayjs().format("YYYY")} Wellness Plus. All rights reserved.
        </Text>
      </AppShell.Footer>
    </AppShell>
    // </NotificationContextProvider>
    // </ScrollArea.Autosize>
  );
};

export default AppLayout;
