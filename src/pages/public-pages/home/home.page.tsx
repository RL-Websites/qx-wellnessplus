import { IUserData } from "@/common/api/models/interfaces/User.model";
import { userAtom } from "@/common/states/user.atom";
import { Button, Image, NavLink } from "@mantine/core";
import { useAtomValue } from "jotai";
import { Link, NavLink as RdNavLink } from "react-router-dom";

const HomePage = () => {
  const userData = useAtomValue<IUserData | null>(userAtom);
  return (
    <div className="bg-[url(./public/images/home-bg.png)] bg-cover bg-no-repeat  h-screen ">
      <div className="bg-[url(./public/images/home-banner.jpg)] bg-right bg-home-bg bg-no-repeat h-screen">
        <div className="container mx-auto">
          <div className="header grid grid-cols-2  items-center justify-between ">
            <div className="flex flex-col gap-7 py-20">
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
              <h1 className="heading-xxxl text-foreground uppercase mt-12">Thanks for stopping by</h1>

              <p className="text-[30px] font-semibold text-primary capitalize">Your Wellness Journey Starts Here</p>

              <Button
                bg="primary"
                c="white"
                className="w-[370px] sm:text-lg text-base capitalize mt-8 rounded-xl"
              >
                Star Your Journey Now
              </Button>
              <p className="sm:text-lg text-base text-foreground font-medium">
                Are you an existing customer?{" "}
                <Link
                  className="text-primary font-semibold underline"
                  to={""}
                >
                  Login Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
