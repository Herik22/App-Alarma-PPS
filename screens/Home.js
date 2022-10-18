import {
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
  Vibration,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useLogin } from "../context/LoginProvider";
import fondo from "../assets/fondos/fondo.png";
import ColorsPPS from "../utils/ColorsPPS";
import LoadingScreen from "../utils/loadingScreen";
import ModalPassword from "../components/home/ModalPassword";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Gyroscope } from "expo-sensors";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";

export default Home = (props) => {
  const { navigation } = props;
  const { setIsLogIn, profile } = useLogin();
  const [loading, setLoading] = useState(false);
  const [loadingMsj, setLoadingMsj] = useState("Cerrando Sesión");
  const [lock, setLock] = useState(false);
  const [flash, setFlash] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const { x, y, z } = data;
  const [subscription, setSubscription] = useState(null);
  const [sound, setSound] = useState(null);
  const [alarm, setAlarm] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const cameraRef = useRef();
  //ORIGINAL EL 1
  const _subscribe1 = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        if (gyroscopeData.z < -1) {
          console.log("derecha: ", gyroscopeData);
          emitirSonido("rigth");
          //Vibration.vibrate(10000);
        }
        if (gyroscopeData.z > 1) {
          console.log("izquierda ", gyroscopeData);
          emitirSonido("left");
          //playSound('izq')
        }
        if (gyroscopeData.x > 1) {
          console.log("up CELULAR VERTICAL ", gyroscopeData);
          emitirSonido("vertical");
          takePicture();
        }

        //evaluarMovimiento(gyroscopeData);
      })
    );
  };

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        if (gyroscopeData.y > 5) {
          console.log("derecha: ", gyroscopeData);
          emitirSonido("rigth");
          //Vibration.vibrate(10000);
        }
        //if (gyroscopeData.z < -5) {
        if (gyroscopeData.y < -5) {
          console.log("izquierda ", gyroscopeData);
          emitirSonido("left");
          //playSound('izq')
        }
        if (gyroscopeData.x > 4) {
          console.log("up CELULAR VERTICAL ", gyroscopeData);
          emitirSonido("vertical");
          setFlash(true);
          setTimeout(function () {
            setFlash(false);
          }, 5000);
        }
        if (gyroscopeData.x < -2) {
          Vibration.vibrate(5000);
          console.log("horizontal", gyroscopeData);
        }

        //evaluarMovimiento(gyroscopeData);
      })
    );
  };
  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  });
  useEffect(() => {
    console.log("profile", profile);
    Gyroscope.setUpdateInterval(100);
    alarm ? _subscribe() : _unsubscribe();

    return () => _unsubscribe();
  }, [alarm]);
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // ********************************  CAMARA SETTINGG ********************************
  const onCameraReady = () => {
    setIsCameraReady(true);
  };
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };

      const data = await cameraRef.current.takePictureAsync(options);
    }
  };
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No access to camera</Text>
      </View>
    );
  }
  //  ********************************************************************************

  const emitirSonido = async (movimiento) => {
    if (movimiento == "left") {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sonidos/sonidoIzq.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    }
    if (movimiento == "rigth") {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sonidos/sonidoDerecha.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    }
    if (movimiento == "vertical") {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sonidos/sonidoVertical.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    }
    if (movimiento == "horizontal") {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sonidos/sonidoHorizontal.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    }
    if (movimiento == "contraseñaError") {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sonidos/fondoPolicia.wav")
      );
      setSound(sound);
      await sound.playAsync();
    }
  };

  return loading ? (
    <LoadingScreen message={loadingMsj} />
  ) : (
    <View
      style={{
        backgroundColor: "Yellow",
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        opacity: modalPassword ? 0.1 : 1,
      }}
    >
      <ImageBackground
        source={fondo}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        {false && (
          <Camera
            ref={cameraRef}
            style={{ flex: 0.001 }}
            type={Camera.Constants.Type.back}
            flashMode={Camera.Constants.FlashMode.on}
            onCameraReady={onCameraReady}
            onMountError={(error) => {
              console.log("cammera error", error);
            }}
          />
        )}
        <Camera
          style={{ width: 1, height: 1, marginBottom: 0, marginLeft: 0 }}
          flashMode={
            flash
              ? Camera.Constants.FlashMode.torch
              : Camera.Constants.FlashMode.off
          }
        >
          <View>
            <TouchableOpacity
              onPress={() => setFlash(!flash)}
            ></TouchableOpacity>
          </View>
        </Camera>
        {/* ICONO CANDADO */}
        <View
          style={{
            width: "100%",
            height: Dimensions.get("window").height * 0.3,
            borderColor: "white",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            borderWidth: 0,
          }}
        >
          <FontAwesome
            name={lock ? "lock" : "unlock"}
            size={150}
            color="white"
          />
        </View>

        {/* BTN ACTIVAR-BLOQUEAR */}
        <TouchableOpacity
          style={{
            width: Dimensions.get("window").width * 0.8,
            height: Dimensions.get("window").height * 0.5,
            backgroundColor: !lock ? "green" : "red",
            borderRadius: 20,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            // navigation.navigate("gyroscope");
            if (lock) {
              setModalPassword(!modalPassword);
            } else {
              setAlarm(!alarm);
              setLock(!lock);
            }
          }}
        >
          {!lock && (
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                color: lock ? "black" : "white",
              }}
            >
              {lock ? "DESACTIVAR ALARMA " : "ACTIVAR ALARMA"}
            </Text>
          )}
          {lock && (
            <Image
              source={{
                uri: "https://c.tenor.com/EDeg5ifIrjQAAAAC/alarm-better-discord.gif",
              }}
              style={{ width: "100%", height: "100%", borderRadius: 20 }}
            />
          )}
        </TouchableOpacity>

        {/* BTN Cerrar Sesion */}
        {!lock && (
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                width: Dimensions.get("window").width * 0.3,
                height: Dimensions.get("window").height * 0.05,
                backgroundColor: ColorsPPS.verderOliva,
                borderRadius: 20,
                borderWidth: 0,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                margin: 20,
              }}
              onPress={() => {
                setLoadingMsj("Cerrando Sesión ...");
                setLoading(true);
                setTimeout(() => {
                  setIsLogIn(false);
                  navigation.navigate("Login");
                  setLoading(false);
                }, 2000);
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Cerrar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>

      {
        <ModalPassword
          showModal={modalPassword}
          setShowModal={setModalPassword}
          message={"modal PASSWORD"}
          lock={lock}
          setLock={setLock}
          alarm={alarm}
          setAlarm={setAlarm}
          setLoading={setLoading}
          setLoadingMsj={setLoadingMsj}
          emitirSonido={emitirSonido}
          takePicture={takePicture}
          setFlash={setFlash}
        />
      }
    </View>
  );
};
