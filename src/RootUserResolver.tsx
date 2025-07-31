import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import { useEffect } from "react";
import authApiRepository from "./common/api/repositories/authRepository";
import { userAtom } from "./common/states/user.atom";

const RootUserResolver = ({ children }: { children: React.ReactNode }) => {
  // TODO: only store u_id instead of whole user data
  // const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [, setUserDataAtom] = useAtom(userAtom);
  const userQuery = useQuery({ queryKey: ["userData"], queryFn: () => authApiRepository.authUser() });
  useEffect(() => {
    if (userQuery.isFetched) {
      if (userQuery?.data?.data?.status_code === 200) {
        setUserDataAtom(userQuery?.data?.data?.data);
      }
    }
  }, [userQuery]);

  return <>{children}</>;
};
// a comment
export default RootUserResolver;
