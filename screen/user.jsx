import { Text, View } from "react-native";

const User = () => {
  return (
    <View
      s
      style={{
        backgroundColor: "red",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, color: "white" }}>User Page</Text>
    </View>
  );
};

export default User;
