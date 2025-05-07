// // hooks/useForgotPassword.js
// import { useMutation } from '@tanstack/react-query';
// import axios from 'axios';
// import Toast from 'react-native-simple-toast';
// import { useNavigation } from '@react-navigation/native';

// const useForgotPassword = () => {
//   const navigation = useNavigation();

//   const forgotPasswordMutation = useMutation({
//     mutationFn: async (data) => {
//       const response = await axios.post('https://bgmbackend.com/nodejs/club/forgot-password/', data);
//       return response.data;
//     },
//     onSuccess: () => {
//       Toast.show('OTP sent successfully', Toast.SHORT);
//     },
//     onError: (error) => {
//       Toast.show(error.response?.data?.message || 'Failed to send OTP', Toast.LONG);
//     }
//   });

//   const verifyOtpMutation = useMutation({
//     mutationFn: async (data) => {
//       const response = await axios.post('https://bgmbackend.com/nodejs/club/verify-otp/', data);
//       return response.data;
//     },
//     onSuccess: () => {
//       Toast.show('Password reset successfully!', Toast.SHORT);
//       navigation.navigate('LoginScreen');
//     },
//     onError: (error) => {
//       Toast.show(error.response?.data?.message || 'OTP verification failed', Toast.LONG);
//     }
//   });

//   return {
//     forgotPasswordMutation,
//     verifyOtpMutation
//   };
// };

// export default useForgotPassword;



import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import { apiClientNode } from '../constants/api-client';


const useForgotPassword = () => {
  const navigation = useNavigation();

  // Mutation for sending OTP
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClientNode.post('/forgot-password/', data);
      return response.data;
    },
    onSuccess: () => {
      Toast.show('OTP sent successfully', Toast.SHORT);
    },
    onError: (error) => {
      Toast.show(error?.response?.data?.message || 'Failed to send OTP', Toast.LONG);
    },
  });

  // Mutation for verifying OTP and resetting password
  const verifyOtpMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClientNode.post('/verify-otp/', data);
      return response.data;
    },
    onSuccess: () => {
      Toast.show('Password reset successfully!', Toast.SHORT);
      navigation.navigate('LoginScreen');
    },
    onError: (error) => {
      Toast.show(error?.response?.data?.message || 'OTP verification failed', Toast.LONG);
    },
  });

  return {
    forgotPasswordMutation,
    verifyOtpMutation,
  };
};

export default useForgotPassword;
