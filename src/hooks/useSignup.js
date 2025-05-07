// // hooks/useSignup.js
// import { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import axios from 'axios';
// import Toast from 'react-native-simple-toast';
// import { useNavigation } from '@react-navigation/native';

// const useSignup = () => {
//   const navigation = useNavigation();
//   const [step, setStep] = useState(1); // 1 for signup, 2 for OTP verification

//   const signupMutation = useMutation({
//     mutationFn: async (data) => {
//       const response = await axios.post('https://bgmbackend.com/nodejs/club/signup/', data);
//       return response.data;
//     },
//     onSuccess: () => {
//       setStep(2); // Move to OTP verification step
//       Toast.show('OTP sent successfully', Toast.SHORT);
//     },
//     onError: (error) => {
//       Toast.show(error.response?.data?.message || 'Signup failed', Toast.LONG);
//     }
//   });

//   const verifyOtpMutation = useMutation({
//     mutationFn: async (data) => {
//       const response = await axios.post('https://bgmbackend.com/nodejs/club/verify-otp/', data);
//       return response.data;
//     },
//     onSuccess: (data) => {
//       Toast.show('Registration successful!', Toast.SHORT);
//       navigation.navigate('LoginScreen');
//     },
//     onError: (error) => {
//       Toast.show(error.response?.data?.message || 'OTP verification failed', Toast.LONG);
//     }
//   });

//   return {
//     step,
//     setStep,
//     signupMutation,
//     verifyOtpMutation
//   };
// };

// export default useSignup;



import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import { apiClientNode } from '../constants/api-client';


const useSignup = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1); // 1 for signup, 2 for OTP verification

  // Mutation: Send signup request
  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClientNode.post('/signup/', data);
      return response.data;
    },
    onSuccess: () => {
      setStep(2); // Move to OTP verification
      Toast.show('OTP sent successfully', Toast.SHORT);
    },
    onError: (error) => {
      Toast.show(error?.response?.data?.message || 'Signup failed', Toast.LONG);
    },
  });

  // Mutation: Verify OTP to complete signup
  const verifyOtpMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClientNode.post('/verify-otp/', data);
      return response.data;
    },
    onSuccess: () => {
      Toast.show('Registration successful!', Toast.SHORT);
      navigation.navigate('LoginScreen');
    },
    onError: (error) => {
      Toast.show(error?.response?.data?.message || 'OTP verification failed', Toast.LONG);
    },
  });

  return {
    step,
    setStep,
    signupMutation,
    verifyOtpMutation,
  };
};

export default useSignup;
