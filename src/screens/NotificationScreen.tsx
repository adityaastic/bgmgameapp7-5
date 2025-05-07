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
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderThree from '../components/HeaderThree';
import NavFooter from '../components/NavFooter';
import appStyles from '../styles/appStyles';
import useNotification from '../hooks/useNotification';
import { fetchMobile } from '../hooks/useWallet';
import useCreateNotificatonSeen from '../hooks/useCreateNotificatonSeen';
import { imageApiClient } from '../constants/api-client';
import Video, { VideoRef } from 'react-native-video';

const NotificationScreen = () => {

  const { notifications } = useNotification();
  const [mobile, setMobile] = useState("")

  const seeNotif = useCreateNotificatonSeen();

  const videoRef = useRef<VideoRef>(null)

  useEffect(() => {
    fetchMobile(setMobile).then(mobile => seeNotif.mutate(mobile))
  }, []);

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <HeaderThree title={'Notification'} />
      <ScrollView>
        <View style={{ marginVertical: 20 }}>
          {notifications?.map((notification) => (
            <View
              key={notification.id}
              style={{ backgroundColor: '#ECECEC', padding: 20, marginBottom: 20 }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'left',
                  alignItems: 'flex-start',
                  marginBottom: 10,
                }}>
                <Image
                  source={require('../images/point.png')}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000000',
                    textAlign: 'left',
                    fontWeight: '500',
                    width: '92%',
                  }}>
                  {notification.heading}
                </Text>
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'left',
                  alignItems: 'flex-start',
                  marginBottom: 10,
                }}>
                <Image
                  source={require('../images/point.png')}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000000',
                    textAlign: 'left',
                    fontWeight: 400,
                    width: '92%',
                  }}>
                  {notification.message}
                </Text>
              </View>

              {notification.link && <TouchableOpacity
                onPress={() => Linking.openURL(notification.link).catch((err) => console.error("Couldn't load page", err))}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'left',
                  alignItems: 'flex-start',
                  marginBottom: 10,
                }}>
                <Image
                  source={require('../images/point.png')}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#0d6efd',
                    textAlign: 'left',
                    fontWeight: 400,
                    width: '92%',
                  }}>
                  {notification.link}
                </Text>
              </TouchableOpacity>}

              {notification.file && (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'left',
                    alignItems: 'flex-start',
                    marginBottom: 10,
                  }}>
                  {notification.file.endsWith(".mp3") && (
                    <audio controls>
                      <source
                        src={imageApiClient + notification.file}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {(notification.file.endsWith(".png") ||
                    notification.file.endsWith(".jpg") ||
                    notification.file.endsWith(".jpeg") ||
                    notification.file.endsWith(".gif")) && (
                      <Image
                        source={{ uri: imageApiClient + notification.file }}
                        style={{
                          marginRight: 10,
                          width: "100%", height: 200,
                          borderRadius: 10,
                        }}
                      />
                      
                    )}
                    {console.log( imageApiClient + notification.file)}
                  {(notification.file.endsWith(".mp4") ||
                    notification.file.endsWith(".webm") ||
                    notification.file.endsWith(".ogg")) && (
                      <Video
                        ref={videoRef}
                        controls={true}
                        paused={true}
                        allowsExternalPlayback={true}
                        style={{
                          width: "100%",
                          height: "200px",
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                        }}
                        source={{ uri: imageApiClient + notification.file }}
                      />
                    )}

                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <NavFooter />
    </View>
  );
};
const styles = StyleSheet.create({
  ...appStyles,
});
export default NotificationScreen;
