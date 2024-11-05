import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import moment from "moment";

// Test data
const transactions = [
  {
    id: "1",
    senderName: "John Doe",
    price: 150,
    date: new Date(),
  },
  {
    id: "2",
    senderName: "Alice Smith",
    price: 250,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: "3",
    senderName: "Michael Brown",
    price: 100,
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
];

const WalletTransaction = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.senderName}>{item.senderName}</Text>
      <Text style={styles.price}>₱{item.price}</Text>
      <Text style={styles.date}>{moment(item.date).format("LLL")}</Text>
    </View>
  );

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "green",
    marginTop: 5,
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
});

export default WalletTransaction;
