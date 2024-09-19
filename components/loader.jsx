import { View, Text, ActivityIndicator } from "react-native";

const Loader = ({ title }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#00308299",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 99,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 23,
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          marginHorizontal: 20,
        }}
      >
        {title}
        <ActivityIndicator size={"large"} color={"white"} />
      </Text>
    </View>
  );
};

export default Loader;
