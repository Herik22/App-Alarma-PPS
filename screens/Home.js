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
  const { Email_, isLogIn, setIsLogIn } = useLogin();
  const [loading, setLoading] = useState(false);
  const [loadingMsj, setLoadingMsj] = useState("Cerrando Sesión");
  const [lock, setLock] = useState(false);
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
  const _subscribe = () => {
    console.log("DISPONIBLE GIROSCOPIO?");
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        if (gyroscopeData.z < -1) {
          console.log("derecha: ", gyroscopeData);
          emitirSonido("rigth");
          Vibration.vibrate(10000);
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

          //playSound('up')
        }
        evaluarMovimiento(gyroscopeData);
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
      console.log("picture data", data);
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

  const evaluarMovimiento = (coordenates) => {
    if (coordenates.z < -1) {
      console.log("derecha: ", coordenates);
      emitirSonido("rigth");
    }
    if (coordenates.z > 1) {
      console.log("izquierda ", coordenates);
      emitirSonido("left");
      //playSound('izq')
    }
    if (coordenates.x > 1) {
      console.log("up CELULAR VERTICAL ", coordenates);
      emitirSonido("vertical");
      Vibration.vibrate(10000);
    }

    /*if (coordenates.x < 1) {
      console.log("up CELULAR HORIZONTAL ", coordenates);
      emitirSonido("horizontal");
      //Vibration.vibrate(10000);
    }*/
  };

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
        {/* ICONO CANDADO */}
        <View
          style={{
            marginTop: 10,
            width: "100%",
            height: Dimensions.get("window").height * 0.3,
            borderColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome
            name={lock ? "lock" : "unlock"}
            size={200}
            color="gray"
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
        </TouchableOpacity>

        {/* BTN Cerrar Sesion */}
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
        />
      }
    </View>
  );
};
