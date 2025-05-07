import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../constants/api-client';


// Generic fetcher using apiClient
const fetchContent = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch content');
  }
};

// Custom hook for Terms & Conditions
export const useTermsConditions = () => {
  const navigation = useNavigation();

  return useQuery({
    queryKey: ['termsConditions'],
    queryFn: () => fetchContent('/terms-condition-bgm/'),
    onError: (error) => {
      Toast.show(error.message, Toast.LONG);
      navigation.goBack(); // optional navigation
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Custom hook for Privacy Policy
export const usePrivacyPolicy = () => {
  const navigation = useNavigation();

  return useQuery({
    queryKey: ['privacyPolicy'],
    queryFn: () => fetchContent('/privacy-policy/'),
    onError: (error) => {
      Toast.show(error.message, Toast.LONG);
      navigation.goBack(); // optional navigation
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
