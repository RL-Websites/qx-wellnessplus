import { IUserData } from "@/common/api/models/interfaces/User.model";
import { userAtom } from "@/common/states/user.atom";
import { Image, NavLink } from "@mantine/core";
import { useAtomValue } from "jotai";
import { NavLink as RdNavLink } from "react-router-dom";

interface homeLayoutProps {
  children: React.ReactNode;
}
const HomePage = ({ children }: homeLayoutProps) => {
  const userData = useAtomValue<IUserData | null>(userAtom);
  return (
    <div className="bg-[url(./public/images/home-bg.png)] bg-cover bg-no-repeat ">
      <div className="bg-[url(./public/images/home-banner.jpg)] bg-right bg-home-bg bg-no-repeat">
        <div className="container mx-auto">
          <div className="header grid grid-cols-2 items-center justify-between ">
            <div className="logo flex items-center gap-2">
              <NavLink
                to={userData?.userable_type == "admin" ? "/admin-client/dashboard" : ""}
                component={RdNavLink}
                className={`p-0 bg-transparent hover:bg-transparent h-8 w-auto border-r border-r-grey-low`}
                label={
                  <Image
                    src="/images/logo.svg"
                    alt="QX-Wellness Logo"
                    w={225}
                    h={32}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
