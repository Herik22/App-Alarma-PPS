import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LoginProvider from "./context/LoginProvider";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigation/MainNavigator";

const App = () => {
  return (
    <LoginProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </LoginProvider>
  );
};

export default App;
