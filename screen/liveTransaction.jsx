import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import useCrudTransaction from "../hooks/useCrudTransaction";
import { useSmokeContext } from "../utils/appContext";

const LiveTransaction = ({ navigation }) => {
  const { singleData } = useCrudTransaction();
  const { setFindingRider } = useSmokeContext();
  console.log(singleData, "Live Transaction");

  return (
    <View>
      <Text>LiveTransaction</Text>
      <TouchableOpacity
        onPress={() => {
          setFindingRider(false);
          navigation.navigate("drawer");
        }}
        style={{ backgroundColor: "red", padding: 50 }}
      >
        <Text>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LiveTransaction;
