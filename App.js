import React from 'react';
import { SafeAreaView, StyleSheet, Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {supabase} from './Utils/supabase'
import LoginPage from './pages/LoginPage';
import ForgetPassword from './pages/ForgetPassword';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import CreateGroup from './pages/CreateGroup';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Main" component={MainPage} />
        <Stack.Screen name="Create" component={CreateGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

