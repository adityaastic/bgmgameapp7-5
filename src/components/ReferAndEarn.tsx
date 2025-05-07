import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { usePlayerData } from '../hooks/useHome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { fetchMobile } from '../hooks/useWallet';
import Clipboard from 'react-native-clipboard';
import { Linking } from 'react-native';


const ReferAndEarn = ({ closeModalRefer }) => {
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [modalVisibleRefer, setModalVisibleRefer] = useState(false);
  const playerInfo = usePlayerData();
  const referralCode = playerInfo?.data?.refer_code;
  // console.log(referralCode)



  useEffect(() => {
    if (playerInfo.isSuccess) {
      const textMessage =
        "Play BGM game and earn Rs10000 daily." +
        "\nLife Time Earning \n24x7 Live Chat Support \nWithdrawal Via UPI/Bank \n👇👇 " +
        "\nRegister Now, on \nwww.thebgmgame.com " +
        "\nMy refer code is " +
        playerInfo.data.refer_code +
        ".";

      setMessage(textMessage);
    }
  }, [playerInfo]);

  const shareViaWhatsapp = async () => {
    const options = {
      title: 'Share via WhatsApp',
      message: message,
      url: 'https://api.whatsapp.com/send?text=' + encodeURIComponent(message),
    };

    try {
      await Share.open(options);
    } catch (error) {
      console.error(error);
    }
  };



  const shareViaSms = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    Linking.openURL(smsUrl);
  };

  const copyToClipboard = async (text) => {
    try {
      console.log('Attempting to copy:', text);
      await Clipboard.setString(text); // Set the clipboard content
      console.log('Copied successfully');

      // Attempt to retrieve the clipboard content
      let clipboardText = await Clipboard.getString(); // getString returns a Promise<string | null>
      console.log('Retrieved clipboard content:', clipboardText);

      setCopySuccess("Copied!"); // Update the state to reflect success
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess("Failed to copy!"); // Update the state to reflect failure
    }
  };

  // const copyToClipboard = async () => {
  //   // Call copyToClipboard with the referral code
  //   copyToClipboard(referralCode);

  // };


  useEffect(() => {
    if (!mobile) {
      fetchMobile(setMobile).then(mobile => playerInfo.mutate({ mobile }));
    }
  })

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleRefer}
      onRequestClose={() => setModalVisibleRefer(false)}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            backgroundColor: '#000000',
            minHeight: 450,
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
            <TouchableOpacity onPress={closeModalRefer} style={styles.closebutton}>
              <Text style={styles.textIcon}>
                <AntDesign name="close" size={24} color={'#707070'} />
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <View style={{ padding: 20 }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '500',
                    textAlign: 'center',
                    lineHeight: 25,
                  }}>
                  Welcome to The BGM Game
                </Text>

                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: '#ffffff',
                    fontWeight: '500',
                    textAlign: 'center',
                    lineHeight: 25,
                  }}>Share Application : </Text>

                  <Text style={{
                    color: 'green',
                    fontWeight: '500',
                    textAlign: 'center',
                    lineHeight: 25,
                  }}>www.thebgmgame.com</Text>
                </View>

                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: '#ffffff',
                    fontWeight: '500',
                    textAlign: 'center',
                    lineHeight: 25,
                  }}>My Referal Code : </Text>

                  <Text style={{
                    color: 'green',
                    fontWeight: '500',
                    textAlign: 'center',
                    lineHeight: 25,
                  }}>{playerInfo?.data?.refer_code || "Generating referal code.."}</Text>
                </View>
                <View style={{ width: '100%', paddingVertical: 15, }}>
                  <View>
                    <TouchableOpacity onPress={copyToClipboard} style={styles.button}>
                      <Text style={styles.text}>🔥COPY REFERRAL CODE🔥</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#ffffff',
                        textAlign: 'center',
                        fontWeight: '500',
                      }}>
                      {/* {playerInfo?.data?.refer_code || "Generating referal code.."} */}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>

                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../images/comlogo.png')}
                      style={styles.logoimage}
                    />
                  </View>
                  {/* <View style={{ width: '36%' }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#ffffff',
                          textAlign: 'center',
                          fontWeight: '500',
                        }}>
                        Whatsapp
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#ffffff',
                          textAlign: 'center',
                          fontWeight: '500',
                          paddingTop: 5,
                        }}>
                        6367529290
                      </Text>
                    </View>
                  </View> */}
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Text style={{
                    alignSelf: 'center',
                    fontSize: 15,
                    color: '#ffffff',
                    fontWeight: '500',
                  }}>एप्लीकेशन को शेयर करें 👇</Text>
                </View>
                <View style={{ padding: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <TouchableOpacity onPress={shareViaWhatsapp} style={{ marginTop: 12, backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>Share Whatsapp</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <TouchableOpacity onPress={shareViaSms} style={{ marginTop: 12, backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>Share SMS</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 15,
                      color: '#ffffff',
                      fontWeight: '500',
                    }}>
                    👆 एप्लीकेशन शेयर करने पर आपको हर यूजर का 1 फ्री स्पिन
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 15,
                      color: '#ffffff',
                      fontWeight: '500',
                    }}>
                    मिलेगा,जिससे आप इनाम जीत सकते हैं| 👆
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  circleBtn: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 100,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    padding: 15,
  },
  iconimage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 0,
  },
  text: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  closebutton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 50,
    height: 50,
    borderRadius: 100,
    elevation: 5,
  },
  textIcon: {
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoimage: {
    // textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'green', // Example primary color
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    display: "flex",

  },
  text: {
    color: 'white', // Example text color
    fontSize: 12,
    textAlign: "center",
  },
});

export default ReferAndEarn;
