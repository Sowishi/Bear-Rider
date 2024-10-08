import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
import documentPhoto from "../assets/Group 39382.png";
import Camera from "./camera";
import riderDisclosure from "../assets/Group 39398.png";
import riderNeeds from "../assets/Group 39399.png";
import AntDesign from "@expo/vector-icons/AntDesign";

import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import SelectDropdown from "react-native-select-dropdown";
import Loader from "../components/loader";
import { TouchableOpacity } from "react-native-gesture-handler";
import useAddRider from "../hooks/useAddRider";
import TermsAndConditions from "../components/TermsAndConditions";

const Rider = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [disclosure, setDisclosure] = useState("needs");
  const [documents, setDocuments] = useState();
  const [accept, setAccept] = useState(false);

  const { addRider } = useAddRider();
  const {
    setCurrentUser,
    frontLicense,
    selfie,
    currentUser,
    backLicense,
    OR,
    CR,
    clearance,
  } = useSmokeContext();

  const handleValidateForms = async () => {
    console.log(frontLicense, backLicense, OR, CR, clearance, selfie);
    setLoading(true);
    const frontLicenseUrl = await handleUploadImage(frontLicense);
    const backLicenseUrl = await handleUploadImage(backLicense);
    const ORUrl = await handleUploadImage(OR);
    const CRUrl = await handleUploadImage(CR);
    const clearanceUrl = await handleUploadImage(clearance);
    const selfieUrl = await handleUploadImage(selfie);

    const userData = {
      ...currentUser,
      frontLicenseUrl,
      backLicenseUrl,
      ORUrl,
      CRUrl,
      clearanceUrl,
      selfieUrl,
      role: "Rider",
      riderStatus: "Pending",
    };
    addRider(userData, currentUser);
    Toast.show({
      type: "success",
      text1: "Uploaded Successfully!",
    });
    navigation.navigate("Home");
    setLoading(false);
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

  if (disclosure) {
    if (disclosure == "needs") {
      return (
        <View
          style={{ flex: 1, backgroundColor: "white", paddingVertical: 10 }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 27, fontWeight: "bold", textAlign: "center" }}
            >
              What you need
            </Text>
            <Image
              style={{ objectFit: "contain", width: 400, height: 400 }}
              source={riderNeeds}
            />
            <View style={{ flexDirection: "row" }}>
              <Button
                width={100}
                event={() => setDisclosure("become")}
                text={"Back"}
                bgColor={"#B80B00"}
              />
              <Button
                width={100}
                event={() => setDisclosure("terms")}
                text={"Next"}
                bgColor={"#003082"}
              />
            </View>
          </View>
        </View>
      );
    }
    if (disclosure == "terms") {
      return (
        <View
          style={{ flex: 1, backgroundColor: "white", paddingVertical: 10 }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 27, fontWeight: "bold", textAlign: "center" }}
            >
              Terms and Conditions
            </Text>
            <ScrollView
              style={{
                borderWidth: 2,
                margin: 10,
                marginVertical: 30,
                borderRadius: 10,
                borderColor: "#1C2873",
              }}
            >
              <TermsAndConditions />
            </ScrollView>
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Agree and continue</Text>
              <TouchableOpacity
                onPress={() => setAccept(!accept)}
                style={{
                  marginLeft: 10,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 5,
                  backgroundColor: accept ? "green" : "grey",
                }}
              >
                <Text style={{ color: "white" }}>
                  Agree{" "}
                  {accept && (
                    <AntDesign name="checkcircle" size={15} color="white" />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Button
                width={100}
                event={() => setDisclosure("needs")}
                text={"Back"}
                bgColor={"#B80B00"}
              />
              <Button
                isDisable={!accept}
                width={100}
                event={() => setDisclosure(false)}
                text={"Next"}
                bgColor={"#003082"}
              />
            </View>
          </View>
        </View>
      );
    }
  }

  if (documents) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {loading && <Loader title="Uploading you documents, please wait..." />}
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
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {/* Step 2 */}
          <View>
            {/* License  */}
            {documents == "license" && (
              <>
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  Delivery and Transportation Service
                </Text>
                <Text style={{ marginTop: 5, color: "gray" }}>
                  this service requires a rider’s non-professional &
                  professional driver’s license
                </Text>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginVertical: 20,
                    }}
                  >
                    Upload your driver’s License ID (Front)
                  </Text>
                  {!frontLicense && (
                    <Image
                      style={{ width: 150, height: 150, objectFit: "contain" }}
                      source={licensePhoto}
                    />
                  )}
                  {frontLicense && (
                    <Image
                      style={{ width: 300, height: 300 }}
                      source={{ uri: frontLicense }}
                    />
                  )}
                  <Button
                    event={() =>
                      navigation.navigate("Camera", {
                        type: "frontLicense",
                        facing: false,
                      })
                    }
                    text={!frontLicense ? "Open Camera" : "Retake Photo"}
                    bgColor={"#003082"}
                  />
                </View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginVertical: 20,
                    }}
                  >
                    Upload your driver’s License ID (Back)
                  </Text>
                  {!backLicense && (
                    <Image
                      style={{ width: 150, height: 150, objectFit: "contain" }}
                      source={licensePhoto}
                    />
                  )}
                  {backLicense && (
                    <Image
                      style={{ width: 300, height: 300 }}
                      source={{ uri: backLicense }}
                    />
                  )}
                  <Button
                    event={() =>
                      navigation.navigate("Camera", {
                        type: "backLicense",
                        facing: false,
                      })
                    }
                    text={!backLicense ? "Open Camera" : "Retake Photo"}
                    bgColor={"#003082"}
                  />
                </View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Button
                    isDisable={!frontLicense || !backLicense}
                    width={400}
                    event={() => {
                      setDocuments("orcr");
                    }}
                    text="Next"
                    bgColor={"#B80B00"}
                  />
                </View>
              </>
            )}

            {/* Documents */}
            {documents == "orcr" && (
              <>
                <Text
                  style={{ fontSize: 25, fontWeight: "bold", marginTop: 20 }}
                >
                  Official Receipt / Certificate of Registration{" "}
                </Text>
                <Text style={{ marginTop: 5, color: "gray" }}>
                  this service requires a rider’s OR/CR
                </Text>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginVertical: 20,
                    }}
                  >
                    Upload your Official Receipt{" "}
                  </Text>
                  {!OR && (
                    <Image
                      style={{ width: 150, height: 150, objectFit: "contain" }}
                      source={documentPhoto}
                    />
                  )}
                  {OR && (
                    <Image
                      style={{ width: 300, height: 300 }}
                      source={{ uri: OR }}
                    />
                  )}
                  <Button
                    event={() =>
                      navigation.navigate("Camera", {
                        type: "OR",
                        facing: false,
                      })
                    }
                    text={!OR ? "Open Camera" : "Retake Photo"}
                    bgColor={"#003082"}
                  />
                </View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginVertical: 20,
                    }}
                  >
                    Upload your Certificate of Regsitration{" "}
                  </Text>
                  {!CR && (
                    <Image
                      style={{ width: 150, height: 150, objectFit: "contain" }}
                      source={documentPhoto}
                    />
                  )}
                  {CR && (
                    <Image
                      style={{ width: 300, height: 300 }}
                      source={{ uri: CR }}
                    />
                  )}
                  <Button
                    event={() =>
                      navigation.navigate("Camera", {
                        type: "CR",
                        facing: false,
                      })
                    }
                    text={!CR ? "Open Camera" : "Retake Photo"}
                    bgColor={"#003082"}
                  />
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Button
                      isDisable={!OR || !CR}
                      width={400}
                      event={() => {
                        setDocuments("clearance");
                      }}
                      text="Next"
                      bgColor={"#B80B00"}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Clearance */}

            {documents == "clearance" && (
              <>
                <Text
                  style={{ fontSize: 25, fontWeight: "bold", marginTop: 20 }}
                >
                  Government Mandatory Clearance
                </Text>
                <Text style={{ marginTop: 5, color: "gray" }}>
                  this service requires a rider’s non-professional &
                  professional driver’s license
                </Text>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginVertical: 20,
                    }}
                  >
                    Upload your clearance
                  </Text>
                  {!clearance && (
                    <Image
                      style={{ width: 150, height: 150, objectFit: "contain" }}
                      source={documentPhoto}
                    />
                  )}
                  {clearance && (
                    <Image
                      style={{ width: 300, height: 300 }}
                      source={{ uri: clearance }}
                    />
                  )}
                  <Button
                    event={() =>
                      navigation.navigate("Camera", { type: "clearance" })
                    }
                    text={!clearance ? "Open Camera" : "Retake Photo"}
                    bgColor={"#003082"}
                  />
                </View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Button
                    isDisable={!clearance}
                    width={400}
                    event={() => {
                      setDocuments("selfie");
                    }}
                    text="Next"
                    bgColor={"#B80B00"}
                  />
                </View>
              </>
            )}
            {/* Selfie */}

            {documents == "selfie" && (
              <>
                <Text
                  style={{ fontSize: 25, fontWeight: "bold", marginTop: 20 }}
                >
                  Capture your selfie{" "}
                </Text>
                <Text style={{ marginTop: 5, color: "gray" }}>
                  Please take a clear, well-lit photo of yourself for
                  verification. Ensure your face is fully visible, without any
                  obstructions like hats or sunglasses. This photo will be used
                  for your rider profile.
                </Text>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginVertical: 20,
                    }}
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
                    event={() =>
                      navigation.navigate("Camera", {
                        type: "selfie",
                        facing: true,
                      })
                    }
                    text={!selfie ? "Open Camera" : "Retake Photo"}
                    bgColor={"#003082"}
                  />
                </View>

                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Button
                    isDisable={!selfie}
                    width={400}
                    event={handleValidateForms}
                    text="Become a Rider"
                    bgColor={"#B80B00"}
                  />
                </View>
              </>
            )}
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          ></View>
          <Text style={{ textAlign: "center", color: "gray" }}>
            Bear Rider ©2024
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {loading && <Loader title="Uploading you documents, please wait..." />}
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
        contentContainerStyle={{ paddingBottom: 50 }}
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
          <Text style={{ marginVertical: 10, color: "gray" }}>
            Please confirm your credentials below then proceed of becoming a
            rider.
          </Text>
          <View
            style={{
              flex: 1,
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
                editable={false}
                onChangeText={(text) => handleChange("fullName", text)}
                placeholder="Full Name"
                style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
                value={currentUser.firstName + " " + currentUser.lastName}
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
                editable={false}
                value={currentUser.phoneNumber}
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
                value={currentUser.email}
                editable={false}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Email"
                style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
              />
            </View>

            {/* <View
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
            </View> */}
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          ></View>
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
            event={() => setDocuments("license")}
            text="Proceed"
            bgColor={"#B80B00"}
          />
        </View>
        <Text style={{ textAlign: "center", color: "gray" }}>
          Bear Rider ©2024
        </Text>
      </ScrollView>
    </View>
  );
};

export default Rider;
