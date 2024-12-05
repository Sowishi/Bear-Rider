import { View, Text, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSmokeContext } from "../utils/appContext";

const AddSavedPlaces = ({ navigation }) => {
  const { addSaveLocation, currentUser } = useSmokeContext();
  const [locationName, setLocationName] = useState("");

  // Save the location to AsyncStorage
  const savePlace = async () => {
    if (!locationName) {
      alert("Please enter a location name!");
      return;
    }

    try {
      // Retrieve existing saved places
      const existingPlaces = await AsyncStorage.getItem("savedPlaces");
      const places = existingPlaces ? JSON.parse(existingPlaces) : [];

      // Add the new location
      const newPlace = {
        id: Date.now(), // Unique ID for the place
        name: locationName,
        location: addSaveLocation,
        owner: currentUser.id, // Store the owner's name or ID
      };

      const updatedPlaces = [...places, newPlace];

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem("savedPlaces", JSON.stringify(updatedPlaces));

      alert("Place saved successfully!");
      setLocationName(""); // Clear input
      navigation.goBack();
    } catch (error) {
      console.error("Error saving place:", error);
      alert("Failed to save the place.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      <StatusBar style="light" />

      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Add Places</Text>
      <Text>Start adding your saved places to access them faster.</Text>

      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: 20,
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
          <Ionicons name="location" size={24} color="#999999" />
          <TextInput
            onChangeText={(text) => setLocationName(text)}
            value={locationName}
            placeholder="Location Name"
            style={{
              flex: 1,
              paddingVertical: 15,
              paddingHorizontal: 10,
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            padding: 15,
            marginTop: 25,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() =>
            navigation.navigate("bearMap", { type: "savedLocation" })
          }
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: 300,
            }}
          >
            <View
              style={{
                backgroundColor: "black",
                borderRadius: 100,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="location-pin" size={20} color="white" />
            </View>
            <View style={{ marginLeft: 10, width: 200 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Location</Text>
              <Text style={{ fontStyle: "italic", fontSize: 12 }}>
                {addSaveLocation?.address
                  ? addSaveLocation?.address
                  : "Please select location"}
              </Text>
            </View>
          </View>
          <View>
            <AntDesign name="arrowright" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={savePlace}
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
          Save Place
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddSavedPlaces;
