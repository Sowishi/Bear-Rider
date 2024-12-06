import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useSmokeContext } from "../utils/appContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

const BearHeader = ({ navigation }) => {
  const { currentUser } = useSmokeContext();
  return (
    <LinearGradient
      colors={["#ff0000", "#8b0000"]} // Adjust colors for your desired red gradient
      style={{
        width: "100%",
        padding: 5,
        paddingHorizontal: 15,
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("bearUser");
          }}
          style={{
            padding: 5,
            borderRadius: 100,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Image
              style={{ width: 45, height: 45 }}
              source={{ uri: currentUser?.profilePic }}
            />
            <View>
              <Text
                style={{
                  marginLeft: 10,
                  fontWeight: "bold",
                  fontSize: 18,
                  color: "white",
                }}
              >
                {currentUser?.firstName + " " + currentUser?.lastName}
              </Text>
              <Text style={{ marginLeft: 10, fontSize: 12, color: "white" }}>
                {currentUser?.role ? currentUser.role : "Customer"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Notification");
          }}
          style={{
            backgroundColor: "#FEF3F7",
            padding: 7,
            borderRadius: 100,
          }}
        >
          <FontAwesome name="bell" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default BearHeader;
