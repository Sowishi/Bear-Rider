import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import EmptyList from "../components/emptyList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSmokeContext } from "../utils/appContext";

const SavedPlaces = ({ navigation, route }) => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { mode = "defaultmode", type } = route.params || {};
  const { setBookLocation, setDestination } = useSmokeContext();
  // Fetch saved places from AsyncStorage
  const fetchSavedPlaces = async () => {
    try {
      const places = await AsyncStorage.getItem("savedPlaces");
      if (places !== null) {
        setSavedPlaces(JSON.parse(places));
      } else {
        setSavedPlaces([]);
      }
    } catch (error) {
      console.error("Error fetching saved places:", error);
    }
  };

  // Refresh the list
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSavedPlaces();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  // Delete a saved place
  const deletePlace = async (id) => {
    const updatedPlaces = savedPlaces.filter((place) => place.id !== id);
    setSavedPlaces(updatedPlaces);
    try {
      await AsyncStorage.setItem("savedPlaces", JSON.stringify(updatedPlaces));
      Alert.alert("Success", "Location deleted successfully.");
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  // Render each place
  const renderPlace = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (type == "pointA") {
            setBookLocation(item.location);
            navigation.pop(2);
          }
          if (type == "pointB") {
            setDestination(item.location);
            navigation.pop(2);
          }
        }}
        style={{ width: 200 }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ fontSize: 14, color: "#555" }}>
          {item.location.address}
        </Text>
      </TouchableOpacity>
      {mode !== "selecting" && (
        <TouchableOpacity
          onPress={() => deletePlace(item.id)}
          style={{
            backgroundColor: "#D9534F",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <StatusBar style="light" />

      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Saved Places</Text>
      <Text>Access your saved places quickly.</Text>

      <View style={{ flex: 1, marginTop: 20 }}>
        {savedPlaces.length > 0 ? (
          <FlatList
            data={savedPlaces}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPlace}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <EmptyList title={"There's no saved places yet"} />
          </ScrollView>
        )}
      </View>
      {mode !== "selecting" && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("addSavedPlaces");
          }}
          style={{
            backgroundColor: "#AA2D31",
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 10,
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
      )}
    </View>
  );
};

export default SavedPlaces;
