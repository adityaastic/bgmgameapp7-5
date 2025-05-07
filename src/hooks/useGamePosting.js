import React from "react";
import apiClient from "../constants/api-client";
import { useQuery } from "@tanstack/react-query";

const fetchGamePosting = () =>
  apiClient.get("game-post-list/").then((res) => res?.data);

const useGamePosting = () => {
  const {
    data: gamePosting,
    error,
    isLoding,
    refetch
  } = useQuery({
    queryKey: ["GamePosting"],
    queryFn: () => fetchGamePosting(),
  });
  return { gamePosting, error, isLoding, refetch };
};

export default useGamePosting;
