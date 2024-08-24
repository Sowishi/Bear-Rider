import { Text, View } from "react-native";
import { useSmokeContext } from "../utils/appContext";

const User = () => {
  const { currentUser } = useSmokeContext();

  return (
    <View
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
