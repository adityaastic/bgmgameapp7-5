import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useTermsConditions } from '../hooks/useContentApi';
import HTML from 'react-native-render-html';

const TermsConditionsScreen = () => {
  const { data, isLoading, isError, error } = useTermsConditions();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CB050" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <HTML 
        source={{ html: data?.heading + data?.paragraph }}
        contentWidth={300}
        tagsStyles={{
          h1: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
          p: { fontSize: 16, marginVertical: 5 }
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  content: {
    paddingBottom: 30
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20
  }
});

export default TermsConditionsScreen;