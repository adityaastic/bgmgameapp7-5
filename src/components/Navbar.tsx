import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ImageBackground,
  Linking,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import appStyles from '../styles/appStyles';
import { getData, removeData } from '../constants/storage';
import { fetchMobile } from '../hooks/useWallet';
import { useGameSettings, usePlayerData } from '../hooks/useHome';
import { Modal } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { TextInput } from 'react-native';
import { BaseURLCLUB } from '../constants/api-client';
import { showAlert } from './Alert';
import { useVerifyAadhaar, useVerifyPan } from '../hooks/useAddKYC';
import Loader from './Loader';




// const [modalVisibleWhatsApp, setModalVisibleWhatsApp] = useState(false);

const Navbar = ({ navigation, isMenuVisible, modalVisibleWhatsApp, setModalVisibleWhatsApp, modalVisibleRefer, setModalVisibleRefer, modelVisibleSpin, setModalVisibleSpin }: any) => {
  // =========> States
  const [mobile, setMobile] = useState("");
  const gameSetting = useGameSettings();
  const verifyAadhaar = useVerifyAadhaar();
  const verifyPan = useVerifyPan();
  const [modalVisible, setModalVisible] = useState(false);
  const [navTabsHomeName, setNavTabsHomeName] = useState('PersonalInfo');
  const [addPointsAmount, setAddPointsAmount] = useState('');
  const [imageData, setImageData] = useState({})
  const [imageDataBack, setimageDataBack] = useState({})
  const [imageDataPan, setimagePan] = useState({})
  const [imageDataProfile, setimageProfile] = useState({})
  const [loader, setLoader] = useState(false)
  const [profileImage, setProfileImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');

  const [bank, setBank] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [openKyc, setOpenKyc] = useState(true);
  const [activeCard, setActiveCard] = useState('aadhar');
  const [aadharFront, setAadharFront] = useState('');
  const [aadharBack, setAadharBack] = useState('');
  const [modalVisible4, setModalVisible4] = useState(false);
  const [panImage, setPanImage] = useState('');












  // =========> Make API Requests using custom hooks
  const playerData = usePlayerData();



  // =========> Fetch player info
  useEffect(() => {
    if (!mobile) {
      fetchMobile(setMobile).then(mobile => playerData.mutate({ mobile }));
    }
  }, [mobile, playerData]);



  const navTabsHomeFunc = tabName => {
    setNavTabsHomeName(tabName);
  };



  // =========> Log Player OUT
  const handleLogout = async () => {
    await removeData("user");
    const userAfterRemoval = await getData("user");
    console.log('User after removal:', userAfterRemoval);
    navigation.navigate('LoginScreen');
  };



  // =============== UI ==================
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(menuAnimation, {
        toValue: isMenuVisible ? 1 : 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: isMenuVisible ? 0.5 : 0, // Adjust the opacity value as needed
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isMenuVisible, menuAnimation, backgroundOpacity]);


  const menuSlide = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });


  const whatsappBtn = (url: any) => {
    Linking.openURL(url);
  }

  const instaBtn = (url: any) => {
    Linking.openURL(url);
  }

  const facebookBtn = (url: any) => {
    Linking.openURL(url);
  }

  const pickDocument = async (setter, type) => {
    console.log(setter)
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false // Specify image types if needed
      });

      console.log(result)

      const imageDetails = {
        uri: result[0].uri,
        name: result[0].name,
        type: result[0].type,
      };

      setter(imageDetails)
      if (type == "1") {
        setImageData(result[0])
      }
      else if (type == "2") {
        setimageDataBack(result[0])
      }
      else if (type == "3") {
        setimagePan(result[0])
      }
      else {
        setimageProfile(result[0])
      }

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };




  const onKycSubmit = async () => {
    setLoader(true)
    setModalVisible(false)


    const formData = new FormData();

    // Ensure each image file is correctly formatted
    console.log('aadharFront :', aadharFront)
    console.log('aadharBack :', aadharBack)
    console.log('panImage :', panImage)
    console.log('profileImage :', profileImage)

    if (aadharFront) {
      formData.append("aadhar_front", {
        uri: aadharFront.uri,
        type: aadharFront.type,
        name: aadharFront.name,
      });
    }
    if (aadharBack) {
      formData.append("aadhar_back", {
        uri: aadharBack.uri,
        type: aadharBack.type,
        name: aadharBack.name,
      });
    }
    if (panImage) {
      formData.append("pan_image", {
        uri: panImage.uri,
        type: panImage.type,
        name: panImage.name,
      });
    }
    if (profileImage) {
      formData.append("image", {
        uri: profileImage.uri,
        type: profileImage.type,
        name: profileImage.name,
      });
    }

    // Append other form data
    formData.append("aadhar", aadhar);
    formData.append("pan", pan);
    formData.append("bank", bank);
    formData.append("account_holder", verifyPan?.data?.name || "");
    formData.append("account_number", accountNo);
    formData.append("ifsc", ifsc);
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("kyc", true);



    try {
      console.log(formData);

      // Make sure to set the headers for multipart/form-data
      const response = await fetch(`${BaseURLCLUB}/player-update/${mobile}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Submit Kyc Successfully');
        showAlert("Submit Kyc Successfully")
        const responseData = await response.json();
        console.log("Upload successful", responseData);
        fetchMobile(setMobile).then(mobile => playerData.mutate({ mobile }));
      } else {
        const errorData = await response.json();
        console.log('Error Response:', errorData);
        showAlert("Submit Kyc Unsuccessfully")
      }
      setLoader(false)
    } catch (error) {
      console.log('Error Message:', error.message);
      setLoader(false)
    }
  };


  return (
    <Animated.View style={[styles.menu, { left: menuSlide }]}>
      <ImageBackground
        source={require('../images/bg-img.png')}
        style={styles.backgroundImage}>
        <View style={styles.contentText}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{ marginBottom: 10 }}>
              <Image
                source={require('../images/app_ic.png')}
                style={[styles.logoimage, { height: 75, width: 75 }]}
              />
            </View>
            <View>
              <TouchableOpacity
                style={styles.Btn}
                onPress={() => navigation.navigate('EditProfileScreen')}>
                <Text style={styles.primaryBtn}>Edit Profile</Text>
                <View style={styles.bottomBorder} />
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              fontSize: 15,
              color: '#ffffff',
              fontWeight: '500',
              paddingTop: 20,
            }}>
            User ID: {mobile}
          </Text>


          <TouchableOpacity onPress={() => setModalVisible(true)} disabled={(playerData.isSuccess && playerData?.data?.kyc) ? true : false} style={{ backgroundColor: (playerData.isSuccess && playerData?.data?.kyc) ? 'green' : 'red', marginTop: 10, borderRadius: 10 }}>
            <Text
              style={{
                fontSize: 15,
                color: '#fff',
                fontWeight: '500',
                paddingVertical: 5,
                paddingHorizontal: 10

              }}>
              {playerData.isSuccess && (playerData?.data?.kyc ? "Verified!" : "Incomplete KYC!")}
            </Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>

      <ScrollView>
        <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}
          onPress={() => {
            navigation.navigate('AppDetailsScreen');
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <AntDesign name="mobile1" size={22} color={'#ffffff'} />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              App Details
            </Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}
          onPress={() => {
            navigation.navigate('FriendListScreen');
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <AntDesign name="user" size={22} color="#ffffff" />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              Add Friend
            </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}
          onPress={() => {
            navigation.navigate('PlayHistoryScreen');
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <MaterialCommunityIcons
                name="gamepad-circle-right"
                size={22}
                color="#ffffff"
              />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              My Play History
              <View>
                <Text
                  style={{ paddingTop: 6, color: '#ffffff', fontSize: 13 }}>
                  अपनी खेली हुई गेम देखने के लिए यहाँ दबाये।
                </Text>
              </View>
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}
          onPress={() => {
            navigation.navigate('BonusReportScreen');
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <AntDesign name="gift" size={22} color="#ffffff" />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              Bonus Report
              <View>
                <Text
                  style={{ paddingTop: 6, color: '#ffffff', fontSize: 13 }}>
                  अपनी गेम का कमीशन देखने के लिए यहाँ दबाये |
                </Text>
              </View>
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}
          onPress={() => {
            navigation.navigate('ResultHistoryScreen');
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <MaterialIcons name="list-alt" size={22} color="#ffffff" />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              Result History
              <View>
                <Text
                  style={{ paddingTop: 6, color: '#ffffff', fontSize: 13 }}>
                  गेम का रिजल्ट देखने के लिए यहाँ दबाये
                </Text>
              </View>
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}
          onPress={() => {
            navigation.navigate('TermsConditionScreen');
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <Octicons name="checklist" size={22} color="#ffffff" />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              Terms And Condition
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisibleRefer(true)}
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',

            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <MaterialIcons name="list-alt" size={22} color="#ffffff" />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              Refer and Earn
              <View>
                <Text
                  style={{ paddingTop: 6, color: '#ffffff', fontSize: 13 }}>
                  रेफर करें और स्पिन कमाएं। &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </View>
            </Text>
          </View>

        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}
          onPress={() => setModalVisibleSpin(true)}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <MaterialIcons name="list-alt" size={22} color="#ffffff" />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              Spin and Win
              <View>
                <Text
                  style={{ paddingTop: 6, color: '#ffffff', fontSize: 13 }}>
                  स्पिन करें इनाम जीते। &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </View>
            </Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}
          onPress={() => {
            navigation.navigate('HelpScreen');
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <Ionicons name="help" size={22} color="#ffffff" />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              Help
            </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: '#4CB050', marginBottom: 15 },
          ]}
          onPress={() => handleLogout()}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#ffffff',
                fontWeight: '500',
                width: '8%',
                marginRight: 10,
              }}>
              <MaterialIcons name="logout" size={22} color="#ffffff" />
            </Text>
            <Text style={{ fontSize: 16, color: '#ffffff', width: '90%' }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '32%',
              marginVertical: 8,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => whatsappBtn(gameSetting.data.contact_links.whatsapp_link)}
            >
              <Image
                source={require('../images/whatsapp.png')}
                style={styles.iconLogo}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '32%',
              marginVertical: 8,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => instaBtn(gameSetting.data.contact_links.instagram)}>
              <Image
                source={require('../images/instagram.png')}
                style={styles.iconLogo}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '32%',
              marginVertical: 8,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => facebookBtn(gameSetting.data.contact_links.facebook)}>
              <Image
                source={require('../images/facebook.png')}
                style={styles.iconLogo}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginBottom: 20, marginTop: 20 }}>
          <TouchableOpacity>
            <Text
              style={{
                color: '#4CB050',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              www.babajimatka.com
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              minHeight: 500,
              maxHeight: 570,
              width: '100%',
              borderTopEndRadius: 15,
              borderTopLeftRadius: 15,
              position: 'relative',
            }}>
            {/* ---------------CLOSE BUTTON--------------- */}
            <View
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: -45,
              }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closebutton}>
                <Text style={styles.textIcon}>
                  <AntDesign
                    name="close"
                    size={24}
                    color={'#707070'}
                  />
                </Text>
              </TouchableOpacity>
            </View>

            {/* ---------------TABS--------------- */}
            <View style={styles.tabContainer}>
              <View
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={[
                    styles.tabContainerItem,
                    navTabsHomeName === 'PersonalInfo' &&
                    styles.activetabContainerItem,
                  ]}
                  onPress={() =>
                    navTabsHomeFunc('PersonalInfo')
                  }>
                  <Text
                    style={[
                      styles.tabContainerText,
                      navTabsHomeName === 'PersonalInfo' &&
                      styles.activeTabContainerText,
                    ]}>
                    Personal Info
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabContainerItem,
                    navTabsHomeName === 'IdProof' &&
                    styles.activetabContainerItem,
                  ]}
                  onPress={() => navTabsHomeFunc('IdProof')}>
                  <Text
                    style={[
                      styles.tabContainerText,
                      navTabsHomeName === 'IdProof' &&
                      styles.activeTabContainerText,
                    ]}>
                    Id Proof
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabContainerItem,
                    navTabsHomeName === 'BankDetails' &&
                    styles.activetabContainerItem,
                  ]}
                  onPress={() =>
                    navTabsHomeFunc('BankDetails')
                  }>
                  <Text
                    style={[
                      styles.tabContainerText,
                      navTabsHomeName === 'BankDetails' &&
                      styles.activeTabContainerText,
                    ]}>
                    Bank Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ---------------INFO FORM--------------- */}
            <ScrollView>
              <View style={styles.tabContentContainer}>
                {navTabsHomeName === 'PersonalInfo' && (
                  <View>
                    <Text
                      style={{
                        color: '#000000',
                        marginBottom: 10,
                        fontWeight: '500',
                      }}>
                      Upload Profile Image
                    </Text>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                      }}>
                      <View style={{ width: 100, height: 100 }}>
                        <TouchableOpacity
                          onPress={() => pickDocument(setProfileImage, "0")}
                          style={{ ...styles.imguploadBtn, borderRadius: 100, height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <View style={styles.uploadProfile}>
                            {playerData && playerData.data && playerData.data.image ? (
                              <View style={{ position: 'relative' }}>
                                <Image
                                  source={{ uri: imageDataProfile.uri ? imageDataProfile.uri : 'https://api.thebgmgame.com/' + playerData.data.image }}
                                  style={{ width: 100, height: 100, borderRadius: 999 }}
                                />
                                {/* Render additional content on top of the image */}
                              </View>
                            ) : (
                              <>
                                <Image
                                  source={require('../images/profile.png')}
                                  style={styles.profileimg}
                                />
                                <View style={styles.icon}>
                                  <Ionicons name="camera" size={24} color="#ffffff" />
                                </View>
                              </>
                            )}

                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{ marginBottom: 15 }}>
                      <Text
                        style={{
                          color: '#000000',
                          marginBottom: 10,
                          fontWeight: '500',
                        }}>
                        Name
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#ECECEC',
                          paddingHorizontal: 15,
                        }}>
                        <TextInput
                          onChangeText={setName}
                          value={name}
                          placeholder="Enter Name"
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        marginBottom: 15,
                        position: 'relative',
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          marginBottom: 10,
                          fontWeight: '500',
                        }}>
                        Mobile
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#ECECEC',
                          paddingHorizontal: 15,
                        }}>
                        <TextInput
                          value={`+91 ${mobile}`}
                          keyboardType="numeric"
                        />
                      </View>

                    </View>

                    <View
                      style={{
                        marginBottom: 15,
                        position: 'relative',
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          marginBottom: 10,
                          fontWeight: '500',
                        }}>
                        Email
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#ECECEC',
                          paddingHorizontal: 15,
                        }}>
                        <TextInput
                          onChangeText={setEmail}
                          value={email}
                          placeholder="Enter Email"
                        />
                      </View>
                    </View>

                    {/* <TouchableOpacity
                                      style={styles.Btn}
                                      onPress={() => setModalVisible(true)}>
                                      <Text style={styles.primaryBtn}>
                                        Next
                                      </Text>
                                      <View style={styles.bottomBorder} />
                                    </TouchableOpacity> */}
                  </View>
                )}

                {navTabsHomeName === 'IdProof' && (
                  <View>
                    <View style={{ marginBottom: 15 }}>
                      <Text
                        style={{
                          color: '#000000',
                          marginBottom: 10,
                          fontWeight: '500',
                        }}>
                        Document Type
                      </Text>

                      {/* ---------------Buttons to toggle between Aadhar Card and Pan Card--------------- */}
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 20,
                        }}>
                        <TouchableOpacity
                          style={[
                            styles.Btn,
                            activeCard === 'aadhar' &&
                            styles.activeBtn,
                          ]}
                          onPress={() =>
                            setActiveCard('aadhar')
                          }>
                          <Text
                            style={[
                              styles.cartabsBtn,
                              activeCard === 'aadhar' &&
                              styles.activeText,
                            ]}>
                            Aadhar Card
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.Btn,
                            activeCard === 'pan' &&
                            styles.activeBtn,
                          ]}
                          onPress={() => setActiveCard('pan')}>
                          <Text
                            style={[
                              styles.cartabsBtn,
                              activeCard === 'pan' &&
                              styles.activeText,
                            ]}>
                            Pan Card
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* ---------------Render Aadhar Card section if activeCard is 'aadhar'--------------- */}

                      {activeCard === 'aadhar' && (
                        <View style={styles.aadharCard}>
                          <View
                            style={{
                              marginBottom: 15,
                              position: 'relative',
                            }}>
                            <Text
                              style={{
                                color: '#000000',
                                marginBottom: 10,
                                fontWeight: '500',
                              }}>
                              Aadhaar Number
                            </Text>
                            <View
                              style={{
                                backgroundColor: '#ECECEC',
                                paddingHorizontal: 15,
                              }}>
                              <TextInput
                                onChangeText={setAadhar}
                                value={aadhar}
                                placeholder="XXXX - XXXX - XXXX"
                                keyboardType="numeric"
                              />
                            </View>


                            <TouchableOpacity
                              style={{
                                position: 'absolute',
                                right: 20,
                                bottom: 15,
                              }}
                              // disabled={verifyAadhaar.isSuccess}
                              onPress={() => {
                                if (
                                  !(
                                    // verifyAadhaar.isError ||
                                    (verifyAadhaar.isSuccess || verifyAadhaar.isPending)
                                  )
                                ) {
                                  verifyAadhaar.mutate({
                                    mobile,
                                    aadhar,
                                  });
                                }
                              }}>
                              <Text
                                style={{
                                  color: '#4CB050',
                                  textAlign: 'center',
                                  fontWeight: '500',
                                }}>
                                {verifyAadhaar.isSuccess
                                  ? "Verified"
                                  : verifyAadhaar.isError
                                    ? "Failed! Retry"
                                    : verifyAadhaar.isPending
                                      ? "Verifying.."
                                      : "Verify"}
                              </Text>
                            </TouchableOpacity>

                          </View>

                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            Upload Id Proof
                          </Text>

                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 20,
                            }}>
                            <View style={{ width: '48%' }}>
                              <TouchableOpacity
                                onPress={() => pickDocument(setAadharFront, "1")}
                                style={styles.imguploadBtn}>
                                {imageData.uri ? <Image source={{ uri: imageData.uri, }} style={{ height: 100, width: "100%", objectFit: 'contain' }} /> :
                                  <>
                                    <Ionicons
                                      name="camera"
                                      size={36}
                                      color="#707070"
                                      style={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent:
                                          'space-between',
                                        paddingBottom: 5,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        color: '#000000',
                                        textAlign: 'center',
                                        fontWeight: '500',
                                      }}>
                                      Front
                                    </Text>
                                  </>}
                              </TouchableOpacity>
                            </View>
                            <View style={{ width: '48%' }}>
                              <TouchableOpacity
                                onPress={() => pickDocument(setAadharBack, "2")}
                                style={styles.imguploadBtn}>
                                {imageDataBack.uri ? <Image source={{ uri: imageDataBack.uri, }} style={{ height: 100, width: "100%", objectFit: 'contain' }} /> :
                                  <>
                                    <Ionicons
                                      name="camera"
                                      size={36}
                                      color="#707070"
                                      style={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent:
                                          'space-between',
                                        paddingBottom: 5,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        color: '#000000',
                                        textAlign: 'center',
                                        fontWeight: '500',
                                      }}>
                                      Front
                                    </Text>
                                  </>}
                              </TouchableOpacity>
                            </View>
                          </View>

                          <View>
                            <TouchableOpacity
                              style={styles.Btn}
                              onPress={() =>
                                setModalVisible4(true)
                              }>
                              <Text style={styles.secondaryBtn}>
                                Upload
                              </Text>
                              <View
                                style={styles.bottomBorder}
                              />
                            </TouchableOpacity>
                          </View>
                          {/* 
                                          <View style={{ marginTop: 50 }}>
                                            <TouchableOpacity
                                              style={styles.Btn}>
                                              <Text style={styles.primaryBtn}>
                                                Next
                                              </Text>
                                              <View
                                                style={styles.bottomBorder}
                                              />
                                            </TouchableOpacity>
                                          </View> */}
                        </View>
                      )}
                      {activeCard === 'pan' && (
                        <View style={styles.panCard}>
                          <View
                            style={{
                              marginBottom: 15,
                              position: 'relative',
                            }}>
                            <Text
                              style={{
                                color: '#000000',
                                marginBottom: 10,
                                fontWeight: '500',
                              }}>
                              PAN Number
                            </Text>
                            <View
                              style={{
                                backgroundColor: '#ECECEC',
                                paddingHorizontal: 15,
                              }}>
                              <TextInput
                                onChangeText={setPan}
                                value={pan}
                                placeholder="XXXXXXXXXX"
                                //keyboardType="numeric"
                                autoCapitalize="characters"
                              />
                            </View>


                            <TouchableOpacity
                              style={{
                                position: 'absolute',
                                right: 20,
                                bottom: 15,
                              }}
                              onPress={() => {
                                if (
                                  !(
                                    // verifyPan.isError ||
                                    (verifyPan.isSuccess || verifyPan.isPending)
                                  )
                                ) {
                                  verifyPan.mutate({
                                    mobile,
                                    pan,
                                  });
                                }
                              }}>
                              <Text
                                style={{
                                  color: '#4CB050',
                                  textAlign: 'center',
                                  fontWeight: '500',
                                }}>
                                {verifyPan.isSuccess
                                  ? "Verified"
                                  : verifyPan.isError
                                    ? "Failed! Retry"
                                    : verifyPan.isPending
                                      ? "Verifying.."
                                      : "Verify"}
                              </Text>
                            </TouchableOpacity>

                          </View>

                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            Upload Id Proof
                          </Text>

                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 20,
                            }}>
                            <View style={{ width: '48%' }}>
                              <TouchableOpacity
                                onPress={() => pickDocument(setPanImage, "3")}
                                style={styles.imguploadBtn}>
                                {imageDataPan.uri ? <Image source={{ uri: imageDataPan.uri, height: 60, width: "100%" }} /> :
                                  <>
                                    <Ionicons
                                      name="camera"
                                      size={36}
                                      color="#707070"
                                      style={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent:
                                          'space-between',
                                        paddingBottom: 5,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        color: '#000000',
                                        textAlign: 'center',
                                        fontWeight: '500',
                                      }}>
                                      Front
                                    </Text>
                                  </>}
                              </TouchableOpacity>
                            </View>
                          </View>

                          <View>
                            <TouchableOpacity
                              style={styles.Btn}
                              onPress={() =>
                                setModalVisible4(true)
                              }>
                              <Text style={styles.secondaryBtn}>
                                Upload
                              </Text>
                              <View
                                style={styles.bottomBorder}
                              />
                            </TouchableOpacity>
                          </View>
                          {/* 
                                          <View style={{ marginTop: 50 }}>
                                            <TouchableOpacity
                                              style={styles.Btn}>
                                              <Text style={styles.primaryBtn}>
                                                Next
                                              </Text>
                                              <View
                                                style={styles.bottomBorder}
                                              />
                                            </TouchableOpacity>
                                          </View> */}
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {navTabsHomeName === 'BankDetails' && (
                  <View>
                    <View style={{ marginBottom: 15 }}>
                      <View style={styles.savingAccCard}>

                        <View style={{ marginBottom: 15 }}>
                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            Select Your Bank
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              onChangeText={setBank}
                              value={bank}
                              placeholder="Select Bank "
                            />
                          </View>
                        </View>

                        <View style={{ marginBottom: 15 }}>
                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            Account Number
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              onChangeText={setAccountNo}
                              value={accountNo}
                              placeholder="Enter Account Number"
                              keyboardType="numeric"
                            />
                          </View>
                        </View>

                        <View style={{ marginBottom: 15 }}>
                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            Account Holder Name
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              value={verifyPan?.data?.name || ""}
                              placeholder="Enter Name"
                            />
                          </View>
                        </View>

                        <View style={{ marginBottom: 15 }}>
                          <Text
                            style={{
                              color: '#000000',
                              marginBottom: 10,
                              fontWeight: '500',
                            }}>
                            IFSC
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              onChangeText={setIfsc}
                              value={ifsc}
                              placeholder="Enter Ifsc"
                              autoCapitalize="characters"
                            />
                          </View>
                        </View>

                        <TouchableOpacity style={styles.Btn} onPress={() => onKycSubmit()}>
                          <Text style={styles.primaryBtn}>
                            Submit
                          </Text>
                          <View style={styles.bottomBorder} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>


      <Loader visiblity={loader} />

    </Animated.View>
  )
}

const styles = StyleSheet.create({
  ...appStyles,
});
export default Navbar



