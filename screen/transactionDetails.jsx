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
import useCrudNotification from "../hooks/useCrudNotification";

import Toast from "react-native-toast-message";
import haversineDistance from "../utils/calculateDistance";

const TransactionDetails = ({ route, navigation }) => {
  const { serviceType } = route.params || "No Service Type";
  const { currentUser, userLocation, selectedTransaction } = useSmokeContext();

  const { getTransaction, deleteTransaction, acceptTransaction } =
    useCrudTransaction();
  const { addNotification } = useCrudNotification();
  const [transaction, setTransaction] = useState();

  useEffect(() => {
    getTransaction(selectedTransaction.id, setTransaction);
  }, []);

  const [note, setNote] = useState("");
  const [insuranceChecked, setInsuranceChecked] = useState(false);

  const handleAcceptTransaction = () => {
    acceptTransaction(transaction, currentUser, userLocation);
    addNotification(transaction, currentUser, "accept rider");
    Toast.show({ type: "success", text1: "Successfully accepeted ride." });
  };

  if (transaction) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* MapView */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: transaction.origin.latitude,
            longitude: transaction.origin.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}
        >
          {/* Markers for the locations */}
          <Marker
            coordinate={transaction.origin}
            title="Pickup Location"
            description="Start here"
          />
          <Marker
            coordinate={transaction.destination}
            title="Destination"
            description="End here"
            pinColor="#003082"
          />
          <MapViewDirections
            strokeWidth={4}
            strokeColor="#B80B00"
            origin={transaction.origin}
            destination={transaction.destination}
            apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
          />
        </MapView>
        {/* Service Type */}

        <View style={{ padding: 15 }}>
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {transaction.serviceType == "Pahatod"
                ? "Transportation Service"
                : "Delivery Service"}
            </Text>
          </View>

          <View style={styles.addressContainer}>
            <View style={styles.addressRow}>
              <Entypo name="location-pin" size={20} color="#B80B00" />
              <View style={{ marginLeft: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 13 }}>
                  {transaction.serviceType == "Pahatod"
                    ? "Pick Up Address"
                    : "Deliver to Address"}
                </Text>
                <Text style={{ fontSize: 11 }}>
                  {transaction.origin.address}
                </Text>
              </View>
            </View>
            <View style={styles.addressRow}>
              <Entypo name="location-pin" size={20} color="#003082" />
              <View style={{ marginLeft: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 13 }}>
                  {transaction.serviceType == "Pahatod"
                    ? "Drop Off Address"
                    : "Shop to Address"}
                </Text>
                <Text style={{ fontSize: 11 }}>
                  {transaction.destination.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Note Input */}
          <Text style={styles.cardTitle}>Remarks</Text>
          <TextInput
            editable={false}
            style={styles.noteInput}
            placeholder="Enter any additional information"
            placeholderTextColor="#888"
            value={transaction.remarks}
            onChangeText={setNote}
            multiline
          />

          {/* Insurance Checkbox */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={transaction.insured}
              onValueChange={setInsuranceChecked}
              color={insuranceChecked ? "#003082" : undefined}
            />
            <Text style={styles.checkboxText}>Transaction Insured.</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                width: "50%",
                backgroundColor: "#B80B0099",
                paddingVertical: 15,
                marginTop: 20,
                borderRadius: 20,
                marginTop: 30,
                marginRight: 5,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleAcceptTransaction();
              }}
              style={{
                width: "50%",
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
                  fontSize: 20,
                }}
              >
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
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
    backgroundColor: "#DEDEDE",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: "black",
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

export default TransactionDetails;
