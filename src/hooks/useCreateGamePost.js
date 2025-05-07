import { useMutation } from "@tanstack/react-query";
import { useUser } from "../constants/storage";
import apiClient from "../constants/api-client";


const postMobileNumber = (data) => apiClient.post('create-game-post/', data).then(res => res.data)

const useCreateGamePost = () => {

  return useMutation({
    mutationKey: ['Gamepost'],
    mutationFn: (data) => postMobileNumber(data),
    onSuccess: (data) => console.log(data)
  })
}

export default useCreateGamePost