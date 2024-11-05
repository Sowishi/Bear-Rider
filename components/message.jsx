import React, { useRef, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import useCrudMessage from "../hooks/useCrudMessage";
import moment from "moment";

const Message = ({ recipientName, singleData, currentUser, IS_RIDER }) => {
  const { handleSendMessage, messages } = useCrudMessage();

  const [newMessage, setNewMessage] = useState("");

  const renderMessage = ({ item }) => {
    const ownMessage = item.sender == currentUser.id;
    const date = item.timestamp
      ? moment(item.timestamp.toDate()).format("LLL")
      : "sending...";

    return (
      <View
        style={{
          flexDirection: ownMessage ? "row-reverse" : "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {/* Avatar */}
        {!ownMessage && (
          <Image
            source={{
              uri: !IS_RIDER
                ? singleData.rider.selfieUrl
                : singleData.currentUser.profilePic,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginHorizontal: 5,
            }}
          />
        )}

        {/* Message Bubble */}
        <View
          style={{
            padding: 10,
            backgroundColor: ownMessage ? "#DCF8C6" : "#EAEAEA",
            borderRadius: 10,
            maxWidth: "70%",
            position: "relative",
          }}
        >
          <Text>{item.content}</Text>
          <Text
            style={{
              fontSize: 10,
              color: "gray",
              textAlign: "right",
              marginTop: 5,
            }}
          >
            {date}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, width: "100%" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#003082",
          padding: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          {IS_RIDER
            ? singleData.currentUser.firstName +
              " " +
              singleData.currentUser.lastName
            : singleData.rider.firstName + " " + singleData.rider.lastName}
        </Text>
      </View>

      {/* Body */}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 10 }}
        style={{ flex: 1 }}
        inverted
      />
      {/* Footer */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderTopWidth: 1,
          borderColor: "#EAEAEA",
          backgroundColor: "white",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 20,
            backgroundColor: "#F0F0F0",
            marginRight: 10,
          }}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity
          onPress={() => {
            handleSendMessage(newMessage);
            setNewMessage("");
          }}
          style={{
            backgroundColor: "#003082",
            padding: 10,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Message;
