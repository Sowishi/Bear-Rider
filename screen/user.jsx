import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSmokeContext } from "../utils/appContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Button from "../components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";

const User = ({ navigation }) => {
  const {
    currentUser,
    setMapView,
    setHistoryModal,
    setWalletModal,
    setConversationModal,
  } = useSmokeContext();

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
      }}
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      {currentUser && (
        <>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              marginVertical: 15,
            }}
          >
            <Image
              style={{ width: 100, height: 100, borderRadius: 200 }}
              source={{
                uri:
                  currentUser.role == "Rider"
                    ? currentUser.selfieUrl
                    : currentUser.profilePic,
              }}
            />
            <Text style={{ fontSize: 25, marginTop: 5, fontWeight: "bold" }}>
              {currentUser.firstName + " " + currentUser.lastName}
            </Text>
            <Text style={{ fontSize: 16, marginTop: 5 }}>
              Role: {currentUser.role ? currentUser.role : "Customer"}
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              width: "100%",
              paddingHorizontal: 20,
              marginTop: 50,
            }}
          >
            <View>
              <Text style={{ fontSize: 15, marginVertical: 5 }}>
                Google Map View
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  event={() => {
                    setMapView("satellite");
                    navigation.navigate("Home");
                  }}
                  width={100}
                  text="Satellite"
                  bgColor={"#B80B00"}
                />
                <Button
                  event={() => {
                    navigation.navigate("Home");
                    setMapView("standard");
                  }}
                  width={100}
                  text="Standard"
                  bgColor={"#003082"}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.closeDrawer();
                navigation.navigate("Home");
              }}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                borderRadius: 10,
                backgroundColor: "white",
                padding: 10,
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginVertical: 15,
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 5 }}>Home</Text>
              <MaterialIcons name="home" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.closeDrawer();
                setHistoryModal(true);
              }}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                borderRadius: 10,
                backgroundColor: "white",
                padding: 10,
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginVertical: 15,
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 5 }}>History</Text>
              <MaterialIcons name="history" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.closeDrawer();
                setWalletModal(true);
              }}
              style={{
                marginVertical: 15,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                borderRadius: 10,
                backgroundColor: "white",
                padding: 10,
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>Wallet</Text>
              <SimpleLineIcons name="wallet" size={21} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.closeDrawer();
                setConversationModal(true);
              }}
              style={{
                marginVertical: 15,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                borderRadius: 10,
                backgroundColor: "white",
                padding: 10,
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>
                Conversation
              </Text>
              <AntDesign name="message1" size={24} color="black" />
            </TouchableOpacity>
            <View
              style={{
                marginVertical: 15,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                borderRadius: 10,
                backgroundColor: "white",
                padding: 10,
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>Feedback</Text>
              <MaterialIcons name="feedback" size={24} color="black" />
            </View>
            <View
              style={{
                marginVertical: 15,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                borderRadius: 10,
                backgroundColor: "white",
                padding: 10,
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                onPress={async () => {
                  await AsyncStorage.removeItem("user");
                  navigation.navigate("login");
                }}
                style={{ fontSize: 20, marginRight: 10, fontWeight: "bold" }}
              >
                Logout
              </Text>
            </View>
            {currentUser.role !== "Rider" && (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Button
                  event={() => navigation.navigate("Rider")}
                  text="Become a rider"
                  bgColor={"#B80B00"}
                />
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default User;
