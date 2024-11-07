import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import cod from "../assets/cash-on-delivery.png";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import Button from "./button";
import { useSmokeContext } from "../utils/appContext";
import Toast from "react-native-toast-message";
import useCrudTransaction from "../hooks/useCrudTransaction";
import useCrudNotification from "../hooks/useCrudNotification";
import { dialPhone } from "../utils/dialPhone";
const RiderAcceptedView = ({
  singleData,
  chargePerKilometer,
  baseFare,
  setTransactionDetailsModal,
  location,
  setViewTransactionModal,
  setMessageModal,
}) => {
  const { currentUser, setViewDirection, setMessageInfo, setShowRiderBubble } =
    useSmokeContext();
  const { acceptTransaction } = useCrudTransaction();
  const { addNotification } = useCrudNotification();

  const handleAcceptTransaction = () => {
    acceptTransaction(singleData, currentUser, location);
    addNotification(singleData, currentUser, "accept rider");
    Toast.show({ type: "success", text1: "Successfully accepeted ride." });
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
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

      <View style={{ flexDirection: "column", marginTop: 10 }}>
        <Text style={{ fontSize: 10, color: "#B80B00", marginBottom: 1 }}>
          {singleData.serviceType == "Padara"
            ? "Drop-off Location"
            : "Current Location"}{" "}
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
          {singleData.serviceType == "Padara"
            ? "Shop to Location"
            : "Drop-off Location"}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 20, height: 20, marginRight: 5 }}
            source={blueMarker}
          />
          <Text>{singleData.destination.address}</Text>
        </View>
      </View>

      <View
        style={{
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 18,
          }}
        >
          {singleData.serviceType == "Pahatod" ? "Fare" : "Delivery Fee"}:
          <Text style={{ color: "#FFC30E", fontWeight: "bold" }}>
            {" "}
            ₱{parseInt(singleData?.distance * chargePerKilometer + baseFare)}
          </Text>
        </Text>
        <Text
          style={{
            color: "black",
            fontSize: 18,
          }}
        >
          Total
          <Text style={{ color: "#FFC30E", fontWeight: "bold" }}>
            {" "}
            ₱{parseInt(singleData.totalPrice ? singleData.totalPrice : "----")}
          </Text>
        </Text>
      </View>
      {singleData.status !== "Accepted" &&
        singleData.status !== "Transit" &&
        singleData.status !== "Nearby" && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Button
              event={() => setTransactionDetailsModal(true)}
              style={{ marginTop: 10 }}
              width={150}
              text="Details"
              bgColor={"#003082"}
            />
          </View>
        )}

      {/* Message and call buttons     */}
      {singleData.status !== undefined && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => dialPhone(singleData.currentUser.phoneNumber)}
            style={{
              borderWidth: 2,
              width: 100,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5,
              borderRadius: 5,
              borderColor: "#003082",
            }}
          >
            <Text style={{ borderColor: "#003082" }}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMessageModal(true);
              setMessageInfo({
                receiver: singleData.currentUser.id,
                sender: currentUser.id,
              });
            }}
            style={{
              borderWidth: 2,
              width: 100,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5,
              borderRadius: 5,
              borderColor: "#003082",
              backgroundColor: "#003082",
            }}
          >
            <Text style={{ borderColor: "#003082", color: "white" }}>
              Message
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {singleData.status && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: 10,
          }}
        >
          <Button
            event={() => setTransactionDetailsModal(true)}
            style={{ marginTop: 10 }}
            width={150}
            text="Details"
            bgColor={"#003082"}
          />
          <Button
            event={() => {
              setViewTransactionModal(false);
              setViewDirection(true);
              setShowRiderBubble(true);
            }}
            style={{ marginTop: 10 }}
            width={150}
            text="Direction"
            bgColor={"#B80B00"}
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
            event={() => setViewTransactionModal(false)}
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
    </View>
  );
};

export default RiderAcceptedView;
