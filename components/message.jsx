import React, { useEffect, useRef, useState } from "react";
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
import { useSmokeContext } from "../utils/appContext";
import useGetUsers from "../hooks/useGetUsers";
import { AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

const Message = ({ recipientName, singleData, IS_RIDER, navigation }) => {
  const { handleSendMessage, messages } = useCrudMessage();
  const { currentUser } = useSmokeContext();
  const { messageUserInfo, messageInfo } = useSmokeContext();

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
          flex: 1,
        }}
      >
        {/* Avatar */}
        {!ownMessage && !messageUserInfo && (
          <Image
            source={{
              uri: messageInfo.sender.profilePic,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginHorizontal: 5,
            }}
          />
        )}

        {messageUserInfo && !ownMessage && (
          <Image
            source={{
              uri: messageInfo.sender.profilePic,
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
            backgroundColor: ownMessage ? "#FFB8B899" : "#EAEAEA",
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
    <View
      style={{ flex: 1, width: "100%", marginTop: Constants.statusBarHeight }}
    >
      {/* Header */}

      <View
        style={{
          marginHorizontal: 20,
          marginTop: 25,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                padding: 10,
                borderRadius: 100,
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 20 }}>
              {messageInfo.sender.firstName + " " + messageInfo.sender.lastName}
            </Text>
          </View>
        </View>
      </View>

      {/* Body */}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 10 }}
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
            padding: 10,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Message;
