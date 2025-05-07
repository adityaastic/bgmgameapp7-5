import React, { useState } from "react";
import apiClient from "../constants/api-client";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../constants/storage";
import { fetchMobile } from "./useWallet";

const fetchPlayerDetails = (mobileNumber) =>
  apiClient.get(`player-bonus/${mobileNumber}/`).then((res) => res.data);

const usePlayerProfile = () => {
  const [mobile, setMobile] = useState("");
  fetchMobile(setMobile);

  const {
    data: playerDetails,
    error,
    isLoding,
  } = useQuery({
    queryKey: ["Player Details"],
    queryFn: () => fetchPlayerDetails(mobile),
  });
  return { playerDetails, error, isLoding };
};
export default usePlayerProfile;
