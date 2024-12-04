import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import useCrudWallet from "../hooks/useCrudWallet";
import { useSmokeContext } from "../utils/appContext";

const ViewAllWallet = ({ navigation }) => {
  const { data, getWallet, getTransactionHistory, transactionHistory } =
    useCrudWallet();
  const { currentUser } = useSmokeContext();
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (currentUser?.id) {
      await getWallet(currentUser.id);
      await getTransactionHistory(currentUser.id);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const viewAllTransactions = () => {
    navigation.navigate("viewAllWallet");
    // Add your navigation or modal logic here
  };

  return (
    <View style={{ flex: 1, paddingVertical: 50, paddingHorizontal: 30 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 10 }}>
          Transaction History
        </Text>
        {transactionHistory?.length > 0 ? (
          transactionHistory.map((item) => {
            const date = item.date
              ? moment(item.date.toDate()).format("LLL")
              : "...";

            return (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginVertical: 10,
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor: item.type === "plus" ? "#e8f7e2" : "#fce7e6",
                  borderLeftWidth: 5,
                  borderLeftColor: item.type === "plus" ? "#4CAF50" : "#F44336",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,
                  elevation: 6,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor:
                        item.type === "plus" ? "#4CAF50" : "#F44336",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      {item.type === "plus" ? "↑" : "↓"}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {item.serviceType === "Pahatod"
                        ? "Transportation"
                        : "Delivery"}
                    </Text>
                    <Text style={{ color: "#666" }}>{date}</Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: item.type === "plus" ? "#4CAF50" : "#F44336",
                  }}
                >
                  {item.type === "plus" ? "+" : "-"} ₱{parseInt(item.amount)}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            No Transactions Yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ViewAllWallet;
