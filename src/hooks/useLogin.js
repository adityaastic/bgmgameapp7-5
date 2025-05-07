import { useMutation } from '@tanstack/react-query';
import { storeData } from '../constants/storage';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import { apiClientNode } from '../constants/api-client';

export const useLogin = () => {
  const navigation = useNavigation();

  return useMutation({
    mutationFn: async (credentials) => {
      // Basic validation
      const { mobile, mpin } = credentials;

      if (!mobile || mobile.length < 10) {
        throw new Error('Please enter a valid mobile number');
      }

      if (!mpin) {
        throw new Error('Please enter your MPIN');
      }

      try {
        const response = await apiClientNode.post('/login/', credentials);

        if (response.data?.success === false) {
          throw new Error(response.data.message || 'Login failed');
        }

        return response.data;
      } catch (error) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(error.message || 'Login failed');
      }
    },

    onSuccess: async (data, variables) => {
      // Store mobile number
      await storeData({
        key: 'user',
        data: { mobile: variables.mobile }
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }]
      });

      Toast.show('Login successful', Toast.SHORT);
    },

    onError: (error) => {
      const message = error.message || 'Login failed. Please try again';

      if (message === 'Player not found') {
        Toast.show('Account not found. Please Signup first.', Toast.LONG);
      } else {
        Toast.show(message, Toast.LONG);
      }
    }
  });
};
