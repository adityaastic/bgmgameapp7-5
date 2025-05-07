import { useMutation } from "@tanstack/react-query";
import {apiClientNode} from "../constants/api-client";

interface ILoginCredentials {
  mobile: string;
  mpin: string;
}

export const useLogin = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (credentials: ILoginCredentials) => 
        apiClientNode.post('login/', credentials).then(res => res.data)
  });
};

export default useLogin;