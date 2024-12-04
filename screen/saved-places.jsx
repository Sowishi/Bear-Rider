import { View, Text, Image } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import EmptyList from "../components/emptyList";
import { TouchableOpacity } from "react-native";

const SavedPlaces = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <StatusBar style="dark" />

      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Saved Places</Text>
      <Text>Start adding your saved places to access them faster.</Text>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <EmptyList title={"There's no saved places yet"} />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#AA2D31",
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Add a new place
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SavedPlaces;
