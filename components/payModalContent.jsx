import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const PayModalContent = ({ price, onConfirm, isRider, handleConfirm }) => {
  return (
    <View style={styles.container}>
      <FontAwesome name="money" size={50} color="#4CAF50" style={styles.icon} />
      <Text style={styles.text}>
        {isRider
          ? "Collect the sum amount of"
          : " Hand over to the rider the sum amount of"}{" "}
        <Text style={styles.price}>₱{parseInt(price)}</Text>.{" "}
        {isRider && "to the customer"}
      </Text>
      {isRider && (
        <View style={styles.buttonContainer}>
          <Button
            title="Confirm Payment"
            color="#4CAF50"
            onPress={handleConfirm}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4, // Shadow for iOS
  },
  icon: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  price: {
    fontWeight: "bold",
    color: "#E53935",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
  },
});

export default PayModalContent;
