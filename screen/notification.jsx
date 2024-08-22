import { Text, View } from "react-native";

const Notification = () => {
  return (
    <View
      style={{
        backgroundColor: "yellow",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20 }}>Notification Page</Text>
    </View>
  );
};

export default Notification;
