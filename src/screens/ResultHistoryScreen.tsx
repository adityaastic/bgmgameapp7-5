import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback, Image, TextInput, Button, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderThree from '../components/HeaderThree';
import NavFooter from '../components/NavFooter';
import { Picker } from '@react-native-picker/picker';
import appStyles from '../styles/appStyles';
import { format } from 'date-fns';
import useDecemberMonthResult from '../hooks/useDecemberMonthResult';
import useMarkets from '../hooks/useMarkets';

function getMonthYear() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // Adding 1 because getMonth() is zero-based
  const currentYear = now.getFullYear();

  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;

  // Adjust for January (0)
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }

  return {
    currentMonthYear: `${currentYear}-${currentMonth.toString().padStart(2, "0")}`,
    previousMonthYear: `${prevYear}-${prevMonth.toString().padStart(2, "0")}`
  };
}

function extractMonthYear(dateString) {
  const parts = dateString.split('-');
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[0], 10);
  return { month, year };
}

function getDatesOfMonth(year, month) {
  const dates = [];
  const date = new Date(year, month - 1, 1); // Subtract 1 to make the month zero-based

  while (date.getMonth() === month - 1) { // Also adjust the condition to be zero-based
    dates.push(new Date(date)); // Push a copy of the date into the array
    date.setDate(date.getDate() + 1); // Increment the day
  }

  return dates;
}


const ResultHistoryScreen = () => {
  const [selectedMonthValue, setSelectedMonthValue] = useState('');
  const [selectedMonthDates, setSelectedMonthDates] = useState([]);

  const { result, isLoding } = useDecemberMonthResult({ date: selectedMonthValue });
  const { markets } = useMarkets();

  useEffect(() => { console.log(result) }, [result])
  useEffect(() => {
    const { month, year } = extractMonthYear(selectedMonthValue)
    const dates = getDatesOfMonth(year, parseInt(month))
    setSelectedMonthDates(dates)
  }, [selectedMonthValue])


  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', }}>
      <HeaderThree title={'Result History'} />
      <ScrollView>
        <View style={{ padding: 20, }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, }}>
            <View style={{ width: '100%' }}>
              <View style={{ borderRadius: 5, borderWidth: 1, borderColor: '#cccccc', }}>
                <Picker
                  selectedValue={selectedMonthValue}
                  onValueChange={(month) => setSelectedMonthValue(month)}
                  style={{ color: '#000000', fontSize: 12 }}
                  itemStyle={{ color: '#000000' }}
                  dropdownIconColor="#000000" // Set the arrow toggle color to white
                >
                  <Picker.Item label={"Select a month"} value={""} />
                  <Picker.Item label={getMonthYear().currentMonthYear} value={getMonthYear().currentMonthYear} />
                  <Picker.Item label={getMonthYear().previousMonthYear} value={getMonthYear().previousMonthYear} />
                </Picker>
              </View>
            </View>
          </View>
        </View>
        <ScrollView horizontal>
          <View style={{ marginBottom: 20, }}>
            <View style={{ backgroundColor: '#E1EFE6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={{ color: '#000000', textAlign: 'left', fontWeight: '500', padding: 15, minWidth: 145, borderLeftWidth: 1, borderLeftColor: '#E1EFE6', }}> Date </Text>
              {markets?.map(market => <Text key={market.id} style={{ color: '#000000', textAlign: 'center', fontWeight: '500', padding: 15, minWidth: 145, borderLeftWidth: 1, borderLeftColor: '#E1EFE6', }}> {market.market} </Text>)}
            </View>
            {selectedMonthDates?.map(on => (
              <>
                <View style={{ backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ffffff', }}>
                  <Text style={{ color: '#ffffff', textAlign: 'left', fontWeight: '500', padding: 15, minWidth: 145, borderLeftWidth: 1, borderLeftColor: '#ffffff', }}> {format(on, "yyyy-MM-dd")} </Text>
                  {markets?.map(market => result?.map(res => ((res.market_name === market.market) && (format(res.created_at, "yyyy-MM-dd") === format(on, "yyyy-MM-dd"))) ? (
                    <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '500', padding: 15, minWidth: 145, borderLeftWidth: 1, borderLeftColor: '#ffffff', }}> {res.bet_key} </Text>
                  ) : (
                    <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '500', padding: 15, minWidth: 145, borderLeftWidth: 1, borderLeftColor: '#ffffff', }}> {" "}  {console.log(format(res.created_at, "yyyy-MM-dd"), format(on, "yyyy-MM-dd"))} </Text>
                  )))}
                </View>
              </>
            ))}
          </View>
        </ScrollView>


        <TouchableOpacity style={{...styles.Btn, marginVertical: 20, marginHorizontal: 10}} onPress={() => Linking.openURL("https://www.babajiisatta.com/").catch((err) => console.error("Couldn't load page", err))}>
          <Text style={styles.primaryBtn}>More Results {">>"}</Text>
          <View style={styles.bottomBorder} />
        </TouchableOpacity>
      </ScrollView>
      <NavFooter />

    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,

});
export default ResultHistoryScreen;