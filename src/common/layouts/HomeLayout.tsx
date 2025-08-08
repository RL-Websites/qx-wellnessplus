import { Button, Image, NavLink } from "@mantine/core";
import { useAtomValue } from "jotai";
import { Link, NavLink as RdNavLink } from "react-router-dom";
import { IUserData } from "../api/models/interfaces/User.model";
import { userAtom } from "../states/user.atom";

interface homeLayoutProps {
  children: React.ReactNode;
}
const HomeLayout = ({ children }: homeLayoutProps) => {
  const userData = useAtomValue<IUserData | null>(userAtom);
  return (
    <div className="site-main-bg  lg:pt-16 pt-10 lg:pb-24 pb-10">
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
            <Link
              to="/order-summary"
              className="relative "
            >
              <i className="icon-orders text-3xl text-foreground"></i>
              <span className="bg-primary text-white w-7 h-7 inline-block text-center rounded-full absolute top-0 -right-4">2</span>
            </Link>
            <Button
              variant="outline"
              size="sm-3"
              color="primary"
              className="font-semibold lg:text-lg md:text-base text-sm"
              component={Link}
              to="/login"
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
