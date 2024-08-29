import { Image, Text, View } from "react-native";
import logo from "../assets/bear2.png";

const EmptyList = ({ title }) => {
  return (
    <View
      style={{
        height: 500,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={logo} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{title}</Text>
    </View>
  );
};

export default EmptyList;
