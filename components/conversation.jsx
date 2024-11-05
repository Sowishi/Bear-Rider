// ConversationList.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useCrudConversation from "../hooks/useCrudConversation";

const conversationsData = [
  {
    id: "1",
    participants: ["Alice", "Bob"],
    lastMessage: "Hey, are we still on for tomorrow?",
    timestamp: "10:15 AM",
  },
  {
    id: "2",
    participants: ["Charlie", "David"],
    lastMessage: "Got it, thanks!",
    timestamp: "9:45 AM",
  },
  {
    id: "3",
    participants: ["Eve", "Frank"],
    lastMessage: "Can you send me the report?",
    timestamp: "Yesterday",
  },
];

const ConversationList = ({ currentUser }) => {
  const { conversations: conversationsData } = useCrudConversation(currentUser);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.conversationContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.participantsText}>
          {item.participants.join(" & ")}
        </Text>
        <Text style={styles.lastMessageText}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.timestampText}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="message1" size={24} color="black" />
        <Text style={styles.headerTitle}>Conversations</Text>
      </View>
      <FlatList
        data={conversationsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  conversationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginVertical: 5,
  },
  textContainer: {
    flex: 1,
  },
  participantsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessageText: {
    fontSize: 14,
    color: "#555",
  },
  timestampText: {
    fontSize: 12,
    color: "#aaa",
    alignSelf: "flex-end",
  },
});

export default ConversationList;
