import { useMutation } from "@tanstack/react-query";
import apiClient from "../constants/api-client";

const useAddKYC = () => {
  return useMutation({
    mutationKey: ["Edit User"],
    mutationFn: ({ id, data }) =>
      apiClient.put(`player-update/${id}/`, data).then((res) => res.data),
  });
};

export default useAddKYC;

export const useVerifyAadhaar = () => {
  return useMutation({
    mutationKey: ["Verify Aadhaar"],
    mutationFn: (data) =>
      apiClient.post(`aadhar-verify/`, data).then((res) => res.data),
  });
};


export const useVerifyPan = () => {
  return useMutation({
    mutationKey: ["Verify Pan"],
    mutationFn: (data) =>
      apiClient.post(`pan-verify/`, data).then((res) => res.data),
  });
};

