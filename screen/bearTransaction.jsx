import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import moment from "moment";
import useCrudTransaction from "../hooks/useCrudTransaction";
import { useSmokeContext } from "../utils/appContext";
import { StatusBar } from "expo-status-bar";
import EmptyList from "../components/emptyList";
const BearTransaction = ({ navigation }) => {
  const { data: transactions } = useCrudTransaction();
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useSmokeContext();
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  const onRefresh = async () => {
    setRefreshing(true);
    // Add your refresh logic here if needed.
    setRefreshing(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const filteredTransactions = transactions
    .filter((item) => {
      if (item.currentUser.id === currentUser?.id) {
        if (filter === "All") return true;
        if (filter === "Transportation" && item.serviceType === "Pahatod")
          return true;
        if (filter === "Delivery" && item.serviceType === "Padara") return true;
      }
      return false;
    })
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt.toDate()) : null;
      const dateB = b.createdAt ? new Date(b.createdAt.toDate()) : null;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Transactions</Text>
      </View>

      <View style={styles.filterContainer}>
        {["All", "Transportation", "Delivery"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filter === type && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(type)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === type && styles.activeFilterText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
          <AntDesign
            name={sortOrder === "asc" ? "arrowup" : "arrowdown"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTransactions.length >= 1 ? (
          filteredTransactions.map((transaction) => {
            const date = transaction.createdAt
              ? moment(transaction.createdAt.toDate()).format("LLL")
              : "Invalid Date";
            return (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                onPress={() =>
                  navigation.navigate("ViewTransaction", { transaction })
                }
              >
                <Text style={styles.transactionTitle}>
                  {transaction.serviceType === "Pahatod"
                    ? "Transportation"
                    : "Delivery"}
                </Text>
                <Text style={styles.transactionDate}>Date: {date}</Text>
                <Text style={styles.transactionDetails}>
                  Status: {transaction.status || "Pending"}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              style={{ width: 200, height: 200 }}
              source={require("../assets/screenAssest/No Transaction HIstory.png")}
            />
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              There's no transaction yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 30,
  },
  iconButton: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    borderRadius: 100,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeFilterButton: {
    backgroundColor: "#B80B00",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#555",
  },
  activeFilterText: {
    color: "white",
    fontWeight: "bold",
  },
  sortButton: {
    backgroundColor: "#B80B00",
    padding: 10,
    borderRadius: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  transactionCard: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,

    backgroundColor: "white",
    shadowColor: "red",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transactionDate: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  transactionDetails: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default BearTransaction;
