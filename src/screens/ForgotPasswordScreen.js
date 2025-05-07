import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Loader from '../components/Loader';
import appStyles from '../styles/appStyles';
import useForgotPassword from '../hooks/useForgotPassword';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'react-native-feather'; // Make sure to install react-native-feather or use another icon library

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { forgotPasswordMutation, verifyOtpMutation } = useForgotPassword();

  const [step, setStep] = useState('enterMobile'); // 'enterMobile' | 'enterOtp'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [showMpin, setShowMpin] = useState(false);
  const [showConfirmMpin, setShowConfirmMpin] = useState(false);

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) {
      Toast.show("Please enter a valid mobile number", Toast.LONG);
      return;
    }
    forgotPasswordMutation.mutate(
      { mobile },
      {
        onSuccess: () => setStep('enterOtp')
      }
    );
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 6) {
      Toast.show("Please enter a valid OTP", Toast.LONG);
      return;
    }
    if (!mpin || mpin.length < 4) {
      Toast.show("Please enter a valid MPIN (min 4 characters)", Toast.LONG);
      return;
    }
    if (mpin !== confirmMpin) {
      Toast.show("MPINs do not match", Toast.LONG);
      return;
    }
    verifyOtpMutation.mutate({
      mobile,
      mpin,
      otp
    });
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

        <View style={{ backgroundColor: '#E1EFE6', padding: 20, borderRadius: 10, marginHorizontal: 20, marginTop: 20 }}>
          <Text style={styles.title}>Forgot MPIN</Text>
          <Text style={styles.subtitle}>
            {step === 'enterMobile'
              ? 'Enter your mobile number to receive OTP'
              : 'Enter OTP and new MPIN'}
          </Text>

          {step === 'enterMobile' ? (
            <>
              <View style={{ marginBottom: 20, position: 'relative' }}>
                <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
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
                  value={mobile}
                  onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
                  placeholder="Enter Mobile Number"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <TouchableOpacity
                disabled={forgotPasswordMutation.isPending}
                style={forgotPasswordMutation.isPending ? styles.disabledBtn : styles.Btn}
                onPress={handleSendOtp}>
                <Text style={styles.primaryBtn}>Send OTP</Text>
                <View style={styles.bottomBorder} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
                  OTP
                </Text>
                <TextInput
                  style={[styles.formInput, { backgroundColor: '#fff' }]}
                  value={otp}
                  onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
                  placeholder="Enter OTP"
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
                  New MPIN
                </Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: '#fff', paddingRight: 40 }]}
                    secureTextEntry={!showMpin}
                    value={mpin}
                    onChangeText={setMpin}
                    placeholder="Enter new MPIN"
                    maxLength={6}
                  />
                  <TouchableOpacity 
                    style={{ position: 'absolute', right: 10, top: 12 }}
                    onPress={() => setShowMpin(!showMpin)}
                  >
                    {showMpin ? (
                      <Eye stroke="#666" width={20} height={20} />
                    ) : (
                      <EyeOff stroke="#666" width={20} height={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
                  Confirm MPIN
                </Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: '#fff', paddingRight: 40 }]}
                    secureTextEntry={!showConfirmMpin}
                    value={confirmMpin}
                    onChangeText={setConfirmMpin}
                    placeholder="Confirm MPIN"
                    maxLength={6}
                  />
                  <TouchableOpacity 
                    style={{ position: 'absolute', right: 10, top: 12 }}
                    onPress={() => setShowConfirmMpin(!showConfirmMpin)}
                  >
                    {showConfirmMpin ? (
                      <Eye stroke="#666" width={20} height={20} />
                    ) : (
                      <EyeOff stroke="#666" width={20} height={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                disabled={verifyOtpMutation.isPending}
                style={verifyOtpMutation.isPending ? styles.disabledBtn : styles.Btn}
                onPress={handleVerifyOtp}>
                <Text style={styles.primaryBtn}>Reset MPIN</Text>
                <View style={styles.bottomBorder} />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={{ marginTop: 20, alignItems: 'center' }}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={{ color: '#4CB050', fontWeight: '500' }}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  },
});

export default ForgotPasswordScreen;