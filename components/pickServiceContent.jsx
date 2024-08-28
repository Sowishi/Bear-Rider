import { Text, View } from "react-native";
import Button from "./button";

const PickServiceContent = ({ setPahatodModal, setServiceModal }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
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
