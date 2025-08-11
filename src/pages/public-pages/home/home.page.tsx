import { IQXCustomerDetails } from "@/common/api/models/interfaces/Customer.model";
import CustomerApiRepository from "@/common/api/repositories/customerRepositoiry";
import { customerAtom } from "@/common/states/customer.atom";
import { Button, Image, NavLink } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link, NavLink as RdNavLink, useSearchParams } from "react-router-dom";

const HomePage = () => {
  const [customerData, setCustomerData] = useState<IQXCustomerDetails>();
  const [globalCustomerData, setGlobalCustomerData] = useAtom(customerAtom);
  const [params] = useSearchParams();
  const slug = params.get("slug");
  const customerDetailsQuery = useQuery({
    queryKey: ["customerDetails", slug],
    queryFn: () => CustomerApiRepository.getCustomerDetails(slug),
    enabled: !!slug,
  });

  useEffect(() => {
    if (customerDetailsQuery?.data?.data?.status_code == 200 && customerDetailsQuery?.data?.data?.data) {
      setCustomerData(customerDetailsQuery?.data?.data?.data);
      setGlobalCustomerData(customerDetailsQuery?.data?.data?.data);
    }
  }, [customerDetailsQuery?.data?.data?.data]);

  return (
    <div className="site-main-bg">
      <div className="site-home-hero ">
        <div className="container mx-auto">
          <div className="header grid md:grid-cols-2  items-center justify-between ">
            <div className="flex flex-col gap-7 lg:py-16 py-10">
              <div className="logo flex items-center gap-2">
                <NavLink
                  to="/"
                  component={RdNavLink}
                  className={`p-0 bg-transparent hover:bg-transparent h-8 w-auto border-r border-r-grey-low`}
                  label={
                    <div className="flex items-center gap-4">
                      <Image
                        src={customerData?.logo ? `${import.meta.env.VITE_BASE_PATH}/storage/${customerData?.logo}` : ""}
                        alt={customerData?.name || ""}
                        className="lg:w-16 md:w-12 w-10"
                      />
                      <h2 className="text-foreground md:text-[28px] text-2xl">{customerData?.name || ""}</h2>
                    </div>
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
