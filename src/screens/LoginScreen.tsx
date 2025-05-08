import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import appStyles from '../styles/appStyles';
import { getData } from '../constants/storage';
import Loader from '../components/Loader';
import COLORS from '../components/COLORS';
import Toast from 'react-native-simple-toast';
import { useLogin } from '../hooks/useLogin';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Add this import
import PolicyLinks from '../components/PolicyLinks';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [mpin, setMpin] = useState('');
  const [loader, setLoader] = useState(false);
  const [showMpin, setShowMpin] = useState(false); // Add this state
  const loginMutation = useLogin();

  useEffect(() => {
    (async function getUserData() {
      const user = await getData("user");
      console.log("From Login Screen", user);
      // Uncomment to auto-navigate when user is logged in
      // user !== null && navigation.navigate('HomeScreen');
    })();
  }, []);

  const handleLogin = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      Toast.show("Please enter a valid mobile number.", Toast.LONG);
      return;
    }
    
    if (!mpin) {
      Toast.show("Please enter your MPIN.", Toast.LONG);
      return;
    }

    setLoader(true);
    
    try {
      await loginMutation.mutateAsync({
        mobile: mobileNumber,
        mpin: mpin
      });
    } catch (error) {
      console.log("Login error111:", error);
      if (error.response && error.response.data && error.response.data.message) {
        Toast.show(error.response.data.message, Toast.LONG);
      } else {
        Toast.show("Login failed. Please try again.", Toast.LONG);
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}></View>

      <ScrollView>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Image
            source={require('../images/app_ic.png')}
            style={[styles.logoimage, { height: 140, width: 140 }]}
          />
        </View>

        <View
          style={{ backgroundColor: '#E1EFE6', padding: 20, borderRadius: 10, marginHorizontal: 20, marginTop: 20 }}>
          <View style={{ marginBottom: 20, position: 'relative' }}>
            <Text
              style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
              Mobile Number
            </Text>
            <Text
              style={{
                color: '#ffffff',
                fontWeight: '500',
                position: 'absolute',
                left: 0,
                backgroundColor: '#000000',
                top: 30,
                zIndex: 1,
                padding: 19,
              }}>
              +91
            </Text>
            <TextInput
              style={[
                styles.formInput,
                { paddingLeft: 80, backgroundColor: '#fff' },
              ]}
              onChangeText={(text) => setMobileNumber(text.replace(/[^0-9]/g, ''))}
              value={mobileNumber}
              placeholder="Enter Mobile Number"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
              MPIN
            </Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[styles.formInput, { backgroundColor: '#fff', paddingRight: 50 }]}
                onChangeText={(text) => setMpin(text)}
                value={mpin}
                placeholder="Enter 6 digit MPIN"
                secureTextEntry={!showMpin}
                maxLength={6}
              />
              <TouchableOpacity 
                style={{ position: 'absolute', right: 15, top: 15 }}
                onPress={() => setShowMpin(!showMpin)}
              >
                <Icon 
                  name={showMpin ? 'visibility' : 'visibility-off'} 
                  size={24} 
                  color="#888" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            disabled={loginMutation.isPending}
            style={loginMutation.isPending ? styles.disabledBtn : styles.Btn}
            onPress={handleLogin}>
            <Text style={styles.primaryBtn}>Login</Text>
            <View style={styles.bottomBorder} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 20, alignItems: 'center' }}
            onPress={() => navigation.navigate('ForgotPasswordScreen')}>
            <Text style={{ color: '#4CB050', fontWeight: '500' }}>
              Forgot MPIN?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20, marginBottom:70, alignItems: 'center' }}>
          <Text style={{ color: '#000000' }}>
            Don't have an account?{' '}
            <Text
              style={{ color: '#4CB050', fontWeight: '500' }}
              onPress={() => navigation.navigate('RegisterScreen')}>
              Signup
            </Text>
          </Text>
        </View>

        <View style={styles.policiesContainer}>
  <PolicyLinks />
</View>
      </ScrollView>



      <Loader visiblity={loader} />
    </View>

    
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default LoginScreen;