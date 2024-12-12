import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import bear2 from "../assets/bear2.png";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/button";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import useAddUser from "../hooks/useAddUser";
import { useSmokeContext } from "../utils/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const Register = ({ navigation }) => {
  const [steps, setSteps] = useState(1);
  const [location, setLocation] = useState(null);
  const [forms, setForms] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [code, setCode] = useState();
  const [otp, setOtp] = useState();

  const { addUser } = useAddUser();
  const { setCurrentUser } = useSmokeContext();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleValidateForms = () => {
    // Validate required fields except "middleName"
    const isFormsFilled = Object.keys(forms).every(
      (key) => key === "middleName" || forms[key].trim().length > 0
    );

    if (!isFormsFilled) {
      Toast.show({ type: "error", text1: "Please fill all the fields" });
      return;
    }

    const { phoneNumber, password, confirmPassword, firstName, email } = forms;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid email address.",
      });
      return;
    }

    // Validate phone number format
    if (!(phoneNumber.startsWith("09") && phoneNumber.length === 11)) {
      Toast.show({
        type: "error",
        text1:
          "Invalid Phone Number. It should start with '09' and be 11 digits.",
      });
      return;
    }

    // Check password length
    if (password.length < 8) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 8 characters long.",
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match.",
      });
      return;
    }

    // Prepare user data

    // Move to the next step
    setSteps(2);

    // Uncomment the lines below to handle user data as needed
    // setCurrentUser(userData);
    // await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const handleSendOTP = async () => {
    const res = await fetch(
      `https://api.semaphore.co/api/v4/otp?apikey=03000f1b8631cb27d06d4916fc994d4e&number=${forms.phoneNumber}&message=Thank you for registering with Bear Rider Express! Your one-time OTP is: {otp}`,
      {
        method: "POST",
      }
    );
    const output = await res.json();
    setCode(output[0].code);
  };

  const handleChange = (inputName, text) => {
    const output = { ...forms, [inputName]: text };
    setForms(output);
  };

  const verifyPhone = () => {
    if (parseInt(code) == parseInt(otp)) {
      console.log(forms);
      const userData = {
        ...forms,
        status: "Active",
        cancelCount: 0,
        rejectionReason: "",
        profilePic: `https://avatar.iran.liara.run/public?username=${forms.firstName.trim()}`,
      };
      addUser(userData);
      Toast.show({
        type: "success",
        text1: "Registration complete! You can now login.",
      });
      navigation.navigate("login");
    } else {
      Toast.show({ type: "error", text1: "Invalid OTP" });
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

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar translucent style="dark" />
      <View
        style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          style={{ width: 200, height: 200, objectFit: "contain" }}
          source={bear2}
        />
      </View>
      {steps == 1 && (
        <ScrollView
          style={{
            flex: 1,
            marginHorizontal: 25,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Signup
          </Text>
          <View style={{ flex: 1, paddingBottom: 30 }}>
            {/** First Name */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
                First Name
              </Text>
              <TextInput
                onChangeText={(text) => handleChange("firstName", text)}
                value={forms.firstName}
                placeholder="Enter First Name"
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              />
            </View>

            {/** Middle Name */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
                Middle Name (Optional)
              </Text>
              <TextInput
                onChangeText={(text) => handleChange("middleName", text)}
                value={forms.middleName}
                placeholder="Enter Middle Name"
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              />
            </View>

            {/** Last Name */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
                Last Name
              </Text>
              <TextInput
                onChangeText={(text) => handleChange("lastName", text)}
                value={forms.lastName}
                placeholder="Enter Last Name"
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              />
            </View>

            {/** Phone Number */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
                Phone Number
              </Text>
              <TextInput
                keyboardType="numeric"
                onChangeText={(text) => handleChange("phoneNumber", text)}
                value={forms.phoneNumber}
                placeholder="Start with - 09-xxx"
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              />
            </View>

            {/** Email */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Email</Text>
              <TextInput
                onChangeText={(text) => handleChange("email", text)}
                value={forms.email}
                placeholder="Enter Email"
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              />
            </View>

            {/** Password */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
                Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                  paddingHorizontal: 10,
                }}
              >
                <TextInput
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={(text) => handleChange("password", text)}
                  value={forms.password}
                  placeholder="Enter Password"
                  style={{
                    flex: 1,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                  }}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <FontAwesome
                    name={isPasswordVisible ? "eye" : "eye-slash"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/** Confirm Password */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
                Confirm Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                  paddingHorizontal: 10,
                }}
              >
                <TextInput
                  secureTextEntry={!isConfirmPasswordVisible}
                  onChangeText={(text) => handleChange("confirmPassword", text)}
                  value={forms.confirmPassword}
                  placeholder="Re-enter Password"
                  style={{
                    flex: 1,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                  }}
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                  <FontAwesome
                    name={isConfirmPasswordVisible ? "eye" : "eye-slash"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Button
              event={() => handleValidateForms()}
              text="Proceed"
              bgColor={"#B80B00"}
            />
          </View>
        </ScrollView>
      )}
      {steps == 2 && (
        <View
          style={{
            flex: 1,
            marginHorizontal: 25,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Your Address
          </Text>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {location && (
              <MapView
                style={{ width: 300, height: 200 }}
                showsBuildings
                showsUserLocation
                showsTraffic={true}
                provider={PROVIDER_GOOGLE}
                showsMyLocationButton={true}
                initialRegion={{
                  latitude: 14.0996,
                  longitude: 122.955,
                  latitudeDelta: 0.8,
                  longitudeDelta: 0.5,
                }}
                region={{
                  latitude: location?.coords.latitude,
                  longitude: location?.coords.longitude,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.01,
                }}
              >
                {location && (
                  <Marker
                    draggable
                    coordinate={{
                      latitude: location?.coords.latitude,
                      longitude: location?.coords.longitude,
                    }}
                    title="Current Location"
                    description="This is where you are"
                  />
                )}
              </MapView>
            )}
            <Button
              style={{ marginTop: 30 }}
              text="Confirm Address"
              event={() => {
                setSteps(3);
                handleSendOTP();
              }}
              bgColor={"#B80B00"}
            />
          </View>
        </View>
      )}
      {steps == 3 && (
        <View
          style={{
            flex: 1,
            marginHorizontal: 25,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Phone Number Verification
          </Text>
          <Text style={{ color: "grey", fontSize: 15, letterSpacing: 1 }}>
            We will send you a one-time password to this mobile number
            <Text style={{ color: "blue" }}> {forms.phoneNumber}</Text>
          </Text>

          <>
            <View style={{ marginTop: 40 }}>
              <TextInput
                onChangeText={(text) => setOtp(text)}
                keyboardType="numeric"
                style={{
                  textAlign: "center",
                  borderRadius: 50,
                  paddingVertical: 25,
                  fontSize: 40,
                  letterSpacing: 20,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.32,
                  shadowRadius: 5.46,

                  elevation: 9,
                  backgroundColor: "white",
                }}
              ></TextInput>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Button
                style={{ marginTop: 30 }}
                text="Verify Phone Number"
                event={verifyPhone}
                bgColor={"#B80B00"}
              />
            </View>
          </>
        </View>
      )}
    </View>
  );
};

export default Register;
