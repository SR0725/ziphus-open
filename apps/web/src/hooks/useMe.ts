import { AxiosResponse } from "axios";
import { AccountMeResponseDTO } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchMe(): Promise<AxiosResponse<AccountMeResponseDTO> | null> {
  try {
    return await axiosInstance.get<AccountMeResponseDTO>("/account/me");
  } catch (error) {
    return null;
  }
}

function useMe() {
  const { data, isLoading, error } =
    useQuery<AxiosResponse<AccountMeResponseDTO> | null>({
      queryKey: ["account", "me"],
      queryFn: () => fetchMe(),
    });
  const account = data?.data;
  return { account, isLoading, error };
}

export default useMe;
