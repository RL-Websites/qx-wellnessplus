import { useAuth } from "@/context/AuthContextProvider";
import { LoadingOverlay } from "@mantine/core";
import { useAtomValue } from "jotai/react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { userAtom } from "../states/user.atom";

const NavigateToPanel = () => {
  const [loginRedirectCount, setLoginRedirectCount] = useState<number>(0);
  const userData = useAtomValue(userAtom);
  const { userLoading } = useAuth();
  const navigate = useNavigate();

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
    console.log(userData?.userable_type || "navigateToPanel");
    switch (userData?.userable_type) {
      case "admin":
        return <Navigate to="/home" />;

      default:
        if (loginRedirectCount == 0) {
          console.log("did i came here");
          setLoginRedirectCount((prevCount) => ++prevCount);
          setTimeout(() => {
            navigate("/home");
          }, 50);
        }
    }

    // if (userData?.userable_type != undefined) {

    // } else {
    //   setLoginRedirectCount((prevCount) => ++prevCount);
    //   return <Navigate to="/login" />;
    // }
  }
};

export default NavigateToPanel;
