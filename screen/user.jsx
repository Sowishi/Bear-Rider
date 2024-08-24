import { Image, ScrollView, Text, View } from "react-native";
import { useSmokeContext } from "../utils/appContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Button from "../components/button";

const User = () => {
  const { currentUser } = useSmokeContext();

  console.log(currentUser);
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
              style={{ width: 100, height: 100 }}
              source={{ uri: currentUser.profilePic }}
            />
            <Text style={{ fontSize: 25, marginTop: 5, fontWeight: "bold" }}>
              {currentUser.firstName + currentUser.lastName}
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
                <Button width={100} text="Sattelite" bgColor={"#B80B00"} />
                <Button width={100} text="Standard" bgColor={"#003082"} />
              </View>
            </View>

            <View
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
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>Wallet</Text>
              <SimpleLineIcons name="wallet" size={21} color="black" />
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
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>Support</Text>
              <FontAwesome5 name="headset" size={24} color="black" />
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
                style={{ fontSize: 20, marginRight: 10, fontWeight: "bold" }}
              >
                Logout
              </Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Button text="Become a rider" bgColor={"#B80B00"} />
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default User;
