import { useMutation } from "@tanstack/react-query";
import { getData, useUser } from "../constants/storage";
import apiClient from "../constants/api-client";
import { useEffect, useState } from "react";
import { fetchMobile } from "./useWallet";

const postBetInfo = (betInfo) => { console.log(betInfo); return apiClient.post('create-bet/', betInfo) }

const usePlaceBet = () => {
  const [mobile, setMobile] = useState('')

  fetchMobile(setMobile)

  return useMutation({
    mutationKey: ['Place Bet'],
    mutationFn: (bets) => postBetInfo({ "mobile": mobile, "bets": bets }),
    onSuccess: (data) => console.log(data),
  })
}

export default usePlaceBet