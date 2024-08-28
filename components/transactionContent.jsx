import { Image, ScrollView, Text, View } from "react-native";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import Button from "./button";
const TransactionContent = ({
  transactions,
  setSelectedTransaction,
  setTransactionModal,
}) => {
  return (
    <>
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          Available Transaction
        </Text>
      </View>

      <ScrollView
        style={{
          flex: 1,
          width: "100%",
          minHeight: 200,
          marginTop: 30,
        }}
      >
        {transactions?.map((transaction) => {
          if (transaction.status !== "Accepted") {
            return (
              <View key={transaction.id} style={{ marginVertical: 10 }}>
                <Text
                  style={{
                    fontSize: 15,
                    marginBottom: 5,
                    fontWeight: "bold",
                  }}
                >
                  {transaction.currentUser.firstName}{" "}
                  {transaction.currentUser.lastName}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ width: 20, height: 20, marginRight: 5 }}
                    source={redMarker}
                  />
                  <Text>{transaction.origin.address}</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Image
                    style={{ width: 20, height: 20, marginRight: 5 }}
                    source={blueMarker}
                  />
                  <Text>{transaction.destination.address}</Text>
                </View>
                <Text style={{ marginVertical: 3 }}>
                  Service Type: {transaction.serviceType}{" "}
                </Text>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Button
                    event={() => {
                      setSelectedTransaction(transaction);
                      setTransactionModal(false);
                    }}
                    icon="chevron-right"
                    text="View Transaction"
                    bgColor={"#B80B00"}
                  />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  <View
                    style={{
                      width: 200,
                      height: 2,
                      backgroundColor: "gray",
                    }}
                  ></View>
                </View>
              </View>
            );
          }
        })}
      </ScrollView>
    </>
  );
};

export default TransactionContent;
