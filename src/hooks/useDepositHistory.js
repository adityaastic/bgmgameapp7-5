import { useQuery } from "@tanstack/react-query";
import { useUser } from "../constants/storage";
import { adminApiClient } from "../constants/api-client";
import { fetchMobile } from "./useWallet";
import { useState } from "react";

const useTransactionHistory = () => {
  const [mobile, setMobile] = useState(null);

  fetchMobile(setMobile);

  return useQuery({
    queryKey: ['Transaction History'],
    queryFn: () => adminApiClient.get('transaction-list/', { params: { mobile } }).then(res => res.data),
    enabled: !!mobile,
  })
};


export default useTransactionHistory; 