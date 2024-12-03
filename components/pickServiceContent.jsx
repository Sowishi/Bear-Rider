import { Text, View } from "react-native";
import Button from "./button";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const PickServiceContent = ({
  setPahatodModal,
  setServiceModal,
  setServiceType,
  setSelectedTransaction,
  setSingleData,
  setFindingRider,
}) => {
  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", width: "100%" }}
    >
      <View
        style={{
          height: 6,
          width: 150,
          backgroundColor: "gray",
          marginBottom: 30,
          borderRadius: 20,
        }}
      ></View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setServiceModal(false);
          }}
          style={{
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            padding: 10,
            borderRadius: 100,
            marginRight: 10,
            marginBottom: 10,
          }}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, marginBottom: 10, fontWeight: "bold" }}>
          Pick a service
        </Text>
      </View>
      <Button
        width={300}
        text="Transportation Services"
        bgColor={"#B80B00"}
        event={() => {
          setPahatodModal(true);
          setServiceModal(false);
          setServiceType("Pahatod");
          setSelectedTransaction(null);
          setSingleData(null);
          setFindingRider(false);
        }}
      />
      <Button
        width={300}
        text="Delivery Services"
        bgColor={"#B80B00"}
        event={() => {
          setPahatodModal(true);
          setServiceModal(false);
          setServiceType("Padara");
          setSelectedTransaction(null);
          setSingleData(null);
          setFindingRider(false);
        }}
      />
    </View>
  );
};

export default PickServiceContent;
