import { Button, Image, NavLink } from "@mantine/core";
import { useAtomValue } from "jotai";
import { NavLink as RdNavLink } from "react-router-dom";
import { IUserData } from "../api/models/interfaces/User.model";
import { userAtom } from "../states/user.atom";

interface homeLayoutProps {
  children: React.ReactNode;
}
const HomeLayout = ({ children }: homeLayoutProps) => {
  const userData = useAtomValue<IUserData | null>(userAtom);
  return (
    <div className="bg-[url(./public/images/home-bg.png)] bg-cover bg-no-repeat lg:py-20 py-10">
      <div className="container mx-auto">
        <div className="header flex items-center justify-between pb-12">
          <div className="logo flex items-center gap-2">
            <NavLink
              to={userData?.userable_type == "admin" ? "/admin-client/dashboard" : ""}
              component={RdNavLink}
              className={`p-0 bg-transparent hover:bg-transparent h-8 w-auto border-r border-r-grey-low`}
              label={
                <Image
                  src="/images/logo.svg"
                  alt="QX-Wellness Logo"
                  className="lg:w-[225px] md:w-[200px] w-[150px]"
                />
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm-3"
              color="primary"
              className="font-semibold lg:text-lg md:text-base text-sm"
            >
              Login
            </Button>
          </div>
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
