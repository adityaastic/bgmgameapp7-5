import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { adminApiClient } from "../constants/api-client";
import { fetchMobile } from "./useWallet";

const fetchHome = () => apiClient.get(`home/`).then((res) => res.data);

const useHome = () => {
  const {
    data: home,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Home"],
    queryFn: () => fetchHome(),
  });

  return { home, error, isLoading, refetch };
};

export default useHome;

export const useGameSettings = () => {
  return useQuery({
    queryKey: ["Game Settings"],
    queryFn: () =>
      adminApiClient.get(`game-setting-list/`).then((res) => res.data),
  });
};

export const usePlayerData = () => {
  return useMutation({
    mutationKey: ["PlayerData"],
    mutationFn: ({ mobile }) =>
      apiClient.post(`player-profile/`, { mobile }).then((res) => res.data),
  });
};





