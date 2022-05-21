import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import React, { Component, useEffect } from "react";
import { useLogin } from "../context/LoginProvider";
import LottieView from "lottie-react-native";
import splashLottie from "../assets/splash/animated2.json";

export default Splash = (props) => {
  const { navigation } = props;
  const { setisFinishSplash, setIsLogIn } = useLogin();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Login");
    }, 3500);
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#06707A",
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Image
        source={require("../assets/splash/alarm.gif")}
        resizeMode={"cover"}
        style={{
          width: "100%", //Dimensions.get("window").width * 0.8,
          height: Dimensions.get("window").height * 1,
        }}
      />
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: "#06707A",
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <View style={{ flex: 0.6, alignSelf: "center" }}>
        <LottieView
          source={splashLottie}
          style={{ width: 250, height: 250 }}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};
