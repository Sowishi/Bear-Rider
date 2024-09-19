import { Image, ScrollView, Text, TextInput, View } from "react-native";
import bear2 from "../assets/Welcome.png";
import { StatusBar } from "expo-status-bar";
import Button from "../components/button";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import useAddUser from "../hooks/useAddUser";
import { useSmokeContext } from "../utils/appContext";
import BearCamera from "../components/BearCamera";
import licensePhoto from "../components/Group 43.png";
import cameraPhoto from "../assets/camera-icon-logo-template-illustration-design-vector-eps-10-removebg-preview 1.png";

import Camera from "./camera";

import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Rider = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [forms, setForms] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { addUser } = useAddUser();
  const { setCurrentUser, license, selfie } = useSmokeContext();

  const handleValidateForms = async () => {
    const licenseUrl = await handleUploadImage(license);
    let isFormsFilled = true;

    if (!isFormsFilled) {
      Toast.show({ type: "error", text1: "Please fill all the fields" });
      return;
    }
    const phoneNumber = forms.phoneNumber;

    if (!(phoneNumber.startsWith("09") && phoneNumber.length === 11)) {
      Toast.show({
        type: "error",
        text1: "Invalid Phone Number",
      });
      return;
    }

    if (forms.password !== forms.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password does not match",
      });
      return;
    }
  };

  const handleChange = (inputName, text) => {
    const output = { ...forms, [inputName]: text };
    setForms(output);
  };

  const handleUploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob(); // Convert the image into a Blob
      const storageRef = ref(storage, "images/" + new Date().getTime()); // Firebase storage reference

      // Upload the Blob to Firebase Storage
      const uploadTask = await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      return downloadURL;
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  console.log(license, "f");

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor={"white"} style="dark" />
      <View
        style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          style={{ width: 150, height: 150, objectFit: "contain" }}
          source={bear2}
        />
      </View>
      <ScrollView
        style={{
          flex: 1,
          marginHorizontal: 25,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Step 1 */}
        <View>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Become a Rider
          </Text>
          <View
            style={{
              flex: 1,
              paddingBottom: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 3,
                paddingHorizontal: 10,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <TextInput
                onChangeText={(text) => handleChange("fullName", text)}
                placeholder="Full Name"
                style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 3,
                paddingHorizontal: 10,
                marginTop: 20,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <TextInput
                keyboardType="numeric"
                onChangeText={(text) => handleChange("phoneNumber", text)}
                placeholder="Phone Number:  Start with - 09-xxx"
                style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 3,
                paddingHorizontal: 10,
                marginTop: 20,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <TextInput
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Email"
                style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 3,
                paddingHorizontal: 10,
                marginTop: 20,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <TextInput
                secureTextEntry
                onChangeText={(text) => handleChange("password", text)}
                placeholder="Password"
                style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 3,
                paddingHorizontal: 10,
                marginTop: 20,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <TextInput
                secureTextEntry
                onChangeText={(text) => handleChange("confirmPassword", text)}
                placeholder="Confirm Password"
                style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          ></View>
        </View>

        {/* Step 2 */}
        <View>
          <>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              Delivery and Transportation Service
            </Text>
            <Text style={{ marginTop: 5, color: "gray" }}>
              this service requires a rider’s non-professional & professional
              driver’s license
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 15, marginVertical: 20 }}
              >
                Upload your driver’s License ID
              </Text>
              {!license && (
                <Image
                  style={{ width: 150, height: 150, objectFit: "contain" }}
                  source={licensePhoto}
                />
              )}
              {license && (
                <Image
                  style={{ width: 300, height: 300 }}
                  source={{ uri: license }}
                />
              )}
              <Button
                event={() => navigation.navigate("Camera", { type: "license" })}
                text={!license ? "Open Camera" : "Retake Photo"}
                bgColor={"#003082"}
              />
            </View>
          </>
          <>
            <Text style={{ fontSize: 25, fontWeight: "bold", marginTop: 20 }}>
              Capture your selfie{" "}
            </Text>
            <Text style={{ marginTop: 5, color: "gray" }}>
              Please take a clear, well-lit photo of yourself for verification.
              Ensure your face is fully visible, without any obstructions like
              hats or sunglasses. This photo will be used for your rider
              profile.
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 15, marginVertical: 20 }}
              >
                Upload your selfie
              </Text>
              {!selfie && (
                <Image
                  style={{ width: 150, height: 150, objectFit: "contain" }}
                  source={cameraPhoto}
                />
              )}
              {selfie && (
                <Image
                  style={{ width: 300, height: 300 }}
                  source={{ uri: selfie }}
                />
              )}
              <Button
                event={() => navigation.navigate("Camera", { type: "selfie" })}
                text={!license ? "Open Camera" : "Retake Photo"}
                bgColor={"#003082"}
              />
            </View>
          </>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Button
            width={400}
            event={handleValidateForms}
            text="Become a rider"
            bgColor={"red"}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Rider;
