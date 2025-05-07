import React, {useState, useEffect, useRef} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import HeaderThree from '../components/HeaderThree';
import NavFooter from '../components/NavFooter';
import {Picker} from '@react-native-picker/picker';
import appStyles from '../styles/appStyles';
import { fetchMobile } from '../hooks/useWallet';
import { usePlayerData } from '../hooks/useHome';
import useCreateBonu from '../hooks/useCreateBonus';
import useMarkets from '../hooks/useMarkets';
import useBonusReport from '../hooks/useBonusReport';
import ConvertTime from '../hooks/useConvertTime';
import { showAlert } from '../components/Alert';



export function separateDateAndTime(dateTimeString) {
  let datePart, timePart;
  if (dateTimeString?.includes("T")) {
    [datePart, timePart] = dateTimeString?.split("T");
  } else {
    [datePart, timePart] = dateTimeString?.split(" ");
  }
  // const [year, month, day] = datePart?.split("-");
  // const formattedDate = `${year}-${month}-${day}`;
  return { date: datePart, time: timePart };
}


const BonusReportScreen = () => {
  
  const [market, setMarket] = useState(null);
  const [mobile, setMobile] = useState("");
  const [totalCommission, setTotalCommission] = useState(0);


  // =========> Make API Requests using custom hooks
  const { bonusReport,isLoding, refetch } = useBonusReport({ market });
  const { markets } = useMarkets();
  const withdrawlBonus = useCreateBonu();
  const playerData = usePlayerData();

  const navigation = useNavigation();


  useEffect(() => {
    if (bonusReport && bonusReport.length > 0) {
      const totalComm = bonusReport.reduce(
        (acc, item) => acc + item.commission_amount,
        0
      );
      setTotalCommission(totalComm);
    } else {
      setTotalCommission(0);
    }
  }, [bonusReport]);


  


  // =========> Fetch player info
  useEffect(() => {
    if (!mobile) {
      fetchMobile(setMobile).then(mobile => playerData.mutate({ mobile }));
    }
  }, [mobile]);


  useEffect(() => {
    if (withdrawlBonus.isSuccess) {
      showAlert("Successful!", "Bonus Placed Successfully.")
      navigation.navigate('BonusReportScreen')
    } else if (withdrawlBonus.isError) {
      showAlert("Successful!", "Could not place Bonus...")
    }
  }, [withdrawlBonus])

  //----------Input Form----------//
  const [textInput1, setTextInput1] = useState('');
  const [textInput2, setTextInput2] = useState('');

  const onSubmit = () => {
   withdrawlBonus.mutate({ mobile,amount: textInput1 });
   setTextInput1('');
  };

  useEffect(() => {
    withdrawlBonus.isSuccess && refetch();
  }, [withdrawlBonus]);
  //----------End----------//
  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderThree title={'Bonus Report'} />
      <ScrollView>
        <View style={{padding: 20}}>
          <Text style={{color: '#000000', paddingBottom: 15, fontWeight: 400}}>
            Total Commission:
            <Text> {totalCommission} </Text>
          </Text>
          <Text style={{color: '#000000', paddingBottom: 15, fontWeight: 400}}>
            Remaining Commission:
            <Text>{bonusReport && bonusReport[0]?.closing_balance} </Text>
          </Text>
          <Text
            style={{
              color: '#000000',
              paddingBottom: 15,
              fontWeight: '500',
              lineHeight: 24,
            }}>
            Enter Redeeem Amount (Min - 50 And
            <Text>{'\n'}</Text>
            Max- 2000 Can Withdraw)
          </Text>
          <View style={{marginBottom: 15,flexDirection:'row',display:'flex',justifyContent:'space-between'}}>
            <View style={{backgroundColor: '#ECECEC', paddingHorizontal: 15,width:'70%'}}>
              <TextInput
                onChangeText={setTextInput1}
                value={textInput1}
                placeholder="Enter Amount"
                keyboardType="numeric"
              />
            </View>
            <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
            <TouchableOpacity onPress={onSubmit}
                    style={styles.Btn}>
                    <Text style={styles.primaryBtn}>Submit</Text>
                    <View style={styles.bottomBorder} />
                  </TouchableOpacity>
                  </View>
          </View>
        </View>
        {/* <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 15,
          }}>
          <View style={{width: '38%'}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#000000', fontWeight: 400}}>Show</Text>
              <View>
                <TextInput
                  style={styles.formOutline}
                  onChangeText={setTextInput2}
                  value={textInput2}
                  placeholder="10"
                  keyboardType="numeric"
                />
              </View>
              <Text style={{color: '#000000', fontWeight: 400}}>Entries</Text>
            </View>
          </View>
          <View style={{width: '52%'}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#000000', fontWeight: 400}}>
                Entries
                <Text>{'\n'}</Text>
                Search
              </Text>
              <View style={{width: '70%'}}>
                <TextInput
                  style={styles.formOutline}
                  onChangeText={setTextInput2}
                  value={textInput2}
                  placeholder="10"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View> */}
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
                  paddingHorizontal:60

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
                Bet Amount
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                Commission Recieved
              </Text>
               <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                 Commission Redeemed
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'left',
                  fontWeight: '500',
                  padding: 15,
                }}>
                 Redeem Status
              </Text>
            </View>
            
            
            {bonusReport?.length !== 0 ? (
              bonusReport?.map(
                (bonus: any, index: number) =>

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
                        textAlign: 'start',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 100,
                      }}>
                      {`${separateDateAndTime(bonus.created_at).date
                        } ${ConvertTime(
                          separateDateAndTime(bonus.created_at).time
                        )}`}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'start',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 100,
                      }}>
                      {!(bonus.purpose === "Withdraw") && bonus.amount}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'start',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 100,
                      }}>
                      {bonus.commission_amount}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'start',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 100,
                      }}>
                        
                        {(bonus.purpose === "Withdraw") && bonus.amount}
                    </Text>
                    <Text
                      style={{
                        color: '#000000',
                        textAlign: 'start',
                        fontWeight: '500',
                        padding: 15,
                        minWidth: 100,
                      }}>
                      {bonus.action}
                    </Text>
                   
                  </View>

              )) : isLoding ? (
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
      <NavFooter />
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default BonusReportScreen;
