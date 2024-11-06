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
  const { setBookLocation } = useSmokeContext();

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
      {singleData && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          {/* <TouchableOpacity
              onPress={() => {
                console.log("Fldkfj");
                setViewTransactionModal(true);
              }}
              style={{
                borderWidth: 2,
                width: 150,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 5,
                borderRadius: 5,
                borderColor: "#003082",
              }}
            >
              <Text style={{ borderColor: "#003082" }}>View Transaction</Text>
            </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              setSingleData(null);
              setSelectedTransaction(null);
              // setBookLocation(null);
            }}
            style={{
              borderWidth: 2,
              width: 60,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5,
              borderRadius: 5,
              borderColor: "#003082",
              backgroundColor: "red",
              borderRadius: 200,
              position: "absolute",
              right: 20,
            }}
          >
            <Text
              style={{
                borderColor: "#003082",
                color: "white",
                textAlign: "center",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
          event={() => setServiceModal(true)}
          text="Book"
          bgColor={"#B80B00"}
        />
      </View>
    </View>
  );
};

export default PickServiceButton;
