import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import { useSmokeContext } from "../utils/appContext";

const SelectPaymentMethod = ({ navigation }) => {
  const { paymentMethod, setPaymentMethod } = useSmokeContext();

  const paymentMethods = [
    { name: "Cash", logo: require("../assets/bear.png") },
    { name: "Gcash", logo: require("../assets/bear.png") },
    { name: "Bear Wallet", logo: require("../assets/bear.png") },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Payment Method</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.name}
          style={[
            styles.button,
            paymentMethod === method.name && styles.selectedButton,
          ]}
          onPress={() => setPaymentMethod(method.name)}
        >
          <Image source={method.logo} style={styles.logo} />
          <Text
            style={[
              styles.buttonText,
              paymentMethod === method.name && styles.selectedButtonText,
            ]}
          >
            {method.name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => {
          navigation.pop(2);
        }}
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
          Select {paymentMethod}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderColor: "#B80B00",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  selectedButton: {
    backgroundColor: "#003082",
  },
  buttonText: {
    fontSize: 16,
    color: "#B80B00",
    marginLeft: 10,
    fontWeight: "600",
  },
  selectedButtonText: {
    color: "#fff",
  },
  logo: {
    width: 30,
    height: 30,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    color: "#003082",
    textAlign: "center",
  },
});

export default SelectPaymentMethod;
