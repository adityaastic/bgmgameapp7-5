// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Easing,
//   TouchableWithoutFeedback,
//   Image,
//   TextInput,
//   Modal,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { ScrollView } from 'react-native-gesture-handler';
// import appStyles from '../styles/appStyles';
// import { usePostMobile, useVerifyOTP } from '../hooks/useAddLogin';
// import { showAlert } from '../components/Alert';
// import { getData, storeData } from '../constants/storage';
// import Loader from '../components/Loader';
// import CustomButton from '../components/CustomButton';
// import axios from 'axios';
// import apiClient, { BaseURLCLUB } from '../constants/api-client';
// import OtpInputs from 'react-native-otp-inputs';
// import COLORS from '../components/COLORS';
// import Toast from 'react-native-simple-toast';
// import useLoginContent from '../hooks/useLoginContent';



// interface IUserInfo {
//   mobile: string;
// }

// const LoginScreen = () => {
//   const navigation = useNavigation();
//   const { loginContent } = useLoginContent();

//   //---------- Input Form ----------//
//   const [textInput1, setTextInput1] = useState('');
//   const [refCode, setRefCode] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [loader, setLoader] = useState(false);
//   //---------- Input Form End ----------//

//   useEffect(() => {
//     let user;
//     (async function getUserData() {
//       user = await getData("user")
//       console.log("From Login Screen", user)
//       //user !== null && navigation.navigate('HomeScreen')
//     })()
//   }, [])


//   //-------- Modal -------//
//   const [modalVisible, setModalVisible] = useState(false);

//   //-------- End -------//

//   //-------- OTP Input -------//
//   const [otp, setOtp] = useState('');
//   const inputRefs = [
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//     useRef<TextInput>(null),
//   ];

//   const handleChange = (text) => {

//     console.log(text)
//     setOtp(text);
//   };

//   const postMobile = usePostMobile();
//   const verifyOTP = useVerifyOTP();

//   const handleVerifyMobile = async () => {
//     console.log("Send Otp")

//     //setLoader(true)

//     if (!textInput1.length > 0) {
//       Toast.show("Please enter your mobile number.", Toast.LONG);

//     }
//     else if (textInput1.length < 10) {
//       Toast.show("Please enter valid mobile number.", Toast.LONG);
//     }
//     else {

//       setLoader(true)

//       var params = { mobile: textInput1, refered_by: refCode }


//       axios.post(BaseURLCLUB + '/login/', params).then((response) => {
//         console.log(response)
//         if (response.data) {
//           setModalVisible(true)
//           setLoader(false)
//         }
//         else {
//           setModalVisible(false)
//           setLoader(false)
//         }
//       })
      
//     }



//   }


//   const handleVerifyOtp = async () => {

//     console.log(otp)

//     if (otp.length < 1) {
//       Toast.show("Please enter your otp.", Toast.LONG);
//     }
//     else if (otp.length < 6) {
//       Toast.show("Please enter valid otp.", Toast.LONG);
//     }
//     else {
//       setLoader(true)

//       const userInfo = {
//         mobile: textInput1,
//         otp: otp
//       }

//       axios.post(BaseURLCLUB + '/player-verify-otp/', userInfo).then((response) => {
//         console.log("Data 111111 :- ", response)

//         setLoader(false)
//         storeData<IUserInfo>({ key: "user", data: { mobile: textInput1 } })
//         navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] })

//       }).catch((error) => {
//         setLoader(false)
//         Toast.show("Please enter valid otp.", Toast.LONG);
//       })
//     }




//   }



//   //-------- End -------//

//   return (
//     <View style={{ flex: 1, backgroundColor: '#ffffff', }}>
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           flexDirection: 'row',
//           alignItems: 'center',
//         }}></View>


//       <ScrollView>
//         <View
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginBottom: 30,
//           }}>
//           <Image
//             source={require('../images/app_ic.png')}
//             style={[styles.logoimage, { height: 140, width: 140 }]}
//           />
//         </View>

