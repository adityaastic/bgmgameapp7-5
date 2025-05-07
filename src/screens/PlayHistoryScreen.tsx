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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderThree from '../components/HeaderThree';
import NavFooter from '../components/NavFooter';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Positions } from 'react-native-calendars/src/expandableCalendar';
import appStyles from '../styles/appStyles';
import useMarkets from '../hooks/useMarkets';
import useMyPlayHistory from '../hooks/useMyPlayHistory';
import ConvertTime, { separateDateAndTime } from '../hooks/useConvertTime';
import useBetsAction from '../hooks/useBetsAction';
import { format } from 'date-fns';
import Loader from '../components/Loader';

export function getTodayDate() {
  const today = new Date();
  let month = String(today.getMonth() + 1);
  let day = String(today.getDate());
  const year = today.getFullYear();

  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }

  return [year, month, day].join("-");
}


const PlayHistoryScreen = () => {
  const navigation = useNavigation();
  //---------- Game Dropdown ----------//
  const [market, setMarket] = useState("");
  //----------  Game Dropdown  End----------//

  //---------- Date Dropdown ----------//
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loader, setLoader] = useState(false);
  const [hasEffectBeenCalled, setHasEffectBeenCalled] = useState(false);


  // const handleDateChange = (event, selected) => {
  //   const currentDate = selected || selectedDate;
  //   setShowDatePicker(Platform.OS === 'ios');
  //   setSelectedDate(currentDate);
  // };


  //---------- Date  Dropdown  End----------//

  const [betsToDelete, setBetsToDelete] = useState({ bets: [] });
  const { markets } = useMarkets();

  const { myPlayHistory, isLoading, refetch } = useMyPlayHistory({
    market,
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
  })

  const isDeletable = (createdAt) => {
    const createTime = new Date(createdAt);
    const currentTime = new Date();
    const difference = (currentTime - createTime) / (1000 * 60);
    return difference <= 5;
  };

  const betsDelete = useBetsAction(refetch);

  useEffect(() => {
    console.log("Selected Date: ", selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '')
  }, [selectedDate])






  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <HeaderThree title={'History'} />
      <ScrollView>
        <View style={{ padding: 20 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{ width: '48%' }}>
              <View>
                <View>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{ position: 'relative' }}>
                    <TextInput
                      style={[
                        {
                          color: '#ffffff',
                          backgroundColor: '#000000',
                          borderRadius: 40,
                          fontSize: 16,
                          padding: 13,
                        },
                      ]} // Set text color to #000000
                      value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Select Date'}
                      onFocus={() => setShowDatePicker(true)}
                      editable={false} // Make the TextInput non-editable
                    />
                    <Text
                      style={{
                        position: 'absolute',
                        right: 15,
                        top: 23,
                      }}>
                      <AntDesign name="caretdown" size={10} color="#ffffff" />
                    </Text>
                  </TouchableOpacity>
                </View>
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate || new Date();
                      setShowDatePicker(Platform.OS === 'ios');
                      setSelectedDate(currentDate);
                    }}
                  />

                )}
              </View>
            </View>
            <View style={{ width: '48%' }}>
              <View style={{ backgroundColor: '#000000', borderRadius: 40 }}>
                <Picker
                  selectedValue={market}
                  onValueChange={itemValue => {
                    if (itemValue !== "0") {
                      setMarket(itemValue);
                    }
                  }}
                  style={{ color: 'white', fontSize: 12 }}
                  itemStyle={{ color: 'white' }}
                  dropdownIconColor="white" // Set the arrow toggle color to white
                >
                  <Picker.Item label="Select a market..." value="0" />
                  {markets?.map((market: any) => (
                    <Picker.Item key={market.market} label={market.market} value={market.market} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>


        <ScrollView horizontal>

          <View>


            <View
              style={{
                backgroundColor: '#000000',
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
                  padding: 15,
                }}>
                S.No.
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                Date
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                Name
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                Type
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                Number
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                Points
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                Earned
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                Action
              </Text>
            </View>

            {myPlayHistory?.length !== 0 ? (
              myPlayHistory?.map(
                (history: any, index: number) =>

                  <View
                    key={index}
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
                      {`${separateDateAndTime(history.createdAt).date
                        } ${ConvertTime(
                          separateDateAndTime(history.createdAt).time
                        )}`}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 145,
                      }}>
                      {history.market}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 145,
                      }}>
                      {history.harrafType || history.betType}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 145,
                      }}>
                      {history.betKey}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 145,
                      }}>
                      {history.betAmount}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 145,
                      }}>
                      {history.winAmount}
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        if (isDeletable(history.createdAt)) {
                          setBetsToDelete((prevBets) => ({
                            ...prevBets,
                            bets: [
                              ...prevBets.bets,
                              {
                                id: history.id,
                                points: history.betAmount,
                                bet_key: history.betKey,
                              },
                            ],
                          }));
                          await betsDelete.mutateAsync({ ...betsToDelete, deleted_by: `User` });
                          betsDelete.isSuccess && setBetsToDelete({ bets: [] });
                        }
                      }}
                    >
                      {isDeletable(history.createdAt) ? (
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 145,
                          }}
                        >
                          Delete
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            padding: 15,
                            minWidth: 145,
                          }}
                        >
                          Not Deletable
                        </Text>
                      )}
                    </TouchableOpacity>




                  </View>

              )) : isLoading ? (
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
                    Loading...
                  </Text>
                </View>
              ) : (
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
            )}


          </View>

        </ScrollView>
      </ScrollView>

      <Loader visiblity={isLoading} />
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default PlayHistoryScreen;
