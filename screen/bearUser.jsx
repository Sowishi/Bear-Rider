import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSmokeContext } from "../utils/appContext";

const BearUser = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const { currentUser } = useSmokeContext();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.navigate("login");
  };

  const UserInfoRow = ({ icon, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity
          onPress={() => setLogoutModalVisible(true)}
          style={styles.iconButton}
        >
          <MaterialIcons name="logout" size={24} color="#B80B00" />
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profilePicContainer}>
          <Image
            source={{ uri: currentUser.profilePic }}
            style={styles.profilePic}
          />
        </View>
        <UserInfoRow
          icon={<AntDesign name="user" size={20} color="black" />}
          value={currentUser.firstName + " " + currentUser.lastName}
        />

        <UserInfoRow
          icon={<MaterialIcons name="email" size={20} color="black" />}
          value={currentUser.email}
        />
        <UserInfoRow
          icon={<MaterialIcons name="phone" size={20} color="black" />}
          value={currentUser.phoneNumber}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("savedPlaces");
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 13,
          }}
        >
          <UserInfoRow
            icon={<MaterialIcons name="location-pin" size={20} color="black" />}
            value={"Saved Places"}
          />
          <AntDesign name="arrowright" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Wallet");
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 13,
          }}
        >
          <UserInfoRow
            icon={<MaterialIcons name="wallet" size={20} color="black" />}
            value={"Wallet"}
          />
          <AntDesign name="arrowright" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://bearrideexpress.web.app");
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 13,
          }}
        >
          <UserInfoRow
            icon={<MaterialIcons name="web" size={20} color="black" />}
            value={"About Bear Rider"}
          />
          <AntDesign name="arrowright" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.riderButton}
            onPress={() => {
              navigation.navigate("Rider");
            }}
          >
            <Text style={styles.buttonText}>Become a Rider</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Log Out</Text>
              </Pressable>
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
    marginTop: Constants.statusBarHeight,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 30,
  },
  iconButton: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    borderRadius: 100,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  profilePicContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  iconContainer: {
    marginRight: 10,
    backgroundColor: "#E7E7E7",
    padding: 8,
    borderRadius: 10,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  riderButton: {
    backgroundColor: "#B80B00",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: "#B80B00",
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BearUser;
