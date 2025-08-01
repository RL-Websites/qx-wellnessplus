import { useAuth } from "@/context/AuthContextProvider";
import { LoadingOverlay } from "@mantine/core";
import { useAtomValue } from "jotai/react";
import { Navigate, Outlet } from "react-router-dom";
import { userAtom } from "../states/user.atom";

const AuthGuard = ({ userType }: { userType: string[] }) => {
  const userData = useAtomValue(userAtom);
  const { userLoading } = useAuth();

  // if (userData == null) {
  //   return (
  //     <LoadingOverlay
  //       visible={true}
  //       zIndex={1000}
  //       overlayProps={{ radius: "sm", blur: 1 }}
  //       loaderProps={{ color: "primary", type: "bars" }}
  //     />
  //   );
  // } else {
  //   return userData?.userable_type == "admin" ? <Outlet /> : <Navigate to="/login" />;
  // }

  if (userLoading) {
    // debugger
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 1 }}
        loaderProps={{ color: "primary", type: "bars" }}
      />
    );
  } else {
    return userData?.userable_type && userType.includes(userData?.userable_type) ? <Outlet /> : <Navigate to="/login" />;
  }
};

export default AuthGuard;
