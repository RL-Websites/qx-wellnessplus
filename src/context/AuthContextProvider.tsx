import authApiRepository from "@/common/api/repositories/authRepository";
import { userAtom } from "@/common/states/user.atom";
import { useAtom } from "jotai/react";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

const AuthContextProvider = ({ children }: React.PropsWithChildren) => {
  const [userLoading, setUserLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const accessToken = localStorage.getItem("accessToken");

  const [, setUserDataAtom] = useAtom(userAtom);

  // const navigate = useNavigate();

  useEffect(() => {
    if (accessToken && accessToken !== undefined) {
      loadUserData();
    } else {
      // console.log("in authcontext");
      setUserLoading(false);
      // window.location.href = "/login";
    }
  }, []);

  const loadUserData = () => {
    authApiRepository
      .authUser()
      .then((res) => {
        // console.log(res);
        if (res.status == 200) {
          const data = res?.data?.data;
          setUserData(data);
          setUserDataAtom(data);
          setUserLoading(false);
          switch (data?.userable_type) {
            case "spa_clinic":
              localStorage.setItem("isSpaClinic", "1");
              break;
            case "customer":
              localStorage.setItem("isPartner", "1");
              break;
          }
          // if (data?.userable_type == "spa_clinic") {
          //   localStorage.setItem("isSpaClinic", "1");
          // }
        } else {
          throw new Error("Server Error");
        }
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authAccessCode");
        localStorage.removeItem("otpExpired");
        localStorage.removeItem("email");
        setUserLoading(false);
        window.location.href = "/login";
      });
  };

  return (
    <AuthContext.Provider
      value={{
        userLoading,
        loadUserData,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContextProvider;
