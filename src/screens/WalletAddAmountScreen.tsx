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
  TextInput,
  Modal,
  Button,
  ImageBackground,
  Linking,
  AppState,
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
import { RadioButton } from 'react-native-paper';
import TextTicker from 'react-native-text-ticker';
import appStyles from '../styles/appStyles';
import useHome, { usePlayerData } from '../hooks/useHome';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import useTransactionHistory from '../hooks/useDepositHistory';
import DocumentPicker from 'react-native-document-picker';
import useAddKYC, { useVerifyAadhaar, useVerifyPan } from "../hooks/useAddKYC";
import useWallet, { fetchMobile } from '../hooks/useWallet';
import useWithdrawPoints from '../hooks/useWithdrawPoints';
import useAddPoints, {
  useFrontSettings,
  useMidSetting,
  useMidSettingManualAccount,
} from "../hooks/useAddPoints";
import { showAlert } from '../components/Alert';
import Loader from '../components/Loader';
import apiClient, { BaseURLCLUB } from '../constants/api-client';
import Toast from 'react-native-simple-toast';
import COLORS from '../components/COLORS';


const WalletAddAmountScreen = ({ navigation }: any) => {
  // =========> States
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [mobile, setMobile] = useState("");
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [modalVisibleWhatsApp, setModalVisibleWhatsApp] = useState(false);
  const [makeTransaction, setMakeTransaction] = useState(false);
  const [imageData, setImageData] = useState({})
  const [imageDataBack, setimageDataBack] = useState({})
  const [imageDataPan, setimagePan] = useState({})
  const [imageDataProfile, setimageProfile] = useState({})
  const [loader, setLoader] = useState(false)


  const [addPaymnetModel, setAddPaymnetModel] = useState(false)
  const [addPaymnetManualAccount, setAddPaymnetManualAccount] = useState(false)
  const [manualAccountText, setManualAccountText] = useState({ accountNumber: "", accountName: "", ifsc: "", admin: '', type: "" });
  const [manualTrancId, setManualTrancId] = useState('');




  // =========> Select file from memory and set in state  
  // const pickDocument = async (setter) => {
  //   try {
  //     const result = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     setter(result[0].uri)
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker
  //     } else {
  //       throw err;
  //     }
  //   }
  // };


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

  // =========> Make API Requests using custom hooks
  const { home } = useHome();
  const playerData = usePlayerData();
  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useTransactionHistory();

  const addPoints = useAddPoints();
  const withdrawPoints = useWithdrawPoints();
  const { refetchWallet } = useWallet();

  const submitKyc = useAddKYC();

  const verifyAadhaar = useVerifyAadhaar();
  const verifyPan = useVerifyPan();

  const { forntSettings } = useFrontSettings();
  const { midSettings } = useMidSetting();
  const { midSettingsManualAccount } = useMidSettingManualAccount()



  // =========> Fetch player info
  useEffect(() => {
    if (!mobile) {
      fetchMobile(setMobile).then(mobile => playerData.mutate({ mobile }));
    }
  }, [mobile]);


  // =========> Observe if user switched/closed app
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (makeTransaction) {
        if (
          (appState.current.match(/inactive|background/) &&
            nextAppState === 'active')
        ) {
          try {
            console.log("UPI TRANSACTION DONE");
            await addPoints.mutateAsync({
              admin: selectedMerchant.admin,
              merchant_transaction_id: selectedMerchant.merchant_id,
              amount: parseInt(addPointsAmount),
              transaction_id: tid,
            });
            console.log("API TRANSACTION FAILED");
            setMakeTransaction(false)
            setAddPointsAmount("");
            refetch();
            subscription.remove()
          } catch (error) {
            console.log(error);
          }
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [makeTransaction]);




  // =========> Transactions Handling 

  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [tid, setTid] = useState(0);

  const [addPointsAmount, setAddPointsAmount] = useState('');
  const [withdrawlPointsAmount, setWithdrawlPointsAmount] = useState('');

  const handleDepositUpi = async () => {
    console.log("depositing: ", addPointsAmount)

    // UPI URL creation

    try {

      const minAmount = forntSettings?.min_deposit;
      const maxAmount = forntSettings?.max_deposit;

      const amountToAdd = parseInt(addPointsAmount);

      if (amountToAdd < minAmount) {
        showAlert("Amount too low!");
        return;
      } else if (amountToAdd > maxAmount) {
        showAlert("Amount too High!");
        return;
      }

      const merchant_ids = midSettings?.filter(
        (mid) =>
          amountToAdd >= mid.min_deposit && amountToAdd <= mid.max_deposit
      );

      const random = Math.floor(Math.random() * merchant_ids?.length);

      setTid(Date.now());
      setSelectedMerchant(merchant_ids[random])


      setMakeTransaction(true)

      const upiUrl = `${"upi://"}pay/?ver=${`01`}&mode=${`15`}&am=${addPointsAmount}&mam=${addPointsAmount}&cu=INR&pa=${selectedMerchant?.merchant_id}&pn=${selectedMerchant?.company}&mc=${`5816`}&tr=${Date.now()}&tn=${Date.now()}&tid=${tid}`;

      Linking.openURL(upiUrl).catch((err) => console.error("Couldn't load page", err))

      // Consider where to put refetchWallet based on your application logic
    } catch (error) {
      console.error("Error adding points:", error);
    }

  };



  const handleNewOpen = () => {
    if (addPointsAmount) {
      const amount = parseFloat(addPointsAmount); // Assuming inputText is a string and needs to be converted to a number
      let matchFound = false;
      let amountInRange = false;

      for (let index = 0; index < forntSettings.length; index++) {
        const item = forntSettings[index];

        if (item.status == true) {
          if (amount >= item.min_deposit && amount <= item.max_deposit) {
            amountInRange = true;
            if (item.gateway == 'ManualUpi') {
              const matchingAccount = midSettings.find(midItem =>
                midItem.type == 'ManualUpi' &&
                midItem.status == true &&
                amount >= midItem.min_deposit &&
                amount <= midItem.max_deposit
              );

              if (matchingAccount) {
                handleDepositUpi();
                matchFound = true;
                break; // Exit the loop if a match is found
              }
            } else if (item.gateway == 'ManualAccount') {
              const matchingAccount = midSettingsManualAccount.find(midItem =>
                midItem.type == 'ManualAccount' &&
                midItem.status == true &&
                amount >= midItem.min_deposit &&
                amount <= midItem.max_deposit
              );

              if (matchingAccount) {
                setManualAccountText({
                  accountName: matchingAccount.account_holder_name,
                  accountNumber: matchingAccount.account_number,
                  ifsc: matchingAccount.ifsc,
                  admin: matchingAccount.admin,
                  type: matchingAccount.type
                }); addPaymnetManualAccount
                setAddPaymnetManualAccount(true);
                matchFound = true;
                break; // Exit the loop if a match is found
              }
            }
          }
        }
      }

      if (!amountInRange) {
        Toast.show('Amount is out of the allowed range', Toast.LONG);
      } else if (!matchFound) {
        Toast.show("Please try after some time", Toast.LONG);
      }
    } else {
      Toast.show('Please enter point', Toast.LONG);
    }
  };


  const findMatchingAccount = (accounts, amount) => {

    const minDeposit = Math.min(...accounts.map(account => account.min_deposit));
    const maxDeposit = Math.max(...accounts.map(account => account.max_deposit));

    if (amount < minDeposit) {
      Toast.show('The amount is lower than the minimum deposit', Toast.LONG);
      return null
    }
    else if (amount > maxDeposit) {
      Toast.show('The amount is higher than the maximum deposit', Toast.LONG);
      return null
    }
    else {
      return accounts.find(account => amount >= account.min_deposit && amount <= account.max_deposit) || null;
    }
  };


  const onSubmitManualAccount = () => {
    const matchingAccount = findMatchingAccount(midSettingsManualAccount, addPointsAmount);

    console.log(matchingAccount)
    if (matchingAccount) {
      setManualAccountText({
        accountName: matchingAccount.account_holder_name,
        accountNumber: matchingAccount.account_number,
        ifsc: matchingAccount.ifsc,
        admin: matchingAccount.admin,
        type: matchingAccount.type
      });
    }
    else {
      setManualAccountText({
        accountName: '',
        accountNumber: '',
        ifsc: '',
        admin: null,
        type: ''
      });
    }

    setAddPaymnetManualAccount(true)
  }

  const onDoneManualAccount = async () => {
    setAddPaymnetManualAccount(false)
    if (manualTrancId) {
      await addPoints.mutateAsync({
        amount: addPointsAmount,
        admin: manualAccountText.admin,
        transaction_id: manualTrancId,
        account_number: manualAccountText.accountNumber,
        account_holder_name: manualAccountText.accountName,
        ifsc: manualAccountText.ifsc,
        gateway: manualAccountText.type,

      }).catch((error) => {
        console.log(error)
      });
    }
    else {
      Toast.show('Please enter UTR ID', Toast.LONG);
    }
  }




  const handleWithdrawal = async () => {



    if (withdrawlPointsAmount) {
      try {
        console.log("withdrawing: ", playerData?.data?.kyc)


        setLoader(true)


        if (!mobile) {
          fetchMobile(setMobile).then(mobile => playerData.mutate({ mobile }));
        }

        fetchMobile(setMobile).then(async mobile =>

          apiClient.post(`player-profile/`, { mobile }).then((res) => {
            console.log("player data :- ", res.data)

            if (res.data.kyc == true) {
              try {
                withdrawPoints.mutateAsync(parseInt(withdrawlPointsAmount));
                refetchWallet();
                setWithdrawlPointsAmount("");
                refetch();
                Toast.show('Withdrawal Successful', Toast.LONG);
              } catch (error) {
                // console.error("Error withdrawing points:", error.response?.data?.error);
              }
            }
            else {
              setModalVisible(true)
            }
            setLoader(false)



          })

        );

      } catch (error) {
        // console.error("Error withdrawing points:", error.response?.data?.error);
      }
    }
    else {
      Toast.show('Please enter withdrawal point.', Toast.LONG);

    }




  };



  const handleAddPoint = async () => {

    if (addPointsAmount) {
      try {


        setLoader(true)




        fetchMobile(setMobile).then(async mobile =>

          apiClient.post(`player-profile/`, { mobile }).then((res) => {
            console.log("player data 11111:- ", res.data)

            if (res.data.kyc == true) {


              handleNewOpen()
              console.log("dfhdfhdfhfdh")


            }
            else {
              setModalVisible(true)
              console.log("asfjsakjfaskjfkas")

            }
            setLoader(false)



          })

        );

      } catch (error) {
        // console.error("Error withdrawing points:", error.response?.data?.error);
      }
    }
    else {
      Toast.show('Please enter point', Toast.LONG);

    }



  }


  // =========> KYC Input Form States & Submission Handling 

  const [aadharFront, setAadharFront] = useState('');
  const [aadharBack, setAadharBack] = useState('');
  const [panImage, setPanImage] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');

  const [bank, setBank] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [openKyc, setOpenKyc] = useState(true);

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





  //-------- Tabs-------//
  const [navTabHome, setNavTab] = useState(false);
  const [navTabHomeName, setNavTabName] = useState('Tab1');
  const navTabHomeFunc = async (tabName: any) => {
    setNavTab(true);
    setNavTabName(tabName);
  };
  //-------- End-------//

  //-------- Modal -------//
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  //-------- End -------//

  //-------- Tabs -------//
  const [navTabsHomeName, setNavTabsHomeName] = useState('PersonalInfo');

  const navTabsHomeFunc = tabName => {
    setNavTabsHomeName(tabName);
  };

  //-------- End -------//

  //-------- Tabs -------//
  const [activeCard, setActiveCard] = useState('aadhar');
  //-------- End -------//



  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibility(false)}>
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Header page={"Wallet"} setMenuVisibility={setMenuVisibility} isMenuVisible={isMenuVisible} />

        <View style={{
          flex: 1,
          flexDirection: 'row',
        }}>

          <Navbar navigation={navigation} isMenuVisible={isMenuVisible} modalVisibleWhatsApp={modalVisibleWhatsApp} setModalVisibleWhatsApp={setModalVisibleWhatsApp} />

          <ScrollView style={styles.scrollView}>
            <View>

              {/* ---------------TICKER--------------- */}
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

              {/* ---------------PAGE--------------- */}
              <View style={{ marginTop: 20 }}>

                {/* ---------------HEADER--------------- */}
                <View style={styles.customTab}>
                  <TouchableOpacity
                    style={[
                      styles.tabItem,
                      navTabHomeName === 'Tab1' && styles.activeTabItem,
                    ]}
                    onPress={() => navTabHomeFunc('Tab1')}>
                    <Text
                      style={[
                        styles.tabText,
                        navTabHomeName === 'Tab1' && styles.activeTabText,
                      ]}>
                      Add Point
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabItem,
                      navTabHomeName === 'Tab2' && styles.activeTabItem,
                    ]}
                    onPress={() => navTabHomeFunc('Tab2')}>
                    <Text
                      style={[
                        styles.tabText,
                        navTabHomeName === 'Tab2' && styles.activeTabText,
                      ]}>
                      Withdrawal
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.customTabContant}>
                  {/* ---------------ADD POINTS--------------- */}
                  <View
                    style={{
                      display: navTabHomeName == 'Tab1' ? 'flex' : 'none',
                    }}>

                    {/* ADDING POINTS */}
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingTop: 10,
                        paddingBottom: 20,
                      }}>
                      <View style={{ marginBottom: 15 }}>
                        <Text
                          style={{
                            color: '#000000',
                            marginBottom: 10,
                            fontWeight: '500',
                          }}>
                          Add Point
                        </Text>
                        <View
                          style={{
                            backgroundColor: '#ECECEC',
                            paddingHorizontal: 15,
                          }}>
                          <TextInput
                            onChangeText={setAddPointsAmount}
                            value={addPointsAmount}
                            placeholder="Enter Point"
                            keyboardType="numeric"
                          />
                        </View>
                      </View>

                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                        }}>
                        {[500, 1000, 1500, 2000, 2500, 3000].map(
                          (amount, index) => (
                            <View
                              key={index}
                              style={{ width: '32%', marginVertical: 8 }}>
                              <TouchableOpacity
                                style={styles.Btn}
                                onPress={() => {
                                  setAddPointsAmount(`${amount}`);
                                }}>
                                <Text style={styles.tagBtn}>{amount}</Text>
                              </TouchableOpacity>
                            </View>
                          ),
                        )}
                      </View>

                      <View style={{ padding: 20 }}>
                        {/* <Text
                          style={{
                            color: '#000000',
                            fontSize: 14,
                            textAlign: 'center',
                            fontWeight: '500',
                          }}>
                          आपका पैसा 5 से 10 मिनट मैं एड हो जाएगा
                        </Text> */}
                      </View>

                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{ width: '48%' }}>
                          <TouchableOpacity style={styles.Btn} onPress={() => {
                            handleAddPoint()
                          }}>
                            <Text style={styles.primaryBtn}>Add Point</Text>
                            <View style={styles.bottomBorder} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* ADD POINTS HISTORY */}
                    <ScrollView horizontal>

                      <View>


                        <View
                          style={{
                            backgroundColor: '#000000',

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            marginTop: 15,
                          }}>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            S. No.
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Pay Mode
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Request Id
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Date
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Points
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Closing Balance
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Status
                          </Text>
                        </View>

                        {isLoading ? (
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row',
                              borderBottomWidth: 1,
                              borderBottomColor: '#cccccc',
                            }}>
                            <Text
                              style={{
                                color: '#000000',
                                textAlign: 'center',
                                fontWeight: '500',
                                padding: 15,
                              }}>
                              Loading..
                            </Text>
                          </View>
                        ) : error ? (
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row',
                              borderBottomWidth: 1,
                              borderBottomColor: '#cccccc',
                            }}>
                            <Text
                              style={{
                                color: '#000000',
                                textAlign: 'center',
                                fontWeight: '500',
                                padding: 15,
                              }}>
                              No Data Available.
                            </Text>
                          </View>
                        ) : (transactions
                          ?.filter(
                            (transaction) =>
                              transaction.type === "Credit" &&
                              transaction.action !== "Pending"
                          )
                          .map((history, index) => (
                            <View key={history.id}>

                              <View
                                style={{
                                  backgroundColor: 'white',

                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  borderBottomWidth: 1,
                                  borderBottomColor: '#cccccc',
                                }}>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {index + 1}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.purpose}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.transaction_id}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {` ${history.created_at.split(" ")[0]} at ${history.created_at.split(" ").splice(1).join(" ")}`}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.amount}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.closing_balance || 0}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.action}
                                </Text>

                              </View>

                            </View>
                          ))
                        )}


                      </View>

                    </ScrollView>

                  </View>

                  {/* ---------------WITHDRAWL--------------- */}
                  <View
                    style={{
                      display: navTabHomeName == 'Tab2' ? 'flex' : 'none',
                    }}>
                    {/* ---------------WITHDRAWING POINTS--------------- */}
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingTop: 10,
                        paddingBottom: 20,
                      }}>
                      <View style={{ marginBottom: 15 }}>
                        <Text
                          style={{
                            color: '#000000',
                            marginBottom: 10,
                            fontWeight: '500',
                          }}>
                          Withdrawal
                        </Text>
                        <View
                          style={{
                            backgroundColor: '#ECECEC',
                            paddingHorizontal: 15,
                          }}>
                          <TextInput
                            onChangeText={setWithdrawlPointsAmount}
                            value={withdrawlPointsAmount}
                            placeholder="Enter Withdrawal"
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                        }}>
                        {[500, 1000, 1500, 2000, 2500, 3000].map(
                          (amount, index) => (
                            <View
                              key={index}
                              style={{ width: '32%', marginVertical: 8 }}>
                              <TouchableOpacity
                                style={styles.Btn}
                                onPress={() => {
                                  setWithdrawlPointsAmount(`${amount}`);
                                }}>
                                <Text style={styles.tagBtn}>{amount}</Text>
                              </TouchableOpacity>
                            </View>
                          ),
                        )}
                      </View>

                      <View style={{ padding: 20 }}>
                        {/* <Text
                          style={{
                            color: '#000000',
                            fontSize: 14,
                            textAlign: 'center',
                            fontWeight: '500',
                          }}>
                          आपका पैसा 5 से 10 मिनट मैं एड हो जाएगा
                        </Text> */}
                      </View>

                      <View
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={{ width: '48%' }}>
                          <TouchableOpacity
                            style={styles.Btn}
                            onPress={() => handleWithdrawal()}>


                            <Text style={styles.primaryBtn}>Withdrawal</Text>
                            <View style={styles.bottomBorder} />
                          </TouchableOpacity>
                        </View>

                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            paddingTop: 20,
                          }}>
                          Request History
                        </Text>
                      </View>

                      {/* ---------------KYC MODAL--------------- */}


                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible4}
                        onRequestClose={() => setModalVisible4(false)}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          }}>
                          <View
                            style={{
                              backgroundColor: 'white',
                              minHeight: 200,
                              width: '92%',
                              borderTopEndRadius: 15,
                              borderTopLeftRadius: 15,
                              position: 'relative',
                              borderRadius: 10,
                            }}>
                            <View
                              style={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                marginTop: -45,
                              }}>
                              <TouchableOpacity
                                onPress={() => setModalVisible4(false)}
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

                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View>
                                <View style={{ padding: 20 }}>
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      paddingBottom: 20,
                                    }}>
                                    <AntDesign
                                      name="checksquare"
                                      size={36}
                                      color="#4CB050"
                                    />
                                  </Text>

                                  <Text
                                    style={{
                                      color: '#000000',
                                      fontWeight: '500',
                                      textAlign: 'center',
                                    }}>
                                    Your Documents Uploaded
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </Modal>
                    </View>

                    {/* ---------------WITHDRAW POINTS HISTORY--------------- */}
                    <ScrollView horizontal>

                      <View>


                        <View
                          style={{
                            backgroundColor: '#000000',

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            marginTop: 15,
                          }}>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            S. No.
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Pay Mode
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Date
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Points
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Closing Balance
                          </Text>
                          <Text
                            style={{
                              color: '#ffffff',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Status
                          </Text>
                        </View>

                        {isLoading ? (
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row',
                              borderBottomWidth: 1,
                              borderBottomColor: '#cccccc',
                            }}>
                            <Text
                              style={{
                                color: '#000000',
                                textAlign: 'center',
                                fontWeight: '500',
                                padding: 15,
                              }}>
                              Loading..
                            </Text>
                          </View>
                        ) : error ? (
                          <View
                            style={{
                              backgroundColor: '#ECECEC',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'row',
                              borderBottomWidth: 1,
                              borderBottomColor: '#cccccc',
                            }}>
                            <Text
                              style={{
                                color: '#000000',
                                textAlign: 'center',
                                fontWeight: '500',
                                padding: 15,
                              }}>
                              No Data Available.
                            </Text>
                          </View>
                        ) : (transactions
                          ?.filter(
                            (transaction) => transaction.type === "Debit"
                          )
                          .map((history, index) => (
                            <View key={history.id}>

                              <View
                                style={{
                                  backgroundColor: 'white',

                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                  borderBottomWidth: 1,
                                  borderBottomColor: '#cccccc',
                                }}>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {index + 1}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.purpose}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.transaction_id}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {`${history.created_at.split(" ")[0]} at ${history.created_at.split(" ").splice(1).join(" ")}`}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.amount}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.closing_balance || 0}
                                </Text>
                                <Text
                                  style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    padding: 15,
                                    minWidth: 145,
                                  }}>
                                  {history.action}
                                </Text>

                              </View>

                            </View>
                          ))
                        )}



                      </View>

                    </ScrollView>

                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <NavFooter />



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
          style={{ flex: 1 }}
          visible={addPaymnetModel}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ width: '90%', backgroundColor: COLORS.white, borderRadius: 10, alignItems: 'center' }}>

              <Text style={{ fontSize: 20, color: COLORS.black, fontWeight: "400", marginTop: 10 }}>{'Welcome to The BGM Game'}</Text>

              <View style={{ width: '100%', height: 1, marginTop: 10, backgroundColor: 'grey' }} />

              <Image style={{ height: 100, width: 100, marginTop: 10, }} source={require('../images/com-logo.png')} />

              <View style={{ width: '100%', alignItems: 'center', backgroundColor: COLORS.black, marginTop: 10 }}>
                <Text style={{ fontSize: 15, color: COLORS.white, fontWeight: "400", marginVertical: 10, textAlign: 'center' }}>{'नीचे दिए हुए आइकॉन पे क्लिक करे 👇'}</Text>
              </View>

              <View style={{ width: '90%', marginTop: 10, flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <TouchableOpacity onPress={handleDepositUpi} style={{ flex: 1, marginEnd: 5 }} >
                  <Text style={styles.primaryBtn}>Manual UPI</Text>
                  <View style={styles.bottomBorder} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { onSubmitManualAccount(), setAddPaymnetModel(false) }} style={{ flex: 1, marginStart: 5 }}>
                  <Text style={styles.primaryBtn}>Manual Account</Text>
                  <View style={styles.bottomBorder} />
                </TouchableOpacity>

              </View>

              <View style={{ width: '100%', alignItems: 'center', backgroundColor: COLORS.black, marginTop: 10 }}>
                <Text style={{ fontSize: 15, color: COLORS.white, fontWeight: "400", marginVertical: 10, textAlign: 'center' }}>{'भुगतान करने के बाद बैक बटन दबाये 👇'}</Text>
              </View>

              <TouchableOpacity onPress={() => setAddPaymnetModel(false)} style={{ marginTop: 10, width: '90%', marginBottom: 20 }}>
                <Text style={[styles.primaryBtn, { backgroundColor: '#d77932' }]}>Back</Text>
                <View style={styles.bottomBorder} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setAddPaymnetModel(false)} style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.app_color, borderRadius: 90, position: 'absolute', top: -25, end: -10 }}>
                <Image style={{ height: 35, width: 35 }} resizeMode='cover' source={require('../images/cross_ic.png')} />
              </TouchableOpacity>

            </View>



          </View>

        </Modal>


        <Modal
          style={{ flex: 1 }}
          visible={addPaymnetManualAccount}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ width: '90%', backgroundColor: COLORS.white, borderRadius: 10, }}>

              <Text style={{ fontSize: 20, color: COLORS.black, fontWeight: "400", marginTop: 10, textAlign: 'center' }}>{'Welcome to The BGM Game'}</Text>

              <View style={{ width: '100%', height: 1, marginTop: 10, backgroundColor: 'grey' }} />

              <View style={{ alignSelf: 'center', width: '90%' }}>

                <Text style={{ fontSize: 14, color: '#505356', fontWeight: "600", marginTop: 10, }}>{'Account Holder Name'}</Text>

                <View style={{ width: '100%', height: 40, backgroundColor: '#e9ecef', borderRadius: 5, marginTop: 2 }}>
                  <TextInput
                    placeholder='Account Holder Name'
                    style={{ marginStart: 10, fontSize: 14, color: '#505356', fontWeight: "600" }}
                    editable={false}
                    value={manualAccountText.accountName}
                  />
                </View>



                <Text style={{ fontSize: 14, color: '#505356', fontWeight: "600", marginTop: 10, }}>{'Account Number'}</Text>

                <View style={{ width: '100%', height: 40, backgroundColor: '#e9ecef', borderRadius: 5, marginTop: 2 }}>
                  <TextInput
                    placeholder='Account Number'
                    style={{ marginStart: 10, fontSize: 14, color: '#505356', fontWeight: "600" }}
                    editable={false}
                    value={manualAccountText.accountNumber}
                  />
                </View>



                <Text style={{ fontSize: 14, color: '#505356', fontWeight: "600", marginTop: 10, }}>{'IFSC'}</Text>

                <View style={{ width: '100%', height: 40, backgroundColor: '#e9ecef', borderRadius: 5, marginTop: 2 }}>
                  <TextInput
                    placeholder='IFSC'
                    style={{ marginStart: 10, fontSize: 14, color: '#505356', fontWeight: "600" }}
                    editable={false}
                    value={manualAccountText.ifsc}
                  />
                </View>


                <Text style={{ fontSize: 14, color: '#505356', fontWeight: "600", marginTop: 10, }}>{'UTR ID'}</Text>

                <View style={{ width: '100%', height: 40, backgroundColor: '#e9ecef', borderRadius: 5, marginTop: 2, }}>
                  <TextInput
                    placeholder='UTR ID'
                    style={{ marginStart: 10, fontSize: 14, color: '#000', fontWeight: "600" }}
                    onChangeText={(text) => setManualTrancId(text)}
                  // defaultValue='HDFC8525'
                  />
                </View>



                <TouchableOpacity onPress={() => onDoneManualAccount()} style={{ marginTop: 20, width: '100%', marginBottom: 20, }}>
                  <Text style={styles.primaryBtn}>Submit</Text>
                  <View style={styles.bottomBorder} />
                </TouchableOpacity>
              </View>


              <TouchableOpacity onPress={() => setAddPaymnetManualAccount(false)} style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.app_color, borderRadius: 90, position: 'absolute', top: -25, end: -10 }}>
                <Image style={{ height: 35, width: 35 }} resizeMode='cover' source={require('../images/cross_ic.png')} />
              </TouchableOpacity>

            </View>



          </View>

        </Modal>


        <Loader visiblity={isLoading} />



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
        <Loader visiblity={loader} />
      </View>


    </TouchableWithoutFeedback>


  );
};

const styles = StyleSheet.create({
  ...appStyles,
});

export default WalletAddAmountScreen;
