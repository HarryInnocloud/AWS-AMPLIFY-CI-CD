import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/components/Login';
import Home from './src/components/Home';
import { StatusBar } from "expo-status-bar";
import SignUpForm from './src/components/SignUp';
import ConfirmSignUp from './src/components/ConfirmSignUp';
import MyProfile from './src/components/MyProfile';
import { Amplify } from 'aws-amplify';
import { awS } from './src/aws-exports';
import ResetPassword from './src/components/ResetPassword';
import ConfirmResetPassword from './src/components/ConfirmResetPassword';
import CameraScreen from './src/components/CameraScreen';
import IdleTimer from './src/utils/IdleTimer';
import AttendanceReviewScreen from './src/components/AttendanceReviewScreen';
Amplify.configure(awS);

const Stack = createStackNavigator();

const App = () => {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <IdleTimer />
        <StatusBar style="light" />

        <Stack.Navigator initialRouteName={'Login'}
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name="SignUpForm" component={SignUpForm} />
          <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUp} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MyProfile" component={MyProfile} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="ConfirmResetPassword" component={ConfirmResetPassword} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} />
          <Stack.Screen name="AttendanceReviewScreen" component={AttendanceReviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
