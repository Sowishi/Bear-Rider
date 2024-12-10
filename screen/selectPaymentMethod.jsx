import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { useSmokeContext } from "../utils/appContext";
import paymentMethods from "../utils/paymentMethods";

const SelectPaymentMethod = ({ navigation }) => {
  const { paymentMethod, setPaymentMethod } = useSmokeContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Payment Method</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.name}
          style={styles.button}
          onPress={() => setPaymentMethod(method.name)}
        >
          <Image source={method.logo} style={styles.logo} />
          <Text style={styles.buttonText}>{method.name}</Text>
          <View style={styles.radioButtonContainer}>
            <View
              style={[
                styles.radioButton,
                paymentMethod === method.name && styles.radioButtonSelected,
              ]}
            />
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => {
          navigation.pop(2);
        }}
        style={styles.confirmButton}
      >
        <Text style={styles.confirmButtonText}>Select {paymentMethod}</Text>
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
  buttonText: {
    fontSize: 16,
    color: "#B80B00",
    marginLeft: 10,
    fontWeight: "600",
    flex: 1,
  },
  logo: {
    width: 30,
    height: 30,
  },
  radioButtonContainer: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#B80B00",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButton: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  radioButtonSelected: {
    backgroundColor: "#B80B00",
  },
  confirmButton: {
    width: "100%",
    backgroundColor: "#B80B00",
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 30,
  },
  confirmButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default SelectPaymentMethod;
