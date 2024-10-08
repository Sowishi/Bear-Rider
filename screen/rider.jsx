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
import * as Location from "expo-location";
import { useSmokeContext } from "../utils/appContext";
import licensePhoto from "../components/Group 43.png";
import cameraPhoto from "../assets/camera-icon-logo-template-illustration-design-vector-eps-10-removebg-preview 1.png";
import documentPhoto from "../assets/Group 39382.png";
import AntDesign from "@expo/vector-icons/AntDesign";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Loader from "../components/loader";
import { TouchableOpacity } from "react-native-gesture-handler";
import useAddRider from "../hooks/useAddRider";
import TermsAndConditions from "../components/TermsAndConditions";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CameraButton from "../components/cameraButton";
import DisclosurePage from "../components/disclosurePage";

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
    setFrontLicense,
    setBackLicense,
    setOR,
    setCR,
    setClearance,
    setSelfie,
  } = useSmokeContext();

  const handleValidateForms = async () => {
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
    return (
      <DisclosurePage
        accept={accept}
        setAccept={setAccept}
        disclosure={disclosure}
        setDisclosure={setDisclosure}
      />
    );
  }

  if (documents) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {loading && <Loader title="Uploading you documents, please wait..." />}
        <StatusBar backgroundColor={"white"} style="dark" />

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
                  <CameraButton
                    navigation={navigation}
                    type={"frontLicense"}
                    removeEvent={setFrontLicense}
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
                  <CameraButton
                    navigation={navigation}
                    type={"backLicense"}
                    removeEvent={setBackLicense}
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
                  <CameraButton
                    navigation={navigation}
                    type={"OR"}
                    removeEvent={setOR}
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
                  <CameraButton
                    navigation={navigation}
                    type={"CR"}
                    removeEvent={setCR}
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
                  <CameraButton
                    navigation={navigation}
                    type={"clearance"}
                    removeEvent={setClearance}
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
                  <CameraButton
                    navigation={navigation}
                    type={"selfie"}
                    removeEvent={setSelfie}
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
