import { Image, ScrollView, Text, View } from "react-native";
import cod from "../assets/cash-on-delivery.png";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import Button from "./button";
import { useSmokeContext } from "../utils/appContext";
import Toast from "react-native-toast-message";
import useCrudTransaction from "../hooks/useCrudTransaction";
import useCrudNotification from "../hooks/useCrudNotification";
const RiderAcceptedView = ({
  singleData,
  chargePerKilometer,
  baseFare,
  setTransactionDetailsModal,
  location,
}) => {
  const { currentUser } = useSmokeContext();
  const { acceptTransaction } = useCrudTransaction();
  const { addNotification } = useCrudNotification();

  const handleAcceptTransaction = () => {
    acceptTransaction(singleData, currentUser, location);
    addNotification(singleData, currentUser, "accept rider");
    Toast.show({ type: "success", text1: "Successfully accepeted ride." });
  };

  console.log(singleData);
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      style={{
        backgroundColor: "white",
        flex: 1,
        paddingVertical: 20,
        borderRadius: 10,
      }}
    >
      <View>
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
          <Text
            style={{
              fontSize: 25,
              color: "black",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            {singleData?.serviceType == "Pahatod"
              ? "Transportation Service"
              : "Delivery Service"}
          </Text>
          <Image
            style={{ width: 75, height: 75 }}
            source={{
              uri: singleData?.currentUser.profilePic,
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
            {singleData?.currentUser.firstName}{" "}
            {singleData?.currentUser.lastName}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 13,
          }}
        >
          Payment Method
        </Text>
        <Text
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {singleData.serviceType == "Pahatod" ? "Fare" : "Delivery Fee"}: ₱
          {singleData?.distance * chargePerKilometer + baseFare}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#FFB8B850",
          width: "100%",
          paddingVertical: 13,
          paddingHorizontal: 10,
          color: "white",
          flexDirection: "row",
          borderRadius: 10,
        }}
      >
        <Image source={cod} style={{ width: 20, height: 20, marginRight: 5 }} />
        <Text>Cash on Arrival</Text>
      </View>
      <View style={{ flexDirection: "column", marginTop: 10 }}>
        <Text style={{ fontSize: 10, color: "#B80B00", marginBottom: 1 }}>
          Current Location
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 20, height: 20, marginRight: 5 }}
            source={redMarker}
          />
          <Text>{singleData.origin.address}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "column", marginTop: 10 }}>
        <Text style={{ fontSize: 10, color: "#003082", marginBottom: 1 }}>
          Drop-off Location
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 20, height: 20, marginRight: 5 }}
            source={blueMarker}
          />
          <Text>{singleData.destination.address}</Text>
        </View>
      </View>
      {singleData.status && (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            event={() => setTransactionDetailsModal(true)}
            style={{ marginTop: 10 }}
            width={"90%"}
            text="Order Details"
            bgColor={"#003082"}
          />
        </View>
      )}

      {!singleData.status && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <Button
            event={() => setTransactionDetailsModal(false)}
            style={{ marginTop: 10 }}
            width={100}
            text="Decline"
            bgColor={"#003082"}
          />
          <Button
            event={handleAcceptTransaction}
            style={{ marginTop: 10 }}
            width={100}
            text="Accept"
            bgColor={"#B80B00"}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default RiderAcceptedView;
