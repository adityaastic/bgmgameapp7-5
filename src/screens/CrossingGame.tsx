import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appStyles from '../styles/appStyles';
import useWallet from '../hooks/useWallet';
import usePlaceBet from '../hooks/usePlaceBet';
import useCrossingGame from '../hooks/useCrossingGame';
import { showAlert } from '../components/Alert';
import InsufficientBalance from '../components/InsufficientBalance.modal';
import Toast from 'react-native-simple-toast';
import LoaderWhite from '../components/LoaderWhite';

const CrossingGame = ({ navTabHomeName, market, screenType }: any) => {
  const navigation = useNavigation()

  const [sufficientBalance, setSufficientBalance] = useState(true);
  const [showNoBalance, setShowNoBalance] = useState(!sufficientBalance);

  const [textOne, settextOne] = useState('');
  const [textTwo, settextTwo] = useState('');
  const [textThree, settextThree] = useState('');
  const [loader, setLoader] = useState(false);


  const { wallet } = useWallet();
  const placeBet = usePlaceBet();

  const {
    crossingFirstInput,
    crossingSecondInput,
    setCrossingFirstInput,
    setCrossingSecondInput,
    deleteCrossingJodi,
    crossingPoints,
    setCrossingPoints,
    crossingJodis,
    setCrossingJodis,
    buildCrossingJodi,
    calculateCrossingPointsTotal,
  } = useCrossingGame();

  useEffect(() => {
    setSufficientBalance(wallet?.total_amount >= calculateCrossingPointsTotal());
  }, [wallet, calculateCrossingPointsTotal()]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      screenType('Crossing')
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const crossingJodiBets = () =>
    crossingJodis?.map((crossingJodi) => ({
      betKey: crossingJodi,
      points: crossingPoints,
      betType: "Jodi",
      jodiType: "Jodi",
      market: market?.market,
    }));

  // useEffect(() => {
  //   if (placeBet.isSuccess) {
  //     showAlert("Successful!", "Point Placed Successfully.")
  //     navigation.navigate('HomeScreen')
  //   } else if (placeBet.isError) {
  //     showAlert("Successful!", "Could not place bet...")
  //   }
  // }, [placeBet])


  useEffect(() => {
    console.log("isPending :- ", placeBet)
    if (placeBet.isPending) {
      setLoader(true)
    }
    else if (placeBet.isSuccess) {
      setLoader(false)
      Toast.show('Point Placed Successfully.', Toast.LONG);

      navigation.navigate('AllGameScreen')
    }
    else if (placeBet.isError) {
      setLoader(false)
      showAlert("Failed!", `Could not place bet..  ${placeBet.error?.response?.data?.error || ""
        }`)
    }
  }, [placeBet.isSuccess, placeBet.isError, placeBet.isPending])

  const onDone = () => {
    // (crossingFirstInput && crossingSecondInput && crossingPoints) && setCrossingJodis(prev =>
    //   buildCrossingJodi(crossingFirstInput, crossingSecondInput)
    // )

    if (!textOne || textTwo) {
      Toast.show('Please enter number.', Toast.LONG);
    }
    else if (!textThree) {
      Toast.show('Please enter number points.', Toast.LONG);
    }
    else {
      setCrossingJodis(prev => buildCrossingJodi(crossingFirstInput, crossingSecondInput))
    }
  }

  return (
    <View style={{ display: navTabHomeName == 'Tab4' ? 'flex' : 'none' }}>
      <ScrollView nestedScrollEnabled style={styles.nestedScrollView}>
        <View style={styles.innerContent}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingHorizontal: 20,
            }}>
            <View>
              <Text
                style={{
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                Points Remaining:
              </Text>
              <Text
                style={{
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                {wallet?.total_amount}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                Points Added:
              </Text>
              <Text
                style={{
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                {calculateCrossingPointsTotal()}
              </Text>
            </View>
          </View>
          <View style={{ marginVertical: 15, paddingHorizontal: 20 }}>
            <View style={{ marginBottom: 15 }}>
              <Text
                style={{
                  color: '#000000',
                  marginBottom: 10,
                  fontWeight: '500',
                }}>
                Number
              </Text>
              <View
                style={{ backgroundColor: '#ECECEC', paddingHorizontal: 15 }}>
                <TextInput
                  keyboardType='numeric'
                  onChangeText={(text) => {
                    setCrossingFirstInput(text),
                      crossingFirstInput === crossingSecondInput &&
                      setCrossingSecondInput(text), settextOne(text)
                  }}
                  value={crossingFirstInput}
                  maxLength={6}
                  placeholder="Number"
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
                Number
              </Text>
              <View
                style={{ backgroundColor: '#ECECEC', paddingHorizontal: 15 }}>
                <TextInput
                  keyboardType='numeric'
                  onChangeText={(text) => { setCrossingSecondInput(text), settextTwo(text) }}
                  value={crossingSecondInput}
                  placeholder="Number"
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
                Number Points
              </Text>
              <View
                style={{ backgroundColor: '#ECECEC', paddingHorizontal: 15 }}>
                <TextInput
                  keyboardType='numeric'
                  onChangeText={(text) => { setCrossingPoints(text), settextThree(text) }}
                  value={crossingPoints}
                  placeholder="Points"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.Btn} onPress={() => onDone()}>
              <Text style={styles.primaryBtn}>{crossingJodis ? "Update" : "Add"}</Text>
              <View style={styles.bottomBorder} />
            </TouchableOpacity>
          </View>

          {crossingJodis && (
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
                    Number Type
                  </Text>
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      fontWeight: '500',
                      padding: 15,
                      minWidth: 145,
                    }}>
                    Number
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
                    Action
                  </Text>

                </View>

                {crossingJodis?.map(
                  (jodi: any) =>
                    <View key={jodi}>


                      <View
                        style={{
                          backgroundColor: '#ECECEC',

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
                          Crossing
                        </Text>
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 145,
                          }}>
                          {jodi}
                        </Text>
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 145,
                          }}>
                          {crossingPoints}
                        </Text>
                        <TouchableOpacity onPress={() => deleteCrossingJodi(jodi)} >

                          <Text
                            style={{
                              color: '#000000',
                              textAlign: 'center',
                              fontWeight: '500',
                              padding: 15,
                              minWidth: 145,
                            }}>
                            Delete
                          </Text>

                        </TouchableOpacity>


                      </View>


                    </View>
                )}


              </View>

            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Modal */}

      <LoaderWhite visiblity={loader} />

      <InsufficientBalance showModal={showNoBalance} setShowModal={setShowNoBalance} />


      {/* Modal End */}

      {crossingJodis && <View style={styles.footerFix}>
        <TouchableOpacity
          disabled={placeBet.isPending || placeBet.isSuccess}
          style={styles.Btn}
          onPress={() => {
            return sufficientBalance
              ? placeBet.mutate(crossingJodiBets())
              : setShowNoBalance(!showNoBalance);
          }}>
          <Text style={styles.primaryBtn}>Play</Text>
          <View style={styles.bottomBorder} />
        </TouchableOpacity>
      </View>}
    </View>
  )
}

const styles = StyleSheet.create({
  ...appStyles,
});

export default CrossingGame