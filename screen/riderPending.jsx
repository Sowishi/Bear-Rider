import { BackHandler, Text, View } from "react-native";
import { useSmokeContext } from "../utils/appContext";
import Button from "../components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DevSettings } from "react-native";

const RiderPending = () => {
  const { currentUser } = useSmokeContext();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#003082",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 25 }}>
        {currentUser.fullName}
      </Text>
      <Text style={{ color: "white", fontSize: 25 }}>
        Current Status: {currentUser.riderStatus}
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 15,
          textAlign: "center",
          marginVertical: 10,
          marginHorizontal: 50,
        }}
      >
        We still processing your documents, please wait...
      </Text>
      <Button
        event={() => {
          AsyncStorage.removeItem("user");
          DevSettings.reload();
        }}
        text={"Reload App"}
        bgColor={"red"}
      />
    </View>
  );
};

export default RiderPending;
