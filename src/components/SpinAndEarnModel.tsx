import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, Animated } from 'react-native';
import { usePlayerData } from '../hooks/useHome';
import { fetchMobile } from '../hooks/useWallet';
import useSpinWin from '../hooks/useSpinWin';
import useSpinUser from '../hooks/useSpinUser';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';


const SpinAndEarn = ({ closeModalSpin }) => {
  const [mobile, setMobile] = useState("");
  const playerInfo = usePlayerData();
  const winSpin = useSpinWin();
  const { spinUser } = useSpinUser();

  const [modalVisibleSpin, setModalVisibleSpin] = useState(false);



  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  useEffect(() => {
    if (!mobile) {
      fetchMobile(setMobile).then(mobile => playerInfo.mutate({ mobile }));
    }
  })


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleSpin}
      onRequestClose={() => setModalVisibleSpin(false)}>
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
            <TouchableOpacity onPress={closeModalSpin} style={styles.closebutton}>
              <Text style={styles.textIcon}>
                <AntDesign name="close" size={24} color={'#707070'} />
              </Text>
            </TouchableOpacity>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheel: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0cf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prize: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});

export default SpinAndEarn;
