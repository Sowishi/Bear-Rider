import { Text, View } from "react-native";
import Button from "./button";

const PickServiceContent = ({ setPahatodModal, setServiceModal }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          height: 6,
          width: 150,
          backgroundColor: "gray",
          marginBottom: 30,
          borderRadius: 20,
        }}
      ></View>
      <Text style={{ fontSize: 25, marginBottom: 10 }}>Pick a service</Text>
      <Button
        width={300}
        text="Pahatod Services"
        bgColor={"#B80B00"}
        event={() => {
          setPahatodModal(true);
          setServiceModal(false);
        }}
      />
      <Button
        width={300}
        text="Padara Services"
        bgColor={"#B80B00"}
        event={() => {
          setServiceModal(false);
        }}
      />
    </View>
  );
};

export default PickServiceContent;