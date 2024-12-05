import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import moment from "moment";
import useCrudWallet from "../hooks/useCrudWallet";
import { useSmokeContext } from "../utils/appContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import EmptyList from "../components/emptyList";
import { StatusBar } from "expo-status-bar";
const ViewAllWallet = ({ navigation }) => {
  const { data, getWallet, getTransactionHistory, transactionHistory } =
    useCrudWallet();
  const { currentUser } = useSmokeContext();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc"); // New state for sorting order

  const fetchData = async () => {
    if (currentUser?.id) {
      await getWallet(currentUser.id);
      await getTransactionHistory(currentUser.id);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter transactions based on the selected filter
    let transactions = transactionHistory || [];
    if (filter !== "All") {
      transactions = transactions.filter(
        (item) =>
          (filter === "Delivery" && item.serviceType !== "Pahatod") ||
          (filter === "Transportation" && item.serviceType === "Pahatod")
      );
    }

    // Sort transactions by date based on the selected sort order
    transactions = transactions.sort((a, b) => {
      if (a.date && b.date) {
        return sortOrder === "desc"
          ? b.date.toDate() - a.date.toDate() // Most recent first
          : a.date.toDate() - b.date.toDate(); // Oldest first
      }
      return 0;
    });

    setFilteredTransactions(transactions);
  }, [filter, sortOrder, transactionHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 30,
        backgroundColor: "white",
      }}
    >
      <StatusBar
        backgroundColor={!currentUser.role ? "#B80B00" : "#003082"}
        style="light"
      />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 10 }}>
          Transaction History
        </Text>

        {/* Filter Buttons */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {["All", "Delivery", "Transportation"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilter(type)}
              style={{
                marginRight: 10,
                backgroundColor: filter === type ? "#B80B00" : "#E0E0E0",
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: filter === type ? "white" : "black",
                  fontWeight: "bold",
                }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() =>
              setSortOrder((prevOrder) =>
                prevOrder === "desc" ? "asc" : "desc"
              )
            }
            style={{
              backgroundColor: "#E7E7E7",
              padding: 10,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name={
                sortOrder === "desc"
                  ? "sort-calendar-descending"
                  : "sort-calendar-ascending"
              }
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {/* Transaction List */}
        {filteredTransactions?.length > 0 ? (
          filteredTransactions.map((item) => {
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
                  backgroundColor: "white",
                  shadowColor: item.type === "plus" ? "#4CAF50" : "#F44336",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,
                  elevation: 5,
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
          <EmptyList title="No Transaction Yet." />
        )}
      </ScrollView>
    </View>
  );
};

export default ViewAllWallet;
