import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../constants/api-client";
import { useState } from "react";
import { fetchMobile } from "./useWallet";

const postMobileNumber = (data) =>
  apiClient.post("create-deposits/", data).then((res) => res.data).catch(err => console.log(err.response));

const useAddPoints = () => {
  const [mobile, setMobile] = useState("");

  fetchMobile(setMobile)

  return useMutation({
    mutationKey: ["AddPoints"],
    mutationFn: (data) =>
      postMobileNumber({ mobile, ...data }),
    onSuccess: (data) => console.log(data),
  });
};

export default useAddPoints;

export const useMidSetting = () => {
  const {
    data: midSettings,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["MidSetting"],
    queryFn: () => apiClient.get(`manual/`).then((res) => res.data),
  });

  return { midSettings, error, isLoading, refetch };
};


export const useMidSettingManualAccount = () => {
  const {
    data: midSettingsManualAccount,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["MidSettingManualAccount"],
    queryFn: () => apiClient.get(`manual-account/`).then((res) => res.data),
  });

  return { midSettingsManualAccount, error, isLoading, refetch };
}

export const useFrontSettings = () => {
  const {
    data: forntSettings,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Front Settings"],
    queryFn: () =>
      apiClient.get(`front/`).then((res) => res.data),
  });

  return { forntSettings, error, isLoading, refetch };
};
