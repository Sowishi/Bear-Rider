import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Camera } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/button";
import { useSmokeContext } from "../utils/appContext";
import * as ImageManipulator from "expo-image-manipulator";
import AntDesign from "@expo/vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import Scanner from "../assets/scanner.json";
export default function BearCamera({ navigation, type, facing }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const {
    setFrontLicense,
    setSelfie,
    setBackLicense,
    setOR,
    setCR,
    setClearance,
  } = useSmokeContext();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>We need your permission to show the camera</Text>
        <Button
          bgColor={"#003082"}
          event={requestPermission}
          text="grant permission"
        />
      </View>
    );
  }

  const getCameraText = () => {
    if (type == "frontLicense") {
      return "Please take a clear photo of your front license";
    }

    if (type == "backLicense") {
      return "Please take a clear photo of your back license";
    }

    if (type == "OR") {
      return "Please take a clear photo of your official receipt";
    }
    if (type == "CR") {
      return "Please take a clear photo of your certificate of recognition";
    }

    if (type == "clearance") {
      return "Please take a clear photo of your goverment clearance";
    }

    if (type == "selfie") {
      return "Please take a clear photo of yourself in light room";
    }
  };

  return (
    <View style={{ position: "relative" }}>
      <CameraView
        ref={(ref) => setCameraRef(ref)}
        style={{ height: "100%" }}
        facing={type == "selfie" ? "front" : "back"}
      ></CameraView>

      <View
        style={{
          position: "absolute",
          width: "100%",
          top: 50,
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20, color: "#fefefe99", textAlign: "center" }}>
          {getCameraText()}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          width: "100%",
          top: "30%",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LottieView
          autoPlay
          style={{ width: 300, height: 300 }}
          source={Scanner}
        ></LottieView>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{ padding: 30 }}
          onPress={async () => {
            if (cameraRef) {
              const photo = await cameraRef.takePictureAsync();
              const resizedImage = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ resize: { width: 500 } }],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
              );
              if (type == "frontLicense") {
                setFrontLicense(resizedImage.uri);
              }
              if (type == "backLicense") {
                setBackLicense(resizedImage.uri);
              }

              if (type == "OR") {
                setOR(resizedImage.uri);
              }

              if (type == "CR") {
                setCR(resizedImage.uri);
              }

              if (type == "clearance") {
                setClearance(resizedImage.uri);
              }
              if (type == "selfie") {
                setSelfie(resizedImage.uri);
              }

              navigation.navigate("Rider");
              // Handle the photo URI, e.g., display it or upload it
            }
          }}
        >
          <AntDesign name="camera" size={45} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