//         {/* <View style={{ width: '100%', alignItems: 'center', backgroundColor: COLORS.black }}>
//           <Text style={{ fontSize: 17, color: COLORS.white, marginHorizontal: 20, textAlign: 'center', paddingVertical: 5 }}>{loginContent?.heading}</Text>
//         </View> */}

//         <View
//           style={{ backgroundColor: '#E1EFE6', padding: 20, borderRadius: 10, marginHorizontal: 20, marginTop: 20 }}>
//           <View style={{ marginBottom: 20, position: 'relative' }}>
//             <Text
//               style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
//               Mobile Number
//             </Text>
//             <Text
//               style={{
//                 color: '#ffffff',
//                 fontWeight: '500',
//                 position: 'absolute',
//                 left: 0,
//                 backgroundColor: '#000000',
//                 top: 30,
//                 zIndex: 1,
//                 padding: 19,
//               }}>
//               +91
//             </Text>
//             <TextInput
//               style={[
//                 styles.formInput,
//                 { paddingLeft: 80, backgroundColor: '#fff' },
//               ]}
//               onChangeText={text => setTextInput1(text.replace(/[^0-9]/g, ''))}
//               value={textInput1}
//               placeholder="Enter Mobile Number"
//               keyboardType="numeric"
//               maxLength={10}
//             />
//           </View>
//           <View style={{ marginBottom: 20, position: 'relative' }}>
//             {!otpSent && (
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter Referral Code"
//                 keyboardType="numeric"
//                 onChangeText={text => setRefCode(text.replace(/[^0-9]/g, ''))}
//                 value={refCode}
//               />
//             )}
//             {!otpSent && <Text style={styles.optional}>(Optional)</Text>}


//           </View>

//           <TouchableOpacity
//             disabled={postMobile.isPending}
//             style={postMobile.isPending ? styles.disabledBtn : styles.Btn}
//             onPress={() => handleVerifyMobile()}>
//             <Text style={styles.primaryBtn}>Send otp</Text>
//             <View style={styles.bottomBorder} />
//           </TouchableOpacity>


//         </View>

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}>
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             }}>
//             <View
//               style={{
//                 backgroundColor: 'white',
//                 minHeight: 250,
//                 width: '92%',
//                 borderTopEndRadius: 15,
//                 borderTopLeftRadius: 15,
//                 position: 'relative',
//                 borderRadius: 10,
//               }}>
//               <View
//                 style={{
//                   alignItems: 'center',
//                   display: 'flex',
//                   justifyContent: 'center',
//                   flexDirection: 'row',
//                   marginTop: -45,
//                 }}>
//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   style={styles.closebutton}>
//                   <Text style={styles.textIcon}>
//                     <AntDesign name="close" size={24} color={'#707070'} />{' '}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <View>
//                   <View style={{ padding: 20 }}>
//                     <Text
//                       style={{
//                         color: '#000000',
//                         fontWeight: '500',
//                         textAlign: 'center',
//                       }}>
//                       OTP Verification
//                     </Text>
//                     <Text
//                       style={{
//                         color: '#000000',
//                         textAlign: 'center',
//                         fontSize: 12,
//                         paddingTop: 5,
//                       }}>
//                       Enter the otp sent to your number
//                     </Text>

//                     <OtpInputs
//                       handleChange={(code) => handleChange(code)}
//                       numberOfInputs={6}
//                       inputContainerStyles={{ height: 50, width: 50, borderColor: COLORS.black, borderWidth: 1, alignItems: 'center', justifyContent: 'center', margin: 1, borderRadius: 10, }}
//                       style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
//                       inputStyles={{ fontSize: 20, color: COLORS.black, textAlign: 'center' }}

//                     />

