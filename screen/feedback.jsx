import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import useCrudTransaction from "../hooks/useCrudTransaction";
import Toast from "react-native-toast-message";

const FeedBack = ({ route, navigation }) => {
  const [feedback, setFeedback] = useState("");
  const { data } = route?.params || {};

  const { addFeedback } = useCrudTransaction();

  const handleSubmit = () => {
    // Handle feedback submission
    addFeedback(data, feedback);
    Toast.show({ type: "success", text1: "Successfully submitted" });
    navigation.navigate("main");
    setFeedback(""); // Clear the input after submission
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25, marginBottom: 10 }}>How's your rider?</Text>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={{ uri: data.rider.selfieUrl }} // Replace with rider image URL
          style={styles.image}
        />
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          {data.rider.firstName + " " + data.rider.lastName}
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Write your feedback here..."
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("main");
          }}
          style={{
            width: "40%",
            backgroundColor: "#B80B0099",
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
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleSubmit();
          }}
          style={{
            width: "40%",
            backgroundColor: "#B80B00",
            paddingVertical: 15,
            marginTop: 20,
            borderRadius: 20,
            marginTop: 30,
            marginLeft: 10,
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
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    textAlignVertical: "top",
  },
});

export default FeedBack;
