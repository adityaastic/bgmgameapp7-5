// Page.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useCountdownTimer from '../hooks/useCountdownTimer';
const HeaderTwo = ({ market, navigation }: any) => {

  const { timeRemaining, setTargetTime } = useCountdownTimer()

  useEffect(() => {
    setTargetTime(market.close_time)
  }, [])

  return (
    <View style={styles.header}>
      <View
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => navigation.goBack()}>
          <Text style={{ color: '#000000', marginRight: 5 }}>
            <AntDesign name="arrowleft" size={22} color={'#000000'} />
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>{market.market}</Text>
      </View>
      <View>
        <Text
          style={{ color: '#000000', textAlign: 'center', fontWeight: '500' }}>
          {' '}
          Time Left{' '}
        </Text>
        <Text
          style={{ color: '#000000', textAlign: 'center', fontWeight: '500' }}>
          <Text style={styles.timerText}>  {`${timeRemaining?.hours}:${timeRemaining?.minutes}:${timeRemaining?.seconds}`} </Text>| Active{' '}
        </Text>
      </View>
    </View >
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#E1EFE6',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 72,
    color: '#000000',
    elevation: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  timerText: {
    paddingLeft: 15,
    marginLeft: 10,
  },
});
export default HeaderTwo;
