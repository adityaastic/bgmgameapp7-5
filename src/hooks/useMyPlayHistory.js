import { useQuery } from "@tanstack/react-query";
import { useUser } from "../constants/storage";
import apiClient, { adminApiClient } from "../constants/api-client";
import { fetchMobile } from "./useWallet";
import { useState } from "react";

const postMobileNumber = (params) =>
  adminApiClient
    .get("bet-details/", { params })
    .then((res) => res.data);

const useMyPlayHistory = ({ market = "", date = "" } = {}) => {
  const [mobile, setMobile] = useState(null);

  fetchMobile(setMobile);

  const params = {
    ...(market && { market }),
    ...(date && { date }),
    mobile
  };

  const {
    data: myPlayHistory,
    error,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["MyPlayHistory", params],
    queryFn: () => postMobileNumber(params),
  });
  return { myPlayHistory, error, isLoading, refetch };
};

export default useMyPlayHistory;
