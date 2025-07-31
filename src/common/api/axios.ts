import axios from "axios";

const $http = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

$http.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const hasToken = localStorage.getItem("accessToken");
    if (hasToken !== null) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem("accessToken")}`;
      return config;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    console.log("intercepting request");

    return Promise.reject(error);
  }
);

$http.interceptors.response.use(
  function (response) {
    // console.log(response);
    if (response?.status == 403) {
      console.log("intercepting response");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authAccessCode");
      localStorage.removeItem("otpExpired");
      localStorage.removeItem("email");
      window.location.href = "/login";
    }
    return response;
  },
  function (error) {
    // console.log(error);
    if (error?.response?.status == 403) {
      console.log("intercepting error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authAccessCode");
      localStorage.removeItem("otpExpired");
      localStorage.removeItem("email");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default $http;
