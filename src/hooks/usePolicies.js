import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-simple-toast';
import { apiClientNode } from '../constants/api-client';

const usePolicies = () => {
  // URLs for each policy
  const policyUrls = {
    privacyPolicy: 'https://bgmbackend.com/club/privacy-policy/',
    refundPolicy: 'https://bgmbackend.com/club/refund-policy/',
    helpPolicy: 'https://bgmbackend.com/club/help-policy/',
    referralPolicy: 'https://bgmbackend.com/club/referral-policy/',
    cancellationPolicy: 'https://bgmbackend.com/club/cancellation-policy/'
  };

  // Function to fetch a policy
  const fetchPolicy = async (url) => {
    try {
      const response = await apiClientNode.get(url);
      // Return the raw response data which contains the HTML content
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch policy');
    }
  };

  // Individual queries for each policy
  const privacyPolicyQuery = useQuery({
    queryKey: ['privacyPolicy'],
    queryFn: () => fetchPolicy(policyUrls.privacyPolicy),
    onError: (error) => {
      Toast.show(error.message || 'Failed to load Privacy Policy', Toast.LONG);
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const refundPolicyQuery = useQuery({
    queryKey: ['refundPolicy'],
    queryFn: () => fetchPolicy(policyUrls.refundPolicy),
    onError: (error) => {
      Toast.show(error.message || 'Failed to load Refund Policy', Toast.LONG);
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const helpPolicyQuery = useQuery({
    queryKey: ['helpPolicy'],
    queryFn: () => fetchPolicy(policyUrls.helpPolicy),
    onError: (error) => {
      Toast.show(error.message || 'Failed to load Help Policy', Toast.LONG);
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const referralPolicyQuery = useQuery({
    queryKey: ['referralPolicy'],
    queryFn: () => fetchPolicy(policyUrls.referralPolicy),
    onError: (error) => {
      Toast.show(error.message || 'Failed to load Referral Policy', Toast.LONG);
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const cancellationPolicyQuery = useQuery({
    queryKey: ['cancellationPolicy'],
    queryFn: () => fetchPolicy(policyUrls.cancellationPolicy),
    onError: (error) => {
      Toast.show(error.message || 'Failed to load Cancellation Policy', Toast.LONG);
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Function to fetch all policies at once
  const fetchAllPolicies = () => {
    privacyPolicyQuery.refetch();
    refundPolicyQuery.refetch();
    helpPolicyQuery.refetch();
    referralPolicyQuery.refetch();
    cancellationPolicyQuery.refetch();
  };

  return {
    // Individual policy states and functions
    privacyPolicy: {
      data: privacyPolicyQuery.data,
      isLoading: privacyPolicyQuery.isLoading,
      error: privacyPolicyQuery.error,
      refetch: privacyPolicyQuery.refetch,
    },
    refundPolicy: {
      data: refundPolicyQuery.data,
      isLoading: refundPolicyQuery.isLoading,
      error: refundPolicyQuery.error,
      refetch: refundPolicyQuery.refetch,
    },
    helpPolicy: {
      data: helpPolicyQuery.data,
      isLoading: helpPolicyQuery.isLoading,
      error: helpPolicyQuery.error,
      refetch: helpPolicyQuery.refetch,
    },
    referralPolicy: {
      data: referralPolicyQuery.data,
      isLoading: referralPolicyQuery.isLoading,
      error: referralPolicyQuery.error,
      refetch: referralPolicyQuery.refetch,
    },
    cancellationPolicy: {
      data: cancellationPolicyQuery.data,
      isLoading: cancellationPolicyQuery.isLoading,
      error: cancellationPolicyQuery.error,
      refetch: cancellationPolicyQuery.refetch,
    },
    // Function to fetch all policies
    fetchAllPolicies,
    // Loading state for all policies
    isLoading: 
      privacyPolicyQuery.isLoading || 
      refundPolicyQuery.isLoading || 
      helpPolicyQuery.isLoading || 
      referralPolicyQuery.isLoading || 
      cancellationPolicyQuery.isLoading,
    // URLs
    policyUrls,
  };
};

export default usePolicies;