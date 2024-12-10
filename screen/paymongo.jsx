import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AntDesign from "@expo/vector-icons/AntDesign";
import moment from "moment";
import Constants from "expo-constants";
import { createCheckout, getCheckoutSession } from "../utils/paymongo";
import useCrudTransaction from "../hooks/useCrudTransaction";

const Paymongo = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [paymentData, setPaymentData] = useState();
  const { completeTransaction } = useCrudTransaction();
  const { transaction } = route.params || {};

  const handleCreateCheckout = useCallback(async () => {
    try {
      if (!paymentData) {
        const data = await createCheckout(transaction);
        setPaymentData(data);
        const { checkout_url } = data.attributes;
        if (checkout_url) Linking.openURL(checkout_url);
      } else {
        const { checkout_url } = paymentData.attributes;
        if (checkout_url) Linking.openURL(checkout_url);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  }, [paymentData, transaction]);

  const handleGetCheckout = useCallback(async () => {
    if (!paymentData) return;
    setRefreshing(true);
    try {
      const sessionData = await getCheckoutSession(paymentData.id);
      const status =
        sessionData.data.attributes.payment_intent.attributes.status;
      if (status == "succeeded") {
        completeTransaction(transaction);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error fetching checkout session:", error);
    } finally {
      setRefreshing(false);
    }
  }, [paymentData]);

  const onRefresh = useCallback(() => {
    handleGetCheckout();
  }, [handleGetCheckout]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fefefe" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={navigation.goBack}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <AntDesign name="checkcircle" size={40} color="orange" />
          <Text style={styles.successText}>Payment Pending</Text>
          <Text style={styles.amount}>
            ₱
            {transaction.totalPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction Details</Text>
          {[
            { label: "Payment Method", value: transaction.paymentMethod },
            { label: "Insured", value: transaction.insured ? "Yes" : "No" },
            { label: "Date", value: moment(new Date()).format("LLL") },
            {
              label: "Rider Name",
              value: `${transaction.rider.firstName} ${transaction.rider.lastName}`,
            },
          ].map(({ label, value }, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={handleCreateCheckout} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
    paddingTop: Constants.statusBarHeight,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  successText: {
    color: "orange",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 18,
  },
  amount: {
    fontSize: 35,
    marginTop: 5,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    elevation: 4,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontSize: 15,
    color: "black",
    opacity: 0.6,
  },
  value: {
    fontSize: 15,
    color: "black",
  },
  button: {
    backgroundColor: "#B80B00",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Paymongo;
