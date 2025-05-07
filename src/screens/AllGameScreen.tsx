import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  Modal,
  Linking,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import NavFooter from '../components/NavFooter';
import TextTicker from 'react-native-text-ticker';
import appStyles from '../styles/appStyles';
import useMarkets from '../hooks/useMarkets';
import { isTimeNotPassed } from '../utils/time';
import useHome, { usePlayerData } from '../hooks/useHome';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useVerifyAadhaar, useVerifyPan } from '../hooks/useAddKYC';
import apiClient, { BaseURLCLUB } from '../constants/api-client';
import { showAlert } from '../components/Alert';
import { fetchMobile } from '../hooks/useWallet';
import Loader from '../components/Loader';
import DocumentPicker from 'react-native-document-picker';


const AllGameScreen = ({ navigation }: any) => {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [modalVisibleWhatsApp, setModalVisibleWhatsApp] = useState(false);
  const [modalVisibleReferAndEarn, setModalReferAndEarn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [navTabsHomeName, setNavTabsHomeName] = useState('PersonalInfo');
  const [mobile, setMobile] = useState("");
  const verifyAadhaar = useVerifyAadhaar();
  const verifyPan = useVerifyPan();
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
  const [activeCard, setActiveCard] = useState('aadhar');
  const [aadharFront, setAadharFront] = useState('');
  const [aadharBack, setAadharBack] = useState('');
  const [modalVisible4, setModalVisible4] = useState(false);
  const [panImage, setPanImage] = useState('');
  const playerData = usePlayerData();




  const { markets } = useMarkets()
  const { home } = useHome();



  const navTabsHomeFunc = tabName => {
    setNavTabsHomeName(tabName);
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


  const onPlayClick = (market) => {
    setLoader(true)


    if (!mobile) {
      fetchMobile(setMobile).then(mobile => playerData.mutate({ mobile }));
    }

    fetchMobile(setMobile).then(async mobile =>

      apiClient.post(`player-profile/`, { mobile }).then((res) => {
        console.log("player data :- ", res.data)

        if (res.data.kyc == true) {
          navigation.navigate("MoringStarScreen", { market })
        }
        else {
          setModalVisible(true)
        }
        setLoader(false)



      })

    );


  }



  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

        <Header page={"Games"} setMenuVisibility={setMenuVisibility} isMenuVisible={isMenuVisible} />

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Navbar navigation={navigation} isMenuVisible={isMenuVisible} modalVisibleWhatsApp={modalVisibleWhatsApp} setModalVisibleWhatsApp={setModalVisibleWhatsApp} />

          <ScrollView style={styles.scrollView}>
            <View>
              <View style={{ backgroundColor: '#000000', padding: 20 }}>

                <TextTicker
                  style={{
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                  duration={8000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={2500}>
                  {home?.ticker}
                </TextTicker>

              </View>

              <View style={{ marginTop: 20 }}>

                <View style={{ backgroundColor: '#ECECEC', padding: 20 }}>
                  <Text
                    style={{
                      color: '#000000',
                      textAlign: 'center',
                      fontWeight: '500',
                    }}>
                    All Game
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#000000',
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'left',
                      fontWeight: '500',
                    }}>
                    Market Name
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'right',
                      fontWeight: '500',
                    }}>
                    Action
                  </Text>
                </View>

                <ScrollView>

                  {markets?.map(market => (
                    market.status && <View
                      key={market.id}
                      style={{
                        backgroundColor: '#E1EFE6',
                        padding: isTimeNotPassed(market.close_time) && !isTimeNotPassed(market.open_time) ? 20 : 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        marginBottom: isTimeNotPassed(market.close_time) && !isTimeNotPassed(market.open_time) ? 10 : 0,
                      }}>
                      {isTimeNotPassed(market.close_time) && !isTimeNotPassed(market.open_time) ?
                        (
                          <>
                            <View>
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: '#000000',
                                  textAlign: 'left',
                                  fontWeight: '500',
                                }}>
                                {market.market}
                              </Text>
                            </View>
                            <View>
                              <TouchableOpacity
                                style={styles.Btn}
                                onPress={() => onPlayClick(market)}>
                                <Text style={styles.primaryBtn}>Play Games</Text>
                                <View style={styles.bottomBorder} />
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : (
                          <>
                            {/* <View>
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: '#000000',
                                  textAlign: 'left',
                                  fontWeight: '500',
                                }}>
                                {market.market}
                              </Text>
                            </View>
                            <View>
                              <TouchableOpacity style={styles.Btn}>
                                <Text style={styles.secondaryBtn}>Time Out</Text>
                                <View style={styles.bottomBorder} />
                              </TouchableOpacity>
                            </View> */}
                          </>
                        )}

                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>

        <NavFooter />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleWhatsApp}
          onRequestClose={() => setModalVisibleWhatsApp(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                height: 350,
                width: '100%',
                borderTopEndRadius: 15,
                borderTopLeftRadius: 15,
              }}>
              <ScrollView>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    paddingBottom: 20,
                    padding: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '32%',
                      marginVertical: 8,
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity>
                      <View style={styles.circleBtn}>
                        <Image
                          source={require('../images/whatsapp.png')}
                          style={styles.iconimage}
                        />
                      </View>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          paddingTop: 5,
                        }}>
                        Whatsapp
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '32%',
                      marginVertical: 8,
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity>
                      <View style={styles.circleBtn}>
                        <Image
                          source={require('../images/instagram.png')}
                          style={styles.iconimage}
                        />
                      </View>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          paddingTop: 5,
                        }}>
                        Instagram
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '32%',
                      marginVertical: 8,
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity>
                      <View style={styles.circleBtn}>
                        <Image
                          source={require('../images/facebook.png')}
                          style={styles.iconimage}
                        />
                      </View>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          paddingTop: 5,
                        }}>
                        Facebook
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      width: '32%',
                      marginVertical: 8,
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity>
                      <View style={styles.circleBtn}>
                        <Image
                          source={require('../images/chrome.png')}
                          style={styles.iconimage}
                        />
                      </View>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          paddingTop: 5,
                        }}>
                        Chrome
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '32%',
                      marginVertical: 8,
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity>
                      <View style={styles.circleBtn}>
                        <Image
                          source={require('../images/opera.png')}
                          style={styles.iconimage}
                        />
                      </View>
                      <Text
                        style={{
                          color: '#000000',
                          textAlign: 'center',
                          fontWeight: '500',
                          paddingTop: 5,
                        }}>
                        Opera
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: '#cccccc',
                  padding: 15,
                }}>
                <TouchableOpacity
                  onPress={() => setModalVisibleWhatsApp(false)}
                  style={styles.button}>
                  <Text style={styles.text}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>





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


        {isMenuVisible && (
          <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 0 },
              ]}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default AllGameScreen;
