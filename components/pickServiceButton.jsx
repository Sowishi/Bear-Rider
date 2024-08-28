import { Text, View } from "react-native";
import Button from "./button";

const PickServiceButton = ({ setServiceModal }) => {
  return (
    <View
      style={{
        backgroundColor: "#fefefe",
        height: 170,
        position: "absolute",
        bottom: 0,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}
    >
      <View
        style={{
          height: 6,
          width: 150,
          backgroundColor: "black",
          marginTop: 20,
          marginBottom: 30,
          borderRadius: 20,
        }}
      ></View>
      <View
        style={{
          marginVertical: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Choose a Service</Text>
        <Button
          event={() => setServiceModal(true)}
          text="Book"
          bgColor={"#B80B00"}
        />
      </View>
    </View>
  );
};

export default PickServiceButton;
