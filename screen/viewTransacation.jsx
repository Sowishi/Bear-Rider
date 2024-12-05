import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import moment from "moment";

const ViewTransaction = ({ route }) => {
  const { transaction } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const {
    currentUser,
    rider,
    destination,
    origin,
    serviceType,
    totalPrice,
    distance,
    deliveryNotes, // Assuming delivery notes exist
    storeName, // Assuming storeName exists
  } = transaction;

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh logic, in real case you would fetch updated data
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#B80B00" style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Details</Text>
          <View style={styles.row}>
            <Image
              source={{ uri: currentUser.profilePic }}
              style={styles.profilePic}
            />
            <View>
              <Text style={styles.userName}>
                {`${currentUser.firstName} ${currentUser.lastName}`}
              </Text>
              <Text style={styles.userEmail}>{currentUser.email}</Text>
              <Text style={styles.userPhone}>{currentUser.phoneNumber}</Text>
            </View>
          </View>
        </View>

        {/* Rider Info */}
        {rider && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rider Details</Text>
            <View style={styles.row}>
              <Image
                source={{ uri: rider.profilePic }}
                style={styles.profilePic}
              />
              <View>
                <Text style={styles.userName}>
                  {`${rider.firstName} ${rider.lastName}`}
                </Text>
                <Text style={styles.userEmail}>{rider.email}</Text>
                <Text style={styles.userPhone}>{rider.phoneNumber}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Transaction Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <Text style={styles.detailText}>ID: {transaction.id}</Text>
          <Text style={styles.detailText}>
            Service Type:{" "}
            {serviceType === "Pahatod" ? "Transportation" : "Delivery"}
          </Text>
          <Text style={styles.detailText}>
            Date: {moment(transaction.createdAt.seconds * 1000).format("LLL")}
          </Text>
        </View>

        {/* Origin & Destination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <Text style={styles.detailText}>Origin: {origin.address}</Text>
          <Text style={styles.detailText}>
            Destination: {destination.address}
          </Text>
          <Text style={styles.detailText}>Distance: {distance} km</Text>
        </View>

        {/* Delivery Info - Only for Padara (Delivery) ServiceType */}
        {serviceType === "Padara" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            {storeName && (
              <Text style={styles.detailText}>Store: {storeName}</Text>
            )}
            {deliveryNotes && deliveryNotes.length > 0 ? (
              <View>
                <Text style={styles.detailText}>Delivery Notes:</Text>
                {deliveryNotes.map((note, index) => (
                  <Text key={index} style={styles.detailText}>
                    {note.note} x{note.quantity}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.detailText}>
                No delivery notes available.
              </Text>
            )}
          </View>
        )}

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <Text style={styles.detailText}>Total Price: ${totalPrice}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#777",
  },
  userPhone: {
    fontSize: 14,
    color: "#777",
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
});

export default ViewTransaction;
