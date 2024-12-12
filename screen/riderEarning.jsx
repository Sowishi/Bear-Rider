import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const RiderEarning = ({ route }) => {
  const { transactions } = route?.params || [];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const calculateEarnings = () => {
    // Filter transactions by selected date
    const filteredByDate = transactions.filter((item) => {
      const transactionDate = new Date(item.createdAt.seconds * 1000); // Assuming Firestore timestamp format
      return (
        transactionDate.toDateString() === selectedDate.toDateString() &&
        (item.paymentMethod === "Cash" || item.paymentMethod === "Bear Wallet")
      );
    });

    const totalAmount = filteredByDate.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const remitByRider = totalAmount * 0.3;
    const riderEarnings = totalAmount * 0.7;

    return { totalAmount, remitByRider, riderEarnings };
  };

  const { totalAmount, remitByRider, riderEarnings } = calculateEarnings();

  // Handle date change for DateTimePicker
  const handleDateChange = (event, selected) => {
    setIsDatePickerVisible(false); // Hide date picker after selection
    if (selected) setSelectedDate(selected); // Update selected date
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rider Earnings</Text>

      {/* Date Picker Button */}
      <View style={styles.datePickerContainer}>
        <Button
          title={`Select Date: ${selectedDate.toDateString()}`}
          onPress={() => setIsDatePickerVisible(true)}
        />
      </View>

      {/* Show DateTimePicker */}
      {isDatePickerVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleDateChange}
        />
      )}

      {/* Display Total Amount */}
      <View style={styles.row}>
        <Text style={styles.label}>Total Amount:</Text>
        <Text style={styles.value}>₱{totalAmount.toFixed(2)}</Text>
      </View>

      {/* Display Remit by Rider */}
      <View style={styles.row}>
        <Text style={styles.label}>Remit by Rider (30%):</Text>
        <Text style={{ color: "red" }}>₱{remitByRider.toFixed(2)}</Text>
      </View>

      {/* Display Rider Earnings */}
      <View style={styles.row}>
        <Text style={styles.label}>Rider Earnings (70%):</Text>
        <Text style={{ color: "green" }}>₱{riderEarnings.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  datePickerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
  },
});

export default RiderEarning;