//                     <View
//                       style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         paddingTop: 20,
//                       }}>
//                       <View style={{ width: '48%' }}>
//                         <TouchableOpacity
//                           style={styles.Btn}
//                           disabled={loader ? true : false}
//                           onPress={() => handleVerifyOtp()}>
//                           <Text style={styles.primaryBtn}>{!loader ? 'Verify otp' : 'Verifying'}</Text>
//                           <View style={styles.bottomBorder} />
//                         </TouchableOpacity>
//                       </View>
//                     </View>

//                     <TouchableOpacity
//                       disabled={verifyOTP.isPending}
//                       style={verifyOTP.isPending ? styles.disabledBtn : { marginTop: 20 }} >
//                       <Text
//                         style={{
//                           color: '#4CB050',
//                           textAlign: 'center',
//                           fontWeight: '500',
//                         }}>
//                         Resend OTP
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Modal>

//       </ScrollView>
//       <Loader visiblity={loader} />

//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   ...appStyles,
// });

// export default LoginScreen;



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
import AntDesign from 'react-native-vector-icons/AntDesign';
import appStyles from '../styles/appStyles';
import { storeData } from '../constants/storage';
import Loader from '../components/Loader';
import axios from 'axios';
import { BaseURLCLUBNode } from '../constants/api-client';
import COLORS from '../components/COLORS';
import Toast from 'react-native-simple-toast';
import useLoginContent from '../hooks/useLoginContent';

interface IUserInfo {
  mobile: string;
}

const LoginScreen = () => {
  const navigation = useNavigation();
  const { loginContent } = useLoginContent();

  // Input Form
  const [mobile, setMobile] = useState('');
  const [mpin, setMpin] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    let user;
    (async function getUserData() {
      user = await getData("user");
      console.log("From Login Screen", user);
      // user !== null && navigation.navigate('HomeScreen')
    })();
  }, []);

  const handleLogin = async () => {
    if (!mobile.length > 0) {
      Toast.show("Please enter your mobile number.", Toast.LONG);
    }
    else if (mobile.length < 10) {
      Toast.show("Please enter valid mobile number.", Toast.LONG);
    }
    else if (!mpin.length > 0) {
      Toast.show("Please enter your MPIN.", Toast.LONG);
    }
    else {
      setLoader(true);

      const loginData = { 
        mobile: mobile,
        mpin: mpin
      };

      try {
        const response = await axios.post(BaseURLCLUBNode + '/login/', loginData);
        console.log("Login response:", response.data);
        
        if (response.data) {
          // Store user data
          await storeData<IUserInfo>({ key: "user", data: { mobile: mobile } });
          
          // Navigate to home screen
          navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
        }
        setLoader(false);
      } catch (error) {
        console.error("Login error:", error);
        setLoader(false);
        Toast.show("Invalid mobile number or MPIN. Please try again.", Toast.LONG);
      }
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
        }}>
      </View>

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
          {/* Mobile Number Input */}
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
                { paddingLeft: 80, backgroundColor: '#fff', height: 50, fontSize: 16 },
              ]}
              onChangeText={text => setMobile(text.replace(/[^0-9]/g, ''))}
              value={mobile}
              placeholder="Enter Mobile Number"
              keyboardType="numeric"
              maxLength={10}
              editable={true}
              autoCapitalize="none"
            />
          </View>

          {/* MPIN Input */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{ color: '#000000', marginBottom: 10, fontWeight: '500' }}>
              MPIN
            </Text>
            <TextInput
              style={[styles.formInput, { backgroundColor: '#fff', height: 50, fontSize: 16 }]}
              onChangeText={text => setMpin(text)}
              value={mpin}
              placeholder="Enter MPIN"
              secureTextEntry={true}
              editable={true}
              autoCapitalize="none"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={loader ? styles.disabledBtn : styles.Btn}
            disabled={loader}
            onPress={handleLogin}>
            <Text style={styles.primaryBtn}>Login</Text>
            <View style={styles.bottomBorder} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Loader visiblity={loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  formInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
    width: '100%',
  },
});

export default LoginScreen;