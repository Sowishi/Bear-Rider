import { BackHandler, Image, Text, View } from "react-native";
import { useSmokeContext } from "../utils/appContext";
import Button from "../components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DevSettings } from "react-native";
import img from "../assets/O (2) 1.png";

const RiderPending = ({ navigation }) => {
  const { currentUser } = useSmokeContext();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={img} />

      <Text style={{ color: "black", fontSize: 25, fontWeight: "bold" }}>
        Registration {currentUser.riderStatus}
      </Text>
      <Text style={{ color: "black", fontSize: 18, marginVertical: 10 }}>
        {currentUser.firstName + " " + currentUser.lastName}
      </Text>
      <Text
        style={{
          color: "black",
          fontSize: 15,
          textAlign: "center",
          marginVertical: 10,
          marginHorizontal: 50,
        }}
      >
        We still processing your documents, please wait until further notice.
      </Text>
      <Button
        event={() => {
          AsyncStorage.removeItem("user");
          navigation.navigate("login");
        }}
        text={"Back to Login"}
        bgColor={"red"}
      />
    </View>
  );
};

export default RiderPending;
