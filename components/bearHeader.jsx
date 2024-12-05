import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useSmokeContext } from "../utils/appContext";

const BearHeader = ({ navigation }) => {
  const { currentUser } = useSmokeContext();
  return (
    <View
      style={{
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        padding: 5,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("bearUser");
        }}
        style={{
          backgroundColor: "white",
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
            source={{ uri: currentUser.profilePic }}
          />
          <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 18 }}>
            {currentUser?.firstName + " " + currentUser?.lastName}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("bearUser");
        }}
        style={{
          backgroundColor: "white",
          padding: 5,
          borderRadius: 100,
        }}
      ></TouchableOpacity>
    </View>
  );
};

export default BearHeader;
