import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import AllGameScreen from './src/screens/AllGameScreen';
import MoringStarScreen from './src/screens/MoringStarScreen';
import AppDetailsScreen from './src/screens/AppDetailsScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import PlayHistoryScreen from './src/screens/PlayHistoryScreen';
import WalletAddAmountScreen from './src/screens/WalletAddAmountScreen';
import FriendListScreen from './src/screens/FriendListScreen';
import TermsConditionScreen from './src/screens/TermsConditionScreen';
import HelpScreen from './src/screens/HelpScreen';
import BonusReportScreen from './src/screens/BonusReportScreen';
import ResultHistoryScreen from './src/screens/ResultHistoryScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import FriendRequestScreen from './src/screens/FriendRequestScreen';
import ChatScreen from './src/screens/ChatScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import WithdrawChat from './src/screens/WithdrawChat';
import ReferAndEarn from './src/components/ReferAndEarn';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen.js';
import TermsConditionsScreen from './src/screens/TermsConditionsScreen.js';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen.js';

export const queryClient = new QueryClient();

const Stack = createStackNavigator();
const App = () => {
  // Log a non-fatal error
  crashlytics().recordError(new Error('Test error'));

  // Log a custom key-value pair
  crashlytics().setAttribute('user_email', 'user@example.com');

  // Log a crash (useful for testing)
  crashlytics().crash();

  analytics().logEvent('event_name', {
    param: 'value',
  });

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AllGameScreen"
              component={AllGameScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MoringStarScreen"
              component={MoringStarScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AppDetailsScreen"
              component={AppDetailsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PlayHistoryScreen"
              component={PlayHistoryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WalletAddAmountScreen"
              component={WalletAddAmountScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="FriendListScreen"
              component={FriendListScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TermsConditionScreen"
              component={TermsConditionScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="HelpScreen"
              component={HelpScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BonusReportScreen"
              component={BonusReportScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ResultHistoryScreen"
              component={ResultHistoryScreen}
              options={{headerShown: false}}
            />
            {/* <Stack.Screen
              name="ReferAndEarnScreen"
              component={ReferAndEarn}
              options={{ headerShown: false }}
            /> */}
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TermsAndConditions"
              component={TermsConditionsScreen}
              options={{title: 'Terms And Conditions'}}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={{title: 'Privacy Policy'}}
            />

            <Stack.Screen
              name="FriendRequestScreen"
              component={FriendRequestScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="WithdrawChat"
              component={WithdrawChat}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

export default App;
