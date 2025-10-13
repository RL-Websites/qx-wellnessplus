import { IUserData } from "@/common/api/models/interfaces/User.model";
import CustomerApiRepository from "@/common/api/repositories/customerRepositoiry";
import { animationDelay, getHomePageAnimationClass } from "@/common/constants/constants";
import { customerAtom } from "@/common/states/customer.atom";
import { userAtom } from "@/common/states/user.atom";
import { isValidUrl } from "@/utils/helper.utils";
import { Button, Image, NavLink } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Link, NavLink as RdNavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
const HomePage = () => {
  const userData = useAtomValue<IUserData | null>(userAtom);
  const [customerData, setCustomerData] = useAtom(customerAtom);
  const [globalCustomerData, setGlobalCustomerData] = useAtom(customerAtom);
  const [params] = useSearchParams();
  const slug = params.get("slug");
  const location = useLocation();
  const [isLoginPage, setIsLoginPage] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname == "/login") {
      setIsLoginPage(true);
    } else {
      setIsLoginPage(false);
    }
  }, [location]);
  const customerDetailsQuery = useQuery({
    queryKey: ["customerDetails", slug],
    queryFn: () => CustomerApiRepository.getCustomerDetails(slug),
    enabled: !!slug,
  });

  const handleStartClick = (event: React.MouseEvent) => {
    setIsExiting(true);

    setTimeout(() => {
      setIsExiting(false);
      navigate("/category");
    }, animationDelay); // ✅ Matches animation duration (400ms + 100ms delay)
  };

  useEffect(() => {
    if (customerDetailsQuery?.data?.data?.status_code == 200 && customerDetailsQuery?.data?.data?.data) {
      setCustomerData(customerDetailsQuery?.data?.data?.data);
      setGlobalCustomerData(customerDetailsQuery?.data?.data?.data);
    }
  }, [customerDetailsQuery?.data?.data?.data]);

  return (
    <div className="site-main-bg">
      <div className={`${isExiting ? "site-home-hero-exit" : "site-home-hero"}`}>
        <div className="container mx-auto">
          <div className="header grid md:grid-cols-2 grid-cols-1  items-center justify-between ">
            <div className="flex flex-col w-full gap-7 lg:py-16 py-10">
              <div>
                <div className="logo flex items-center justify-between gap-2">
                  <NavLink
                    to={userData?.userable_type ? "/" : "/"}
                    component={RdNavLink}
                    className={`p-0 bg-transparent hover:bg-transparent h-8 w-auto border-r border-r-grey-low`}
                    classNames={{
                      label: "flex items-center gap-4",
                    }}
                    label={
                      <>
                        {customerData?.logo ? (
                          <Image
                            src={customerData?.logo ? (isValidUrl(customerData.logo) ? customerData.logo : `${import.meta.env.VITE_BASE_PATH}/storage/${customerData.logo}`) : ""}
                            alt={customerData?.logo ? customerData?.name : ""}
                            className="lg:w-16 md:w-12 w-10"
                          />
                        ) : (
                          ""
                        )}
                        <span className="text-foreground font-impact md:text-[28px] text-2xl">{customerData?.name}</span>
                      </>
                    }
                  />
                  {userData && (
                    <Button
                      variant="outline"
                      size="sm-3"
                      color="primary"
                      className="font-semibold lg:text-lg md:text-base text-sm"
                      onClick={() => {
                        setCustomerData(null);
                        sessionStorage.clear();
                        localStorage.clear();
                        window.location.href = "/";
                      }}
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </div>

              <h1 className={`heading-xxxl text-foreground uppercase lg:mt-12 md:mt-8 mt-5 md:text-start text-center `}>Thanks for stopping by</h1>

              <p className={`lg:text-[30px] md:text-2xl text-base font-semibold text-primary capitalize md:text-start text-center`}>Your Wellness Journey Starts Here</p>

              <Button
                c="white"
                className={`md:w-[370px] w-[270px] sm:text-lg text-base capitalize lg:mt-8 md:mt-4 mt-0 rounded-xl md:mx-0 mx-auto animated-btn`}
                onClick={handleStartClick}
                component="button"
              >
                Start Your Journey Now
              </Button>
              <p className={`sm:text-lg text-base text-foreground font-medium md:text-start text-center`}>
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
          {/* <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
            <img
              src="/images/home-banner.png"
              alt="Home Banner"
              className="absolute right-0 top-0 h-full w-auto object-contain"
              style={{ width: "35%" }}
            />
          </div> */}

          <div className={`site-home-hero-bg ${isExiting ? "site-home-hero-bg-exit" : ""}`}></div>
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
