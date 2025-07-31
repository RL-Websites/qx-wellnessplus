import $http from "./axios";

export const ResponseInterceptorSetup = (navigate) => {
  $http.interceptors.response.use(
    function (response) {
      if (response?.status == 403) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authAccessCode");
        localStorage.removeItem("otpExpired");
        localStorage.removeItem("email");
        // window.location.href = "/login";
        navigate("/login");
      }
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
};
