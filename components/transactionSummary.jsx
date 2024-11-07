import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useSmokeContext } from "../utils/appContext";

const TransactionSummary = () => {
  const { sumInfo } = useSmokeContext();
  return (
    <View style={{ width: "100%", flex: 1, paddingVertical: 20 }}>
      {sumInfo && (
        <>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={styles.title}>Payment Sent</Text>
            <AntDesign
              style={{ marginLeft: 5 }}
              name="creditcard"
              size={24}
              color="green"
            />
          </View>
          <View>
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                fontSize: 20,
                color: "gray",
              }}
            >
              Juan Dela Cruz
            </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.label}>Amount Paid:</Text>
            <Text style={styles.value}>₱{sumInfo.totalPrice}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>Bear Rider Wallet</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.label}>Transaction Date:</Text>
            <Text style={styles.value}>{moment(new Date()).format("LLL")}</Text>
          </View>
          <View style={[styles.statusContainer, styles.success]}>
            <Text style={styles.status}>Success</Text>
          </View>
          <View style={styles.disclosureContainer}>
            <Text style={styles.disclosureText}>
              * This payment is processed securely. All transactions are final
              and cannot be refunded once completed. For any issues, please
              contact customer support.
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  details: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusContainer: {
    marginVertical: 10,
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  success: {
    backgroundColor: "#e0f8e0",
    borderColor: "#4caf50",
  },
  failed: {
    backgroundColor: "#f8d7da",
    borderColor: "#dc3545",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disclosureContainer: {
    marginTop: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f8f9fa",
  },
  disclosureText: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
});

export default TransactionSummary;
