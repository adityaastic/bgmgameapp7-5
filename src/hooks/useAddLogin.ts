import { useMutation } from "@tanstack/react-query";
import apiClient from "../constants/api-client";

interface IOtpVerify {
  mobile: string;
  otp: string;
}

export const usePostMobile = () => {
  return useMutation({
    mutationKey: ['postMobile'],
    mutationFn: (mobile: string) => apiClient.post('login/', { mobile }).then(res => res.data),
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationKey: ['postLoginInfo'],
    mutationFn: ({ mobile, otp }: IOtpVerify) => apiClient.post('player-verify-otp/', { mobile, otp }).then(res => res.data)
  });
};
