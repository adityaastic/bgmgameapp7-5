import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import LuckyWheel, { LuckyWheelHandle } from 'react-native-lucky-wheel';
import { Button } from 'react-native-paper';
import COLORS from '../components/COLORS';
import Toast from 'react-native-simple-toast';
import WheelAnimator from '../WheelComponent/WheelAnimator';
import Loader from '../components/Loader';
import axios from 'axios';
import apiClient, { BaseURLCLUB } from '../constants/api-client';
import { usePlayerData } from '../hooks/useHome';
import LoaderWhite from '../components/LoaderWhite';
import { fetchMobile } from '../hooks/useWallet';

const SLICES = [
  { text: '10' },
  { text: '20' },
  { text: '30' },
  { text: '40' },
  { text: '50' },
  { text: '60' },
  { text: '70' },
  { text: '80' },
  { text: '90' },
  { text: '100' },
];

const SpinnerWheel = () => {

  const playerInfo = usePlayerData();


  const [spinData, setspinData] = useState(0);
  const [spinWinner, setSpinWinner] = useState(0);
  const [loader, setLoader] = useState(false);
  const [mobile, setMobile] = useState("");



  useEffect(() => {

    fetchMobile(setMobile).then(mobile =>

      apiClient.post(`player-profile/`, { mobile }).then((res) => {
        console.log("player data :- ", res.data)

        setspinData(res.data.spin_remaining)
        setMobile(res.data.mobile)
        var sampleNumber = res.data.spin_used
        lastDigit = Number.isInteger(sampleNumber) ? sampleNumber % 10
          : sampleNumber.toString().slice(-1);
        console.log('The last digit of ', sampleNumber, ' is ', lastDigit);
        setSpinWinner(lastDigit)

      })

    );
  }, []);






  const spinerApi = (data, mobile) => {



    console.log("data", data)

    setLoader(true)

    var params = { mobile: mobile, amount: data.text }


    axios.post(BaseURLCLUB + '/create-spin-bonus/', params).then((response) => {
      if (response.data) {
        console.log(response.data)
        setspinData(spinData - 1)
        setSpinWinner((data) => data + 1)
        Toast.show(response.data.message, Toast.LONG);
        setLoader(false)

      }
      else {
        Toast.show(response.data.message, Toast.LONG);
        setLoader(false)

      }
    })
  }

  const wheelRef = useRef(null);

  return (

    <View style={{ alignItems: 'center', justifyContent: 'center', }}>




      <View style={{ backgroundColor: COLORS.app_color, paddingHorizontal: 25, paddingVertical: 10, borderRadius: 90, }}>
        <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: 700, }}>{'SPIN LEFT 👉 ' + spinData}</Text>
      </View>


      <LuckyWheel
        ref={wheelRef}
        slices={SLICES}
        onSpinningEnd={(data) => spinerApi(data, mobile)}
        enableGesture
        minimumSpinVelocity={0.6} // 0.0 - 1.0
        winnerIndex={spinWinner == 0 ? 0 : spinWinner - 1}
        enableInnerShadow={true}
        textStyle={{ fontSize: 20, }}
        enableOuterDots={true}
        size={320}


      />


      <TouchableOpacity disabled={spinData > 0 ? false : true} style={{ backgroundColor: COLORS.app_color, paddingHorizontal: 25, paddingVertical: 10, borderRadius: 90, marginTop: 20, opacity: spinData > 0 ? 1 : 0.6 }} onPress={() => wheelRef?.current?.start()}>
        <Text style={{ fontSize: 18, color: COLORS.white, fontWeight: 700, }}>🔥Spin🔥</Text>
      </TouchableOpacity>




    </View>
  );
};

export default SpinnerWheel

