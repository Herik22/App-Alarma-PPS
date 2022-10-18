import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Vibration,
} from "react-native";
import { Gyroscope } from "expo-sensors";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";

export default function PruebaGyroscope() {
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
        }
        if (gyroscopeData.z > 1) {
          console.log("izquierda ", gyroscopeData);
          takePicture();
          emitirSonido("left");

          //playSound('izq')
        }
        if (gyroscopeData.x > 1) {
          console.log("up CELULAR VERTICAL ", gyroscopeData);
          emitirSonido("vertical");
          Vibration.vibrate(10000);
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

      const source = data.uri;

      if (source) {
        await cameraRef.current.pausePreview();

        setIsPreview(true);

        console.log("picture source", source);
      }
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

    /*
     switch (movimiento) {
      case "left": //0 IZQUIERDA
        let { sound } = await Audio.Sound.createAsync(
          require("../assets/sonidos/sonidoIzq.mp3")
        );
        setSound(sound);

        console.log("Playing Sound");
        await sound.playAsync();

        break;
      case "rigth": //1   DERECHA
        let { sound_r } = await Audio.Sound.createAsync(
          require("../assets/sonidos/sonidoDerecha.mp3")
        );
        setSound(sound_r);

        console.log("Playing Sound");
        await sound_r.playAsync();

        break;
      case "vertical": // 2 VERTICAL
        let { sound_v } = await Audio.Sound.createAsync(
          require("../assets/sonidos/sonidoVertical.mp3")
        );
        setSound(sound_v);

        console.log("Playing Sound");
        await sound_v.playAsync();
        break;
      case "horizontal": // 3 HORIZONTAL
        let { sound_h } = await Audio.Sound.createAsync(
          require("../assets/sonidos/sonidoHorizontal.mp3")
        );
        setSound(sound_h);

        console.log("Playing Sound");
        await sound_h.playAsync();
        break;

      default:
        let { sound_d } = await Audio.Sound.createAsync(
          require("../assets/sonidos/sonidoDerecha.mp3")
        );
        setSound(sound_d);

        console.log("Playing Sound");
        await sound_d.playAsync();

        break;
    }
     */
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.text}>Gyroscope:</Text>
      <Text style={styles.text}>
        x: {Math.round(x)} y: {Math.round(y)} z: {Math.round(z)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            setAlarm(!alarm);
          }}
          style={styles.button}
        >
          <Text>{alarm ? "On" : "Off"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  text: {
    color: "black",
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").height * 0.6,
    backgroundColor: "gray",
    flexDirection: "row",
  },
  button: {
    width: 100,
    height: 50,
    borderWidth: 1,
    margin: 5,
  },
});
