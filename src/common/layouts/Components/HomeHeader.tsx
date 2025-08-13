import { IUserData } from "@/common/api/models/interfaces/User.model";
import { cartItemsAtom } from "@/common/states/product.atom";
import { userAtom } from "@/common/states/user.atom";
import { Button, Image, NavLink } from "@mantine/core";
import { useAtomValue } from "jotai";
import { Link, NavLink as RdNavLink } from "react-router-dom";

const HomeHeader = () => {
  const userData = useAtomValue<IUserData | null>(userAtom);
  const cartItems = useAtomValue(cartItemsAtom);
  return (
    <div className="header flex items-center justify-between pb-12">
      <div className="logo flex items-center gap-2">
        <NavLink
          to={userData?.userable_type ? "/category" : "/"}
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
  );
};

export default HomeHeader;
