// ConversationList.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useCrudConversation from "../hooks/useCrudConversation";
import useGetUsers from "../hooks/useGetUsers";
import { useSmokeContext } from "../utils/appContext";
import EmptyList from "./emptyList";

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

const ConversationList = ({ currentUser, setMessageModal, IS_RIDER }) => {
  const { conversations: conversationsData } = useCrudConversation(currentUser);
  const { data: users } = useGetUsers();
  const { setMessageInfo, setMessageUserInfo } = useSmokeContext();

  const handleGetUser = (id) => {
    const output = users.filter((user) => {
      if (user.id == id) {
        return user;
      }
    });
    return output[0];
  };

  const renderItem = ({ item }) => {
    let userID = null;
    let senderNumber = null;
    if (item.participants[0] == currentUser.id) {
      userID = item.participants[1];
      senderNumber = 0;
    } else {
      userID = item.participants[0];
      senderNumber = 1;
    }

    let sender = item.participants[senderNumber];
    let receiver = item.participants[senderNumber == 0 ? 1 : 0];

    const user = handleGetUser(userID);

    return (
      <TouchableOpacity
        style={styles.conversationContainer}
        onPress={() => {
          setMessageModal(true);
          setMessageInfo({
            receiver,
            sender,
          });

          setMessageUserInfo(user);
        }}
      >
        {user && (
          <>
            <Image
              style={{
                width: 40, // Set width
                height: 40, // Set height
                borderRadius: 20, // Make it circular
                marginRight: 10, // Space between image and text
              }}
              source={{
                uri: user.selfieUrl ? user.selfieUrl : user.profilePic,
              }} // Adjust this to your image source
            />
            <View style={styles.textContainer}>
              <Text style={styles.participantsText}>
                {user.firstName + " " + user.lastName}
              </Text>
              <Text style={styles.lastMessageText}>{item.lastMessage}</Text>
            </View>
            <Text style={styles.timestampText}>{item.timestamp}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="message1" size={24} color="black" />
        <Text style={styles.headerTitle}>Conversations</Text>
      </View>
      {conversationsData.length >= 1 ? (
        <FlatList
          data={conversationsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <>
          <EmptyList title={"There's no conversation yet"} />
        </>
      )}
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
