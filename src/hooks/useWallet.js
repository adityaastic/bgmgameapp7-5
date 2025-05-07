import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getData } from "../constants/storage";
import apiClient from "../constants/api-client";
import { useEffect, useState } from "react";


export const fetchMobile = (setMobile) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await getData("user");
      setMobile(user?.mobile);
      resolve(user?.mobile); 
    } catch (error) {
      reject(error); 
    }
  });
};

const fetchWalletAmount = (mobile) => apiClient.get(`player-wallet/${mobile}/`).then(res => res.data)

const useWallet = () => {
  const [mobile, setMobile] = useState(null);

  fetchMobile(setMobile);

  const { data: wallet, error, isLoading, refetch: refetchWallet } = useQuery({
    queryKey: ['walletAmount', mobile],
    queryFn: () => fetchWalletAmount(mobile),
    enabled: !!mobile,
  });

  return { wallet, error, isLoading, refetchWallet };
};

export default useWallet;
