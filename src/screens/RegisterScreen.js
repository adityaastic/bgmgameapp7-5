
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import appStyles from '../styles/appStyles';
import COLORS from '../components/COLORS';
import Toast from 'react-native-simple-toast';
import Loader from '../components/Loader';
import useSignup from '../hooks/useSignup';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import PolicyLinks from '../components/PolicyLinks';

const RegisterScreen = () => {
  const {
    step,
    setStep,
    signupMutation,
    verifyOtpMutation
  } = useSignup();

  // Form state
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [mpin, setMpin] = useState('');
  const [otp, setOtp] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const navigation = useNavigation();
  

  const handleSignup = () => {
    if (!mobile || mobile.length < 10) {
      Toast.show("Please enter a valid mobile number", Toast.LONG);
      return;
    }
    
    if (!email || !email.includes('@')) {
      Toast.show("Please enter a valid email address", Toast.LONG);
      return;
    }

    if (!isTermsAccepted) {
      Toast.show("Please accept the terms and conditions", Toast.LONG);
      return;
    }

    signupMutation.mutate({
      mobile,
      email,
      referred_by: referredBy
    });
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      Toast.show("Please enter a valid OTP", Toast.LONG);
      return;
    }
    
    if (!mpin || mpin.length < 4) {
      Toast.show("Please enter a valid MPIN (6 characters)", Toast.LONG);
      return;
    }

    verifyOtpMutation.mutate({
      mobile,
      email,
      mpin,
      otp
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30, }}>
          <Image
            source={require('../images/app_ic.png')}
            style={[styles.logoimage, { height: 140, width: 140 }]}
          />
        </View>

        {step === 1 ? (
          <View style={{ backgroundColor: '#E1EFE6', padding: 20, borderRadius: 10, marginHorizontal: 20, marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Create Account</Text>
            
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>Mobile Number</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: '#fff' }]}
                onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
                value={mobile}
                placeholder="Enter Mobile Number"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>Email</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: '#fff' }]}
                onChangeText={setEmail}
                value={email}
                placeholder="Enter Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>Referral Code (Optional)</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: '#fff' }]}
                onChangeText={setReferredBy}
                value={referredBy}
                placeholder="Enter Referral Code"
                autoCapitalize="none"
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <CheckBox
                value={isTermsAccepted}
                onValueChange={setIsTermsAccepted}
                tintColors={{ true: '#4CB050', false: '#767577' }}
              />
              <Text style={{ marginLeft: 8, flexShrink: 1 }}>
                I agree to the{' '}
                <Text 
                  style={{ color: '#4CB050', textDecorationLine: 'underline' }}
                  onPress={() => navigation.navigate('TermsAndConditions')}>
                  Terms and Conditions
                </Text>{' '}
                and{' '}
                <Text 
                  style={{ color: '#4CB050', textDecorationLine: 'underline' }}
                  onPress={() => navigation.navigate('PrivacyPolicy')}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              disabled={signupMutation.isPending || !isTermsAccepted}
              style={signupMutation.isPending || !isTermsAccepted ? styles.disabledBtn : styles.Btn}
              onPress={handleSignup}>
              <Text style={styles.primaryBtn}>Signup</Text>
              <View style={styles.bottomBorder} />
            </TouchableOpacity>

            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <Text style={{ color: '#000000' }}>
                Already have an account?{' '}
                <Text
                  style={{ color: '#4CB050', fontWeight: '500' }}
                  onPress={() => navigation.navigate('LoginScreen')}>
                  Login
                </Text>
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: '#E1EFE6', padding: 20, borderRadius: 10, marginHorizontal: 20, marginTop: 20, }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Verify OTP</Text>
            
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>OTP</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: '#fff' }]}
                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
                value={otp}
                placeholder="Enter 6 OTP"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>MPIN</Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: '#fff' }]}
                onChangeText={setMpin}
                value={mpin}
                placeholder="Create Your 6 digit MPIN"
                secureTextEntry={true}
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              disabled={verifyOtpMutation.isPending}
              style={verifyOtpMutation.isPending ? styles.disabledBtn : styles.Btn}
              onPress={handleVerifyOtp}>
              <Text style={styles.primaryBtn}>Verify & Signup</Text>
              <View style={styles.bottomBorder} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 20, alignItems: 'center' }}
              onPress={() => setStep(1)}>
              <Text style={{ color: '#4CB050', fontWeight: '500' }}>
                Back to Signup
              </Text>
            </TouchableOpacity>
          </View>
        )}

        </ScrollView>

{/* Sticky policy links at bottom */}
<View style={styles.policiesSticky}>
  <PolicyLinks />
</View>

<Loader visiblity={signupMutation.isPending || verifyOtpMutation.isPending} />

    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default RegisterScreen;