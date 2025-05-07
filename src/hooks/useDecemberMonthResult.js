import React from "react";
import apiClient, { adminApiClient } from "../constants/api-client";
import { useQuery } from "@tanstack/react-query";

const fetchDecemberMonthResult = (params) =>
  adminApiClient.get("result-list/", { params }).then((res) => res.data);

const useDecemberMonthResult = ({ date = "" } = {}) => {
  const params = {
    ...(date && { year_month: date }),
  };

  const {
    data: result,
    error,
    isLoding,
  } = useQuery({
    queryKey: ["December Month Results", params],
    queryFn: () => fetchDecemberMonthResult(params),
  });

  return { result, error, isLoding };
};

export default useDecemberMonthResult;
