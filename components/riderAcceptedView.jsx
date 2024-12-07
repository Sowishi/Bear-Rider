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
import { useEffect, useState } from "react";
import Loader from "./loader";
const RiderAcceptedView = ({
  singleData,
  chargePerKilometer,
  baseFare,
  setTransactionDetailsModal,
  location,
  setViewTransactionModal,
  setMessageModal,
  selectedTransaction,
  navigation,
}) => {
  const { currentUser, setViewDirection, setMessageInfo, setShowRiderBubble } =
    useSmokeContext();
  const { acceptTransaction, getTransaction } = useCrudTransaction();
  const { addNotification } = useCrudNotification();

  const [transaction, setTransaction] = useState();

  useEffect(() => {
    getTransaction(selectedTransaction.id, setTransaction);
  }, []);

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      {transaction && (
        <>
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
                {transaction?.serviceType == "Pahatod"
                  ? "Transportation Service"
                  : "Delivery Service"}
              </Text>
              <Image
                style={{ width: 75, height: 75 }}
                source={{
                  uri: transaction?.currentUser.profilePic,
                }}
              />
              <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
                {transaction?.currentUser.firstName}{" "}
                {transaction?.currentUser.lastName}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "column", marginTop: 10 }}>
            <Text style={{ fontSize: 10, color: "#B80B00", marginBottom: 1 }}>
              {transaction?.serviceType == "Padara"
                ? "Drop-off Location"
                : "Current Location"}{" "}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{ width: 20, height: 20, marginRight: 5 }}
                source={redMarker}
              />
              <Text>{transaction.origin.address}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "column", marginTop: 10 }}>
            <Text style={{ fontSize: 10, color: "#003082", marginBottom: 1 }}>
              {transaction.serviceType == "Padara"
                ? "Shop to Location"
                : "Drop-off Location"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{ width: 20, height: 20, marginRight: 5 }}
                source={blueMarker}
              />
              <Text>{transaction.destination.address}</Text>
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
              {transaction.serviceType == "Pahatod" ? "Fare" : "Delivery Fee"}:
              <Text style={{ color: "#FFC30E", fontWeight: "bold" }}>
                {" "}
                ₱
                {parseInt(
                  transaction?.distance * chargePerKilometer + baseFare
                )}
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
                ₱
                {parseInt(
                  transaction.totalPrice ? transaction.totalPrice : "----"
                )}
              </Text>
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("TransactionDetails");
                setViewTransactionModal(false);
              }}
              style={{
                width: "100%",
                backgroundColor: "#B80B00",
                paddingVertical: 15,
                marginTop: 20,
                borderRadius: 20,
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Details
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default RiderAcceptedView;
