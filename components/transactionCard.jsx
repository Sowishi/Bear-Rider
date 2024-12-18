import { ActivityIndicator, Image, Text, View } from "react-native";
import moment from "moment";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import Button from "./button";
const TransactionCard = ({
  transaction,
  handleViewRider,
  handleViewCustomer,
  handleViewTransaction,
  isTransactionPage,
}) => {
  const timeStamp = transaction.createdAt.toDate();
  const date = moment(timeStamp).format("LLL");

  const getColorStatus = (status) => {
    if (status == "Accepted") {
      return "#69A8D8";
    } else if (status == "Completed") {
      return "#7DD772";
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {transaction.currentUser.firstName} {transaction.currentUser.lastName}
        </Text>
        <View style={{ flexDirection: "column" }}>
          <Text
            style={{
              color: "#FFC30E",
              fontWeight: "bold",
              fontSize: 13,
              marginBottom: 5,
            }}
          >
            {transaction.serviceType == "Padara"
              ? "Delivery"
              : "Transportation"}
          </Text>
          <Text style={{ fontSize: 8 }}>{date}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "column" }}>
        <Text style={{ fontSize: 10, color: "#B80B00", marginBottom: 1 }}>
          {transaction.serviceType == "Padara"
            ? "Drop-off Location"
            : "Current Location"}
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
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ marginVertical: 3, fontSize: 12 }}>
            Service Type:{" "}
            {transaction.serviceType == "Pahatod"
              ? "Transportation"
              : "Delivery"}
          </Text>
          <Text style={{ marginVertical: 3, fontWeight: "bold", fontSize: 14 }}>
            Total Price: ₱{transaction.totalPrice}
          </Text>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginVertical: 3,
              color: getColorStatus(transaction.status),
              fontSize: 15,
            }}
          >
            Status: {transaction.status ? transaction.status : "Pending"}
          </Text>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {transaction.status !== "Completed" && (
            <>
              {isTransactionPage && (
                <Button
                  event={() => {
                    handleViewTransaction(transaction);
                  }}
                  icon="chevron-right"
                  text="View Transaction"
                  bgColor={"#B80B00"}
                />
              )}
              {!isTransactionPage && (
                <Button
                  event={() => {
                    handleViewCustomer
                      ? handleViewCustomer(transaction)
                      : handleViewRider(transaction);
                  }}
                  icon="chevron-right"
                  text="View Transaction  "
                  bgColor={"#B80B00"}
                />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default TransactionCard;
