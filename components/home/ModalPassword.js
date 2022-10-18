import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Input } from "@rneui/base";
import { Ionicons, FontAwesome, Foundation } from "@expo/vector-icons";
import ColorsPPS from "../../utils/ColorsPPS";
import { Formik } from "formik";
import * as yup from "yup";
import { useLogin } from "../../context/LoginProvider";

const ModalPassword = (props) => {
  useEffect(() => {
    console.log(profile);
  }, []);
  const {
    showModal,
    setShowModal,
    message,
    lock,
    setLock,
    alarm,
    setAlarm,
    setLoading,
    setLoadingMsj,
    emitirSonido,
    takePicture,
    setFlash,
  } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [modalClave, setModalClave] = useState(false);
  const [msjError, setMsjError] = useState("");
  const { profile } = useLogin();

  const btnLogin = (bgColor, color, txtName, action) => {
    return (
      <TouchableOpacity
        style={{
          height: Dimensions.get("window").height * 0.04,
          width: Dimensions.get("window").width * 0.5,
          borderRadius: 10,
          backgroundColor: bgColor,
          alignSelf: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          action();
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: color,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {" "}
          {txtName}{" "}
        </Text>
      </TouchableOpacity>
    );
  };
  const formLogin = () => {
    const LoginValidation = yup.object({
      password: yup.string().required("Ingresa tu contraseña"),
    });

    return (
      <Formik
        initialValues={{ password: "" }}
        validationSchema={LoginValidation}
        onSubmit={(values, actions) => {
          setLoadingMsj("Desactivando ...");

          if (values.password === profile.clave) {
            setLoading(true);
            console.log("COINCIDE");
            setTimeout(() => {
              setLock(!lock);
              setAlarm(!alarm);
              setShowModal(false);
              actions.resetForm();
              setLoading(false);
            }, 2000);
          } else {
            emitirSonido("contraseñaError");
            Vibration.vibrate(10000);
            setFlash(true);
            setTimeout(function () {
              setFlash(false);
            }, 3000);
            values.password = "";

            return;
          }
        }}
      >
        {(formikprops) => (
          <View style={{ width: "100%", height: "90%" }}>
            <Input
              placeholder="Ingresa Contraseña"
              containerStyle={{ width: "100%", height: "70%" }}
              inputContainerStyle={{
                color: ColorsPPS.gris,
                borderColor: ColorsPPS.gris,
                height: "70%",
              }}
              style={{ width: "100%", padding: 10 }}
              leftIcon={
                <Foundation name="key" size={20} color={ColorsPPS.gris} />
              }
              onChangeText={formikprops.handleChange("password")}
              value={formikprops.values.password}
              name="password"
              secureTextEntry={hidePassword}
              rightIcon={
                <Ionicons
                  name={hidePassword ? "eye" : "eye-off"}
                  size={20}
                  color={ColorsPPS.gris}
                  onPress={() => {
                    setHidePassword(!hidePassword);
                  }}
                />
              }
            />
            {formikprops.touched.password && (
              <View
                style={{
                  width: "100%",
                  margin: 0,
                  justifyContent: "flex-end",
                  paddingHorizontal: 15,
                }}
              >
                <Text style={{ color: "red" }}>
                  {formikprops.touched.password && formikprops.errors.password}
                </Text>
              </View>
            )}
            <View>
              {btnLogin(
                ColorsPPS.gris,
                "white",
                "Desactivar",
                formikprops.handleSubmit
              )}
            </View>
          </View>
        )}
      </Formik>
    );
  };
  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        console.log("modal has been close");
      }}
    >
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        style={{ flex: 1, borderWidth: 0 }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            height: Dimensions.get("window").height,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "70%",
              height: Dimensions.get("window").height * 0.5,

              backgroundColor: "white",
              borderRadius: 20,
              justifyContent: "space-around",
              padding: 10,
              borderColor: ColorsPPS.militarOscuro,
              borderWidth: 1,
            }}
          >
            {/* CLOSE BTN */}
            <View
              style={{
                flex: 0.1,
                width: "100%",
                alignContent: "flex-start",
                justifyContent: "center",
              }}
            >
              <FontAwesome
                name="times"
                size={30}
                color="black"
                onPress={() => {
                  setShowModal(false);
                }}
                style={{ alignSelf: "flex-end", paddingRight: 20 }}
              />
            </View>
            {/* IMG LOGO*/}
            <View
              style={{
                flex: 0.4,
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                borderWidth: 0,
              }}
            >
              <Image
                style={{
                  //flex: 1,
                  alignSelf: "center",
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="contain"
                source={require("../../assets/logos/iconlogo.png")}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                {" "}
                {msjError}{" "}
              </Text>
            </View>
            {/*INPUT*/}
            <View
              style={{
                flex: 0.25,
                width: "100%",
                justifyContent: "center",
                flexDirection: "row",
                borderWidth: 0,
              }}
            >
              {formLogin()}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};
const Colors = {
  colorLetraGris: "#86939E",
  colorfondoCB: "transparent",
  violet: "#5D287E",
  azulPt: "#2E3880",
};

export default ModalPassword;
