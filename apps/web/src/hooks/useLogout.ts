import { setCookie } from "cookies-next";
import axiosInstance from "@/utils/axios";

function useLogout() {
  const handleLogout = () => {
    setCookie("authorization", "");
    axiosInstance.defaults.headers.authorization = "";
    window.location.href = "/";
  };

  return handleLogout;
}

export default useLogout;
