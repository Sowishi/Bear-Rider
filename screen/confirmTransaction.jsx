import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import CheckBox from "expo-checkbox"; // For Expo-compatible checkbox
import { useSmokeContext } from "../utils/appContext";
import MapViewDirections from "react-native-maps-directions";
import { Entypo } from "@expo/vector-icons"; // Import Entypo from @expo/vector-icons
import useCrudTransaction from "../hooks/useCrudTransaction";
import Toast from "react-native-toast-message";
import haversineDistance from "../utils/calculateDistance";

const ConfirmTransaction = ({ route, navigation }) => {
  const { serviceType } = route.params || "No Service Type";
  const {
    bookLocation,
    destination,
    currentUser,
    setFindingRider,
    setSelectedTransaction,
  } = useSmokeContext();
  const { addTransaction } = useCrudTransaction();

  // State for the note input and insurance
  const [note, setNote] = useState("");
  const [insuranceChecked, setInsuranceChecked] = useState(false);
  const [distance, setDistance] = useState();
  const chargePerKilometer = 10;
  const baseFare = 30;
  const totalPrice = distance * chargePerKilometer + baseFare;
  useEffect(() => {
    let output = 0;
    if (destination && bookLocation) {
      output = haversineDistance(bookLocation, destination);
    }
    setDistance(output);
  }, [bookLocation, destination]);

  const handleAddTransaction = async () => {
    if (bookLocation && destination) {
      const transaction = {
        origin: {
          latitude: bookLocation?.latitude,
          longitude: bookLocation?.longitude,
          address: bookLocation?.address,
        },
        destination: {
          latitude: destination?.latitude,
          longitude: destination?.longitude,
          address: destination?.address,
        },
        currentUser,
        distance,
        serviceType,
        totalPrice: distance * chargePerKilometer + baseFare,
        remarks: note,
        insured: insuranceChecked,
      };
      setFindingRider(true);
      const output = await addTransaction(transaction);
      setSelectedTransaction(output);
      navigation.navigate("LiveTransaction");
    } else {
      Toast.show({
        type: "info",
        text1: "Please select drop off location",
      });
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* MapView */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: bookLocation.latitude,
          longitude: bookLocation.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
      >
        {/* Markers for the locations */}
        <Marker
          coordinate={bookLocation}
          title="Pickup Location"
          description="Start here"
        />
        <Marker
          coordinate={destination}
          title="Destination"
          description="End here"
          pinColor="#003082"
        />
        <MapViewDirections
          strokeWidth={4}
          strokeColor="#B80B00"
          origin={bookLocation}
          destination={destination}
          apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
        />
      </MapView>
      {/* Service Type */}

      <View style={{ padding: 15 }}>
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {serviceType == "Pahatod"
              ? "Transportation Service"
              : "Delivery Service"}
          </Text>
        </View>

        <View style={styles.addressContainer}>
          <View style={styles.addressRow}>
            <Entypo name="location-pin" size={20} color="#B80B00" />
            <View style={{ marginLeft: 5 }}>
              <Text style={{ fontWeight: "bold", fontSize: 13 }}>
                {serviceType == "Pahatod"
                  ? "Pick Up Address"
                  : "Deliver to Address"}
              </Text>
              <Text style={{ fontSize: 11 }}>{bookLocation.address}</Text>
            </View>
          </View>
          <View style={styles.addressRow}>
            <Entypo name="location-pin" size={20} color="#003082" />
            <View style={{ marginLeft: 5 }}>
              <Text style={{ fontWeight: "bold", fontSize: 13 }}>
                {serviceType == "Pahatod"
                  ? "Drop Off Address"
                  : "Shop to Address"}
              </Text>
              <Text style={{ fontSize: 11 }}>{destination.address}</Text>
            </View>
          </View>
        </View>

        {/* Note Input */}
        <Text style={styles.cardTitle}>Add a Note</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Enter any additional information"
          placeholderTextColor="#888"
          value={note}
          onChangeText={setNote}
          multiline
        />

        {/* Insurance Checkbox */}
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={insuranceChecked}
            onValueChange={setInsuranceChecked}
            color={insuranceChecked ? "#003082" : undefined}
          />
          <Text style={styles.checkboxText}>
            Add insurance to your transactions for extra protection and peace of
            mind.
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 20, marginBottom: 5, fontWeight: "bold" }}>
            Price Breakdown
          </Text>
          {serviceType != "Padara" && (
            <>
              <Text style={{ color: "black", fontSize: 15 }}>
                Base Fare:
                <Text style={{ color: "#FFC30E", fontWeight: "bold" }}>
                  {" "}
                  ₱{baseFare}
                </Text>
              </Text>
              <Text style={{ color: "gray", fontSize: 12, marginBottom: 5 }}>
                This is the minimum cost for initiating the transportation
                service.
              </Text>

              <Text style={{ color: "black", fontSize: 15 }}>
                Fare per Kilometer:
                <Text style={{ color: "#FFC30E", fontWeight: "bold" }}>
                  {parseInt(totalPrice) - baseFare}
                </Text>
              </Text>
              <Text style={{ color: "gray", fontSize: 12, marginBottom: 5 }}>
                This amount is calculated based on the distance to the
                destination.
              </Text>

              <Text
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                Total Fare:
                <Text style={{ color: "#FFC30E" }}>
                  {" "}
                  ₱{parseInt(totalPrice)}
                </Text>
              </Text>
              <Text style={{ color: "gray", fontSize: 12 }}>
                The final amount, including the base fare and the distance
                charge.
              </Text>
            </>
          )}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handleAddTransaction}
          style={{
            width: "100%",
            backgroundColor: "#B80B00",
            paddingVertical: 15,
            marginTop: 20,
            borderRadius: 20,
            marginTop: 30,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  map: {
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  serviceTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: "#333",
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    flex: 1, // Allow text to wrap
  },
  confirmButton: {
    backgroundColor: "#003082",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addressContainer: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
    flex: 1, // Adjust for proper alignment
  },
});

export default ConfirmTransaction;
