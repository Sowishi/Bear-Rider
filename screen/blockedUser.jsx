import { BackHandler, Image, Text, View } from "react-native";
import { useSmokeContext } from "../utils/appContext";
import Button from "../components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DevSettings } from "react-native";
import img from "../assets/O (2) 1.png";

const BlockedUser = ({ navigation, route }) => {
  const { currentUser } = useSmokeContext();
  const { type = false } = route?.params || {};
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
        {type == "block"
          ? "User has been blocked"
          : `Registration ${currentUser.riderStatus}`}
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
        {currentUser.riderStatus == "Pending"
          ? " We still processing your documents, please wait until further notice."
          : "You are rejected or been blocked by the management"}
      </Text>
      <Button
        event={() => {
          AsyncStorage.removeItem("user");
          navigation.goBack();
        }}
        text={"Back to home"}
        bgColor={"red"}
      />
    </View>
  );
};

export default BlockedUser;
