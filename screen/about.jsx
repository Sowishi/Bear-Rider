import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/button";
import { LinearGradient } from "expo-linear-gradient";
import LineComponent from "../components/line";
import TitleComponent from "../components/titleComponent";
import LottieView from "lottie-react-native";
import { useSmokeContext } from "../utils/appContext";
import { showToast } from "../components/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import BottomModal from "../components/bottomModal";
import { useState } from "react";
import * as Updates from "expo-updates";

const About = ({ navigation }) => {
  const { updateAuth, smoke, updateUid, auth, uid } = useSmokeContext();
  const [show, setShow] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor={"transparent"} style="light" />
      <LinearGradient
        colors={["#4C3488", "#344854", "#222222"]}
        style={{
          flex: 1.5,
          paddingHorizontal: 15,
          paddingVertical: 30,
        }}
      >
        <BottomModal
          closeModal={() => setShow(false)}
          heightPx={350}
          modalVisible={show}
        >
          <View style={{ flex: 1, width: "100%" }}>
            <View style={{ paddingHorizontal: 10, marginTop: 30 }}>
              <Text style={{ color: "gray", marginBottom: 3 }}>Device UID</Text>
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
                {uid !== undefined && (
                  <TextInput
                    value={uid !== null ? uid.toString() : "Unknown"}
                    editable={false}
                    style={{
                      flex: 1,
                      paddingVertical: 9,
                      paddingHorizontal: 10,
                    }}
                  />
                )}
              </View>
            </View>
            <View></View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Button
                navigation={navigation}
                event={async () => {
                  showToast("success", "Logging out, please wait...");
                  await AsyncStorage.removeItem("user");
                  await Updates.reloadAsync();
                }}
                icon="login"
                text="Log out"
                bgColor={"#0B60B0"}
              />
            </View>
          </View>
        </BottomModal>
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            flexDirection: "row",
            backgroundColor: "#0C2D57",
            padding: 8,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white" }}> ALZHEITECH © 2024 </Text>
          <TouchableOpacity onPress={() => setShow(true)}>
            <FontAwesome name="gear" size={27} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <TitleComponent title={"ALZHEITECH"} noBG={true} />
          <Text
            style={{
              textAlign: "center",
              marginVertical: 10,
              color: "white",
            }}
          >
            AN ALZHEIMER’S MULTIFUNCTIONAL ARDUINO-BASED AND ESP IOT SYSTEM
            EMERGENCY NECKLACE WITH GPS TRACKER, QUICK-RESPONSE CODE AND SMS
            NOTIFICATION
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <LineComponent />
        </View>
        <Text
          style={{
            textAlign: "center",
            marginVertical: 10,
            color: "white",
          }}
        >
          Proponents:{"\n"}
          {"\n"}Asis, Mary Ann
          {"\n"}Benitez, Mark Joven
          {"\n"}Caro, Rizalina
          {"\n"}Juan, Prince Jheck
          {"\n"}Nepomuceno, Lovely
          {"\n"}Par, Jesusa
          {"\n"}Placido, John Paul
          {"\n"}Recreo, Ais
          {"\n"}Rendon, Michael
          {"\n"}Velasco, Bea Emmarie
        </Text>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LottieView
            autoPlay
            style={{
              width: 300,
              height: 250,
              borderWidth: 1,
            }}
            source={require("../assets/team.json")}
          />
        </View>
        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
          Function and Design
        </Text>
        <Text
          style={{
            textAlign: "left",
            marginVertical: 10,
            color: "white",
          }}
        >
          The device AlzheiTech, whose main objective is monitoring and tracking
          the Alzheimer's patient and securing an immediate response in case of
          emergency, hence also increasing the patient’s safety. AlzheiTech
          integrates different features and functions such as the Global
          Positioning System (GPS) (1) which tracks and locates the patient, SMS
          (2) Emergency alert system, which notifies and provides necessary
          information. QR Code (3) contains basic information such as the
          contact numbers in which they can communicate with the caretakers or
          relatives in case that someone encounters the patient who got lost.
          The Event Stream Processes (ESP) Basepoint (4) serves as a reference
          for the device, triggering an alarm when it exceeds a designated range
          from the basepoint. This proximity-based alarm system ensured timely
          notifications if the wearable device ventured too far from the
          established distance threshold. Then, a custom-made Application (5)
          was developed, exclusive for use to provide the necessary profile,
          collect and receive information from the GPS. Eventually, the
          information gathered using the mentioned features was processed by
          AlzhieTech to provide a location and information about the patient
          with Alzheimer's.
        </Text>
        {/* <Text
          style={{
            textAlign: "left",
            marginVertical: 10,
            color: "white",
          }}
        >
          SINFERNO's IoT framework ensures real-time monitoring of environmental
          conditions, allowing for the swift identification of potential fire
          hazards. This capability enables proactive responses, ensuring that
          emerging fires are detected promptly, and mitigation measures can be
          swiftly implemented.
        </Text>
        <Text
          style={{
            textAlign: "left",
            marginVertical: 10,
            color: "white",
          }}
        >
          Beyond its exceptional fire detection capabilities, SINFERNO excels in
          the realm of fire suppression. The system is designed to deploy a
          range of effective countermeasures, including the strategic release of
          water or specialized fire extinguishing agents. This dynamic approach
          creates an immediate and robust barrier against fire spread,
          mitigating potential damage and safeguarding property.
        </Text>
        <Text
          style={{
            textAlign: "left",
            marginVertical: 10,
            color: "white",
          }}
        >
          What makes SINFERNO truly innovative is its adaptability. The system
          empowers property owners to choose the suppression system substance
          based on their judgment and specific requirements. This customization
          feature allows for tailoring the system to unique needs, amplifying
          its effectiveness in enhancing fire safety strategies.
        </Text>
        <Text
          style={{
            textAlign: "left",
            marginVertical: 10,
            color: "white",
          }}
        >
          SINFERNO is not merely a technological advancement; it's a
          comprehensive solution that transforms fire safety into a personalized
          and proactive experience. By seamlessly integrating advanced
          technology with user-driven customization, SINFERNO sets a new
          standard for safety and protection in the face of potential fire
          emergencies.
        </Text> */}
      </LinearGradient>
    </ScrollView>
  );
};

export default About;
