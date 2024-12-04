import { Text, TouchableOpacity, View } from "react-native";
import Button from "./button";
import { useSmokeContext } from "../utils/appContext";

const PickServiceButton = ({
  setServiceModal,
  singleData,
  setSingleData,
  setSelectedTransaction,
  setViewTransactionModal,
  setPahatodModal,
}) => {
  const {
    setBookLocation,
    viewRiderState,
    setShowSelectedLocation,
    setDestination,
  } = useSmokeContext();

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
          backgroundColor: "gray",
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
          event={() => {
            setServiceModal(true);
            setShowSelectedLocation(true);
            setBookLocation(null);
            setDestination(null);
          }}
          text="Book"
          bgColor={"#B80B00"}
        />
      </View>
    </View>
  );
};

export default PickServiceButton;
