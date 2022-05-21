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
  KeyboardAwareScrollView,
} from "react-native";
import { Input } from "@rneui/base";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import ColorsPPS from "../../utils/ColorsPPS";
import { Formik } from "formik";
import * as yup from "yup";
import { useLogin } from "../../context/LoginProvider";
const ModalContraseñaErronea = (props) => {
  useEffect(() => {}, []);
  const { showModal, setShowModal } = props;

  const { profile } = useLogin();

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        console.log("modal has been close");
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "70%",
            height: "55%",
            alignSelf: "center",
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
            <Text
              style={{
                textAlign: "center",
                color: "black",
                fontWeight: "bold",
              }}
            >
              {" "}
              La contraseña ingresada es incorrecta{" "}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const Colors = {
  colorLetraGris: "#86939E",
  colorfondoCB: "transparent",
  violet: "#5D287E",
  azulPt: "#2E3880",
};

export default ModalContraseñaErronea;
