import { IUserData } from "@/common/api/models/interfaces/User.model";
import { userAtom } from "@/common/states/user.atom";
import { Button, Image, NavLink } from "@mantine/core";
import { useAtomValue } from "jotai";
import { Link, NavLink as RdNavLink } from "react-router-dom";

const HomePage = () => {
  const userData = useAtomValue<IUserData | null>(userAtom);
  return (
    <div className="site-main-bg">
      <div className="site-home-hero bg-none bg-right bg-home-bg bg-no-repeat md:h-screen">
        <div className="container mx-auto">
          <div className="header grid md:grid-cols-2  items-center justify-between ">
            <div className="flex flex-col gap-7 lg:py-20 py-10">
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
              <h1 className="heading-xxxl text-foreground uppercase lg:mt-12 md:mt-8 mt-5 md:text-start text-center">Thanks for stopping by</h1>

              <p className="lg:text-[30px] md:text-2xl text-base font-semibold text-primary capitalize md:text-start text-center">Your Wellness Journey Starts Here</p>

              <Button
                bg="primary"
                c="white"
                className="md:w-[370px] w-[270px] sm:text-lg text-base capitalize lg:mt-8 md:mt-4 mt-0 rounded-xl md:mx-0 mx-auto"
                component={Link}
                to="/category"
              >
                Start Your Journey Now
              </Button>
              <p className="sm:text-lg text-base text-foreground font-medium">
                Are you an existing customer?{" "}
                <Link
                  className="text-primary font-semibold underline"
                  to={"/login"}
                >
                  Login Now
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="md:bg-transparent bg-[#6949FF]">
          <Image
            src="/images/home-banner.png"
            alt="QX-Wellness Logo"
            className="w-full md:hidden block"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
