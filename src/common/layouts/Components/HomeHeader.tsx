import { IUserData } from "@/common/api/models/interfaces/User.model";
import { customerAtom } from "@/common/states/customer.atom";
import { cartItemsAtom } from "@/common/states/product.atom";
import { userAtom } from "@/common/states/user.atom";
import { isValidUrl } from "@/utils/helper.utils";
import { Button, Image, NavLink } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Link, NavLink as RdNavLink, useLocation, useNavigate } from "react-router-dom";

const HomeHeader = () => {
  const [userData, setUserData] = useAtom<IUserData | null>(userAtom);
  const [customerData, setCustomerData] = useAtom(customerAtom);
  const location = useLocation();
  const cartItems = useAtomValue(cartItemsAtom);
  const navigate = useNavigate();
  const [isLoginPage, setIsLoginPage] = useState<boolean>(false);
  useEffect(() => {
    if (location.pathname == "/login") {
      setIsLoginPage(true);
    } else {
      setIsLoginPage(false);
    }
  }, [location]);
  return (
    <div className="header flex items-center justify-between pb-12">
      <div className="logo flex items-center gap-2">
        <NavLink
          to={location.pathname != "" ? "/category" : "/"}
          component={RdNavLink}
          classNames={{
            root: "p-0 h-8 bg-transparent",
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
      </div>
      <div className="flex items-center lg:gap-8 gap-5">
        {cartItems.length > 0 && (
          <Link
            to="/order-summary"
            className="relative"
          >
            <i className="icon-orders text-4xl text-foreground leading-10"></i>
            <span className="bg-primary text-white w-7 h-7 inline-block text-center rounded-full absolute -top-2.5 -right-4">{cartItems?.length ?? 0}</span>
          </Link>
        )}
        {userData ? (
          <Button
            variant="outline"
            size="sm-3"
            color="primary"
            className="font-semibold lg:text-lg md:text-base text-sm"
            onClick={() => {
              setUserData(null);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("basicInfoData");
              localStorage.removeItem("basicInfoData");
              // we cannot clear full localStorage
              // localStorage.clear();
              window.location.href = "/";
            }}
          >
            Log out
          </Button>
        ) : isLoginPage ? (
          <Button
            variant="outline"
            size="sm-3"
            color="primary"
            className="font-semibold lg:text-lg md:text-base text-sm"
            component={Link}
            to="/registration"
          >
            Register
          </Button>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default HomeHeader;
