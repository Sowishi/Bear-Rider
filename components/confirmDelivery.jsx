import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ConfirmDelivery = ({
  open,
  handleClose,
  handleConfirm,
  text,
  imageUrl,
}) => {
  const [cancellationReason, setCancellationReason] = useState("");

  const handleCancel = () => {
    setCancellationReason(""); // Clear the input field
    handleClose(); // Close the modal
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={handleClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            {/* Image at the Top */}
            <Image
              source={require("../assets/screenAssest/Onboarding.png")}
              style={styles.modalImage}
            />

            {/* Modal Title */}
            <Text style={styles.modalTitle}>Confirm Action</Text>

            {/* Modal Text */}
            <Text style={styles.modalText}>{text}</Text>

            {/* Buttons in Flex Row */}
            <View style={styles.buttonRow}>
              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleCancel}
              >
                <LinearGradient
                  colors={["#B80B00", "#FF4D4D"]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  handleConfirm();
                  setCancellationReason(""); // Clear input if confirmed
                }}
              >
                <LinearGradient
                  colors={["#003082", "#0050A0"]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 40,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003082",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  gradientButton: {
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default ConfirmDelivery;
