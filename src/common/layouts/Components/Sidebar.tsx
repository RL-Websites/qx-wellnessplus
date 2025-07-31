import { ISidebarLink, ISidebarOrganization } from "@/common/models/sidebar";
import { NavLink, ScrollArea, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { NavLink as RdNavLink, useLocation, useNavigate } from "react-router-dom";

interface SidebarPropsType {
  opened: boolean;
  sidebarData: ISidebarOrganization[];
}

const Sidebar = ({ opened, sidebarData }: SidebarPropsType) => {
  const [pagesList, setPagesList] = useState<ISidebarLink[]>([]);
  const [pathname, setPathname] = useState<string>();
  const [orgTypeFromRoute, setOrgTypeFromRoute] = useState<string>();

  const navigate = useNavigate();

  const route = useLocation();

  useEffect(() => {
    setPathname(route.pathname);
    const suffix = route.pathname.split("/")[1].split("-")?.[1];
    if (suffix) {
      setOrgTypeFromRoute(suffix);
    } else {
      setOrgTypeFromRoute("master");
    }
    const org = sidebarData?.find((org) => org.type == suffix);
    const orgPages = org?.pages || sidebarData?.[0]?.pages;
    setPagesList(orgPages);
    // console.log(route.pathname);
  }, [route]);

  // useEffect(() => {
  //   if (orgTypeFromRoute) {
  //     const org = sidebarData?.find((org) => org.type == orgTypeFromRoute);
  //     const orgPages = org?.pages || sidebarData?.[0]?.pages;
  //     setPagesList(orgPages);
  //   }
  //   // if (sidebarData?.length) {
  //   //   // selectOrganization(sidebarData[0].id);
  //   //   const orgId = sidebarData?.[0]?.id;
  //   //   const orgPages = sidebarData?.[0]?.pages;
  //   //   setPagesList(orgPages);
  //   // }
  // }, [sidebarData?.length]);

  const selectOrganization = (id) => {
    let orgPages;
    if (sidebarData?.length) {
      const org = sidebarData?.find((org) => org.id == id);
      orgPages = org?.pages;
      navigate(org?.to || "");
    }
    setPagesList(orgPages);
  };

  const organizations = sidebarData?.map((org, index) => (
    <Tooltip
      label={org?.name}
      position="right"
      key={index}
    >
      <NavLink
        label={
          <div className="size-10 rounded-full bg-primary flex items-center justify-center">
            <img
              src={org?.logo}
              className={`size-[20px] ${org?.className}`}
            />
          </div>
        }
        className={
          "w-[50px] h-[72px] p-0 rounded-s-xl rounded-es-xl transition-all duration-[850ms] " +
          (orgTypeFromRoute == org?.type ? "bg-primary hover:bg-primary " : "bg-grey-low hover:bg-transparent")
        }
        classNames={{
          label: "flex justify-center items-center",
        }}
        onClick={() => selectOrganization(org?.id)}
      />
    </Tooltip>
  ));

  const items = pagesList?.map((item) => (
    <Tooltip
      label={item.label}
      offset={{ mainAxis: -20 }}
      position="right"
      events={{ hover: opened, focus: opened, touch: opened }}
      key={item.label}
    >
      <NavLink
        to={item.to}
        label={<span className={`text-sm ${opened ? "lg:opacity-0" : ""}`}>{item.label}</span>}
        leftSection={<i className={`${item.leftSectionIcon} text-2xl font-medium ${pathname?.includes(item.to) ? "text-primary" : "text-foreground"}`}></i>}
        component={RdNavLink}
        px={15}
        py={24}
        color="foreground"
        className={`dml-sidebar-navlink font-medium ${pathname?.includes(item.to) ? "bg-primary-light text-primary" : "text-foreground"} ${item.classes}`}
        classNames={{
          label: "truncate",
        }}
        styles={{
          section: { marginInlineEnd: "20px", height: 24 },
        }}
      />
    </Tooltip>
  ));
  return (
    <div className="flex h-full py-2.5 px-2 bg-grey-low">
      {organizations?.length == 1 ? "" : <div className="flex flex-col flex-shrink-0">{organizations}</div>}
      <div className="bg-natural-white rounded-se-xl rounded-ee-xl overflow-hidden w-full">
        <ScrollArea.Autosize
          type="hover"
          scrollbarSize={6}
          scrollbars="y"
          classNames={{
            root: "h-[calc(100vh_-_112px)]",
            viewport: "view-port-next-inner",
          }}
        >
          <div className="flex flex-col h-full">{items}</div>
        </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Sidebar;
