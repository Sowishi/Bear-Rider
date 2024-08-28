import { Image, ScrollView, Text, View } from "react-native";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import Button from "./button";
import { useSmokeContext } from "../utils/appContext";
import moment from "moment";
const HistoryContent = ({
  transactions,
  setSelectedTransaction,
  setTransactionModal,
  IS_RIDER,
  setHistoryModal,
  setPahatodModal,
  setFindingRider,
  setSelectedLocation,
}) => {
  const { currentUser } = useSmokeContext();
  return (
    <>
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          Transaction History
        </Text>
      </View>
      {IS_RIDER && (
        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            minHeight: 200,
            marginTop: 30,
          }}
        >
          {transactions?.map((transaction) => {
            if (
              transaction.status == "Accepted" &&
              transaction.rider.id == currentUser.id
            ) {
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
                        setHistoryModal(false);
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
      )}

      {!IS_RIDER && (
        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            minHeight: 200,
            marginTop: 30,
          }}
        >
          {transactions?.map((transaction) => {
            const timeStamp = transaction.createdAt.toDate();
            const date = moment(timeStamp).format("LLL");
            if (transaction.currentUser.id == currentUser.id) {
              return (
                <View key={transaction.id} style={{ marginVertical: 10 }}>
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
                        fontSize: 17,
                        marginBottom: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {transaction.currentUser.firstName}{" "}
                      {transaction.currentUser.lastName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        marginBottom: 5,
                      }}
                    >
                      {date}
                    </Text>
                  </View>

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
                    Service Type: {transaction.serviceType}
                  </Text>
                  <Text
                    style={{
                      marginVertical: 3,
                      color:
                        transaction.status == "Completed" ? "green" : "black",
                    }}
                  >
                    Status:{" "}
                    {transaction.status ? transaction.status : "Pending"}
                  </Text>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {transaction.status !== "Completed" && (
                      <Button
                        event={() => {
                          setSelectedTransaction(transaction);
                          setPahatodModal(true);
                          setFindingRider(true);
                          setSelectedLocation(transaction.destination);
                          setTransactionModal(false);
                          setHistoryModal(false);
                        }}
                        icon="chevron-right"
                        text="View Transaction"
                        bgColor={"#B80B00"}
                      />
                    )}
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
      )}
    </>
  );
};

export default HistoryContent;
