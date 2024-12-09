import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const PopupModal = ({
  open,
  handleClose,
  handleConfirm,
  onChangeText,
  setCancellationReason,
  children,
}) => {
  const handleCancel = () => {
    // Optionally log or handle the cancellation reason here
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
          <View style={styles.modalView}>{children}</View>
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
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#B80B00",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: "black",
  },
  buttonText: {
    color: "white",
  },
});

export default PopupModal;
