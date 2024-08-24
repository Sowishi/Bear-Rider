import { Image, ScrollView, Text, TextInput, View } from "react-native";
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

  const { addUser } = useAddUser();
  const { setCurrentUser } = useSmokeContext();

  const handleValidateForms = () => {
    let isFormsFilled = true;
    for (let key in forms) {
      if (key !== "middleName" && forms[key].length < 1) {
        isFormsFilled = false;
      }
    }

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
    addUser(forms);
    Toast.show({
      type: "success",
      text1: "Registration complete you can now login",
    });
    setSteps(2);
    setCurrentUser(forms);
    AsyncStorage.setItem("user", JSON.stringify(forms));
  };

  const handleChange = (inputName, text) => {
    const output = { ...forms, [inputName]: text };
    setForms(output);
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
      <StatusBar backgroundColor={"white"} style="dark" />
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
                onChangeText={(text) => handleChange("firstName", text)}
                placeholder="First Name"
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
                onChangeText={(text) => handleChange("middleName", text)}
                placeholder="Middle Name (Optional)"
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
                onChangeText={(text) => handleChange("lastName", text)}
                placeholder="Last Name"
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
          >
            <Button
              event={handleValidateForms}
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
              event={() => navigation.navigate("main")}
              bgColor={"#B80B00"}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Register;
