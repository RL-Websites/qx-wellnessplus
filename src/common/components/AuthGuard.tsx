import { useAuth } from "@/context/AuthContextProvider";
import { LoadingOverlay } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { redirectUrlAtom } from "../states/redirect.atom";
import { userAtom } from "../states/user.atom";

const AuthGuard = ({ userType }: { userType: string[] }) => {
  const userData = useAtomValue(userAtom);
  const { userLoading } = useAuth();
  const location = useLocation();
  const setRedirectUrl = useSetAtom(redirectUrlAtom);

  if (userLoading) {
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 1 }}
        loaderProps={{ color: "primary", type: "bars" }}
      />
    );
  } else {
    const isAuthorized = userData?.userable_type && userType.includes(userData?.userable_type);
    if (!isAuthorized) {
      // store the current url in state
      const currentUrl = location.pathname + location.search + location.hash;
      setRedirectUrl(currentUrl);
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    } else {
      return <Outlet />;
    }
  }
};

export default AuthGuard;
