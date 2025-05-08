import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import usePolicies from '../hooks/usePolicies'; // Adjust the path as needed

const PolicyLinks = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const policies = usePolicies();
  const { width } = useWindowDimensions();

  const openPolicyModal = (policyType) => {
    setSelectedPolicy(policyType);
  };

  const closePolicyModal = () => {
    setSelectedPolicy(null);
  };

  const renderPolicyContent = () => {
    if (!selectedPolicy) return null;

    const policyData = policies[selectedPolicy];
    
    if (policyData.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading policy...</Text>
        </View>
      );
    }

    if (policyData.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load policy. Please try again.</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={policyData.refetch}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Check if we have data and it's in the expected format
    if (!policyData.data) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No policy content available.</Text>
        </View>
      );
    }

    // Handle the response format based on your API
    const policyContent = policyData.data;
    let htmlContent = '';
    
    // Check if the content is in the format you provided with heading and paragraph
    if (policyContent.heading && policyContent.paragraph) {
      htmlContent = policyContent.heading + policyContent.paragraph;
    } else if (typeof policyContent === 'string') {
      // If the content is just a string, use it directly
      htmlContent = policyContent;
    } else {
      // Try to handle other formats
      try {
        if (typeof policyContent === 'object') {
          // If it's another object structure, try to extract HTML content
          const values = Object.values(policyContent);
          htmlContent = values.filter(val => typeof val === 'string' && (val.includes('<') || val.includes('>'))).join('');
        }
      } catch (e) {
        console.error('Error parsing policy content:', e);
      }
    }

    // Render the HTML content
    return (
      <ScrollView style={styles.policyContentContainer}>
        <RenderHtml
          contentWidth={width - 60} // Adjust according to your padding
          source={{ html: htmlContent }}
          tagsStyles={{
            p: { color: '#333', lineHeight: 24, marginBottom: 10 },
            h4: { color: '#000', marginBottom: 15, marginTop: 20 },
            h6: { color: '#000', marginBottom: 10, marginTop: 15 },
            a: { color: '#007BFF', textDecorationLine: 'underline' }
          }}
        />
      </ScrollView>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => openPolicyModal('privacyPolicy')}>
          <Text style={styles.policyLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => openPolicyModal('refundPolicy')}>
          <Text style={styles.policyLink}>Refund Policy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => openPolicyModal('helpPolicy')}>
          <Text style={styles.policyLink}>Help Policy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => openPolicyModal('cancellationPolicy')}>
          <Text style={styles.policyLink}>Cancellation Policy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => openPolicyModal('referralPolicy')}>
          <Text style={styles.policyLink}>Referral Policy</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={selectedPolicy !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={closePolicyModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedPolicy === 'privacyPolicy' && 'Privacy Policy'}
              {selectedPolicy === 'refundPolicy' && 'Refund Policy'}
              {selectedPolicy === 'helpPolicy' && 'Help Policy'}
              {selectedPolicy === 'cancellationPolicy' && 'Cancellation Policy'}
              {selectedPolicy === 'referralPolicy' && 'Referral Policy'}
            </Text>
            
            {renderPolicyContent()}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closePolicyModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 5,
      flexWrap: 'wrap',
    },
    policyLink: {
      color: '#4CB050', // changed to green
      fontSize: 12,
      paddingHorizontal: 4,
    },
    separator: {
      color: '#666',
      fontSize: 12,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingTop: 40,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 60,
      width: '90%',
      height: '80%',
      maxHeight: 600,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
      color: '#4CB050', // title in green
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      color: '#4CB050', // loading text in green
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: '#ff3b30', // keeping red for error is typical
      marginBottom: 15,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: '#4CB050', // changed to green
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    retryButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    policyContentContainer: {
      flex: 1,
      marginBottom: 15,
    },
    policyContent: {
      color: '#333',
      lineHeight: 20,
    },
    closeButton: {
      backgroundColor: '#4CB050', // changed to green
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    policiesSticky: {
  position: 'absolute',
  bottom: 60, 
  left: 0,
  right: 0,
  alignItems: 'center',
},

  });
  

export default PolicyLinks;