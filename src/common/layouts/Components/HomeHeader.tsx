import { IUserData } from "@/common/api/models/interfaces/User.model";
import { animationDelay } from "@/common/constants/constants";
import { isExitingAtomCategory, isExitingAtomForgot, isExitingAtomLogin, isExitingAtomRegister } from "@/common/states/animation.atom";
import { customerAtom } from "@/common/states/customer.atom";
import { cartItemsAtom } from "@/common/states/product.atom";
import { userAtom } from "@/common/states/user.atom";
import { isValidUrl } from "@/utils/helper.utils";
import { Button, Image, NavLink } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { Link, NavLink as RdNavLink, useLocation, useNavigate } from "react-router-dom";

const HomeHeader = () => {
  const [userData, setUserData] = useAtom<IUserData | null>(userAtom);
  const [customerData, setCustomerData] = useAtom(customerAtom);
  const [isExiting, setIsExiting] = useAtom(isExitingAtomCategory);
  const [isExitingLogin, setIsExitingLogin] = useAtom(isExitingAtomLogin);
  const [isExitingRegister, setIsExitingRegister] = useAtom(isExitingAtomRegister);
  const [isExitingForgot, setIsExitingForgot] = useAtom(isExitingAtomForgot);
  const [isExistingCategory, setIsExitingCategory] = useAtom(isExitingAtomCategory);
  const location = useLocation();
  const cartItems = useAtomValue(cartItemsAtom);
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";
  const onAuthPage = location.pathname === "/registration" || location.pathname === "/forgot-password";
  return (
    <div className="header md:flex grid grid-cols-3 md:gap-2 gap-10 items-center justify-between md:pb-12 pb-5">
      <div className="md:order-1 order-3  col-span-3 text-center">
        <span className="text-foreground font-impact md:text-[28px] text-2xl">{customerData?.name}</span>
      </div>
      <div className="logo flex items-center gap-2 md:order-2 order-1 col-span-2">
        <NavLink
          to={location.pathname != "" ? "/category" : "/"}
          component={RdNavLink}
          classNames={{
            root: "p-0 h-8 bg-transparent",
            label: "flex items-center md:justify-center gap-4",
          }}
          label={
            <>
              {customerData?.logo ? (
                <Image
                  src={customerData?.logo ? (isValidUrl(customerData.logo) ? customerData.logo : `${import.meta.env.VITE_BASE_PATH}/storage/${customerData.logo}`) : ""}
                  alt={customerData?.logo ? customerData?.name : ""}
                  className="lg:h-[120px] md:h-[100px] h-[80px] inline-block"
                />
              ) : (
                ""
              )}
              {/* <span className="text-foreground font-impact md:text-[28px] text-2xl">{customerData?.name}</span> */}
            </>
          }
        />
      </div>

      <div className="flex items-center justify-end lg:gap-8 gap-5 md:order-2 order-2 col-span-1 ">
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
            color="primary"
            className="font-semibold lg:text-lg md:text-base text-sm animated-btn"
            onClick={() => {
              setIsExitingLogin(true);
              setIsExitingRegister(false);

              setTimeout(() => {
                navigate("/registration");
              }, animationDelay);
            }}
          >
            Register
          </Button>
        ) : onAuthPage ? (
          <Button
            variant="outline"
            size="sm-3"
            color="primary"
            className="font-semibold lg:text-lg md:text-base text-sm"
            onClick={() => {
              if (location.key !== "default") {
                navigate(-1);
                setIsExitingLogin(false);
              } else {
                navigate("/login");
                setIsExitingLogin(false);
              }
            }}
          >
            Login
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm-3"
            color="primary"
            className="font-semibold lg:text-lg md:text-base text-sm animated-btn"
            onClick={() => {
              setIsExitingRegister(true);
              setIsExitingCategory(true);
              setIsExitingForgot(true);
              setIsExitingLogin(false);
              setTimeout(() => {
                navigate("/login");
              }, animationDelay);
            }}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;
