import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Animated,
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
    }, 3000);
    spring();
  }, []);
  let springValue = new Animated.Value(0.3);

  const spring = () => {
    springValue.setValue(0.3);
    Animated.spring(springValue, {
      toValue: 1,
      friction: 0.8,
      useNativeDriver: false,
    }).start(() => {
      spring();
    });
  };

  return (
    <View
      style={{
        backgroundColor: "#06707A",
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Animated.View style={{ transform: [{ scale: springValue }] }}>
        <Text style={{ textAlign: "center", color: "black", fontSize: 35 }}>
          Herik Arismendy
        </Text>
        <Text style={{ textAlign: "center", color: "black", fontSize: 35 }}>
          División 4a
        </Text>
        <View
          style={{
            width: "100%",
            height: Dimensions.get("window").height * 0.3,
            marginTop: 20,
          }}
        >
          <Image
            source={require("../assets/logos/iconlogo.png")}
            style={{
              width: "100%", //Dimensions.get("window").width * 0.8,
              height: "100%",
              resizeMode: "contain",
            }}
          />
        </View>
      </Animated.View>
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
