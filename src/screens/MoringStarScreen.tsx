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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderTwo from '../components/HeaderTwo';
import TabCustom from '../components/TabCustom';
import appStyles from '../styles/appStyles';
import useCountdownTimer from '../hooks/useCountdownTimer';
import useSetJodis from '../hooks/useSetJodis';
import usePlaceBet from '../hooks/usePlaceBet';
import Loader from '../components/Loader';
import { showAlert } from '../components/Alert';
import Toast from 'react-native-simple-toast';
import InsufficientBalance from '../components/InsufficientBalance.modal';
import useWallet from '../hooks/useWallet';


const MoringStarScreen = ({ navigation, route }: any) => {
  const { market } = route.params

  const { timeRemaining, setTargetTime } = useCountdownTimer()
  const [sufficientBalance, setSufficientBalance] = useState(true);
  const [showNoBalance, setShowNoBalance] = useState(!sufficientBalance);

  const { jodiPoints, setJodiInput, jodis } = useSetJodis();
  const [loader, setLoader] = useState(false);
  const placeBet = usePlaceBet();
  const { wallet } = useWallet();

  const [apiData, setApiData] = useState({})
  const [screenType, setScreenType] = useState('')


  useEffect(() => {
    setTargetTime(market.close_time)
  }, [])

  useEffect(() => {
    setSufficientBalance(wallet?.total_amount >= jodiPoints);
  }, [wallet, jodiPoints]);


  const apiDataFun = (data: any) => {
    setApiData(data);
    console.log(data)
  };

  const screenTypeFun = (data: any) => {
    setScreenType(data)
    console.log(data)

  };



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

    if (apiData) {
      if (sufficientBalance) {
        if (screenType === 'Tab1') {
          placeBet.mutate(apiData.filter((bet) => bet.points))
        }
        else if (screenType == 'Tab2') {
          placeBet.mutate(apiData.filter((bets) => bets.betKey))

        }
        else if (screenType == 'Tab3') {
          placeBet.mutate(apiData.filter((bet) => bet.points))

        }

      }
      else {
        setShowNoBalance(!showNoBalance);
      }

    }
    else {
      Toast.show('Please add point.', Toast.LONG);
    }



  }



  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <HeaderTwo navigation={navigation} market={market} />
      <ScrollView>
        <View style={{ backgroundColor: '#000000', padding: 20 }}>
          <Text
            style={{ color: '#ffffff', textAlign: 'center', fontWeight: '500' }}>
            Maximum Point Will Change After Timer
            <Text style={styles.timerText}> {`${timeRemaining?.hours}:${timeRemaining?.minutes}:${timeRemaining?.seconds}`} </Text>
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <TabCustom market={market} apiData={apiDataFun} screenType={screenTypeFun} />
        </View>
      </ScrollView>


      {(screenType == 'Tab1' || screenType == 'Tab2' || screenType == 'Tab3') &&

        <TouchableOpacity
          style={{ position: 'absolute', width: '90%', alignSelf: 'center', bottom: 20, }}
          onPress={() => onDone()}
        >
          <View
            style={styles.Btn}>
            <Text style={styles.primaryBtn}>Play</Text>
            <View style={styles.bottomBorder} />
          </View>
        </TouchableOpacity>
      }




      <Loader visiblity={loader} />

      <InsufficientBalance showModal={showNoBalance} setShowModal={setShowNoBalance} />


    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default MoringStarScreen;
