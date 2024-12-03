import { View, Text, ImageBackground } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import TypeWriter from "react-native-typewriter";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import bg1 from "../assets/bg1.jpg";
import Entypo from "@expo/vector-icons/Entypo";
import { TouchableOpacity } from "react-native";

const BearHome = () => {
  const phrases = [
    "Transportation?",
    "Delivery?",
    "We got you!",
    "Bear Rider Express.",
  ];

  const [index, setIndex] = useState(0); // Track the current phrase index
  const [text, setText] = useState(phrases[0]); // Current text to be typed
  const [isTyping, setIsTyping] = useState(1); // Control typing (1 = start, 0 = pause)

  useEffect(() => {
    // Simulate typing and change text after typing is done
    const typingInterval = setTimeout(() => {
      setText(phrases[index]);
      setIsTyping(0); // Stop typing temporarily to reset
    }, 3000); // Simulate how long the typing effect lasts for each phrase

    // Reset typing to start typing the next phrase
    const resetTyping = setTimeout(() => {
      setIsTyping(1); // Restart typing effect
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length); // Move to the next phrase
    }, 3500); // Time to wait before switching to the next phrase

    return () => {
      clearTimeout(typingInterval); // Cleanup timeout
      clearTimeout(resetTyping); // Cleanup reset typing timeout
    };
  }, [index]);

  return (
    <>
      <StatusBar translucent style="light" />

      <View style={{ flex: 1 }}>
        <ImageBackground
          source={bg1}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Linear Gradient Overlay */}
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.2)"]} // Dark gradient overlay
            style={{
              position: "absolute", // Ensure gradient is on top of the image
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          />

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
              paddingHorizontal: 10,
            }}
          >
            <TypeWriter
              typing={isTyping}
              maxDelay={100}
              minDelay={50}
              style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
            >
              {text}
            </TypeWriter>
            <Text style={{ color: "white", marginTop: 10 }}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Necessitatibus, quaerat!
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: "#AA2D31",
                  fontSize: 23,
                  fontWeight: "bold",
                  marginRight: 5,
                }}
              >
                Map
              </Text>
              <Entypo name="map" size={24} color="#AA2D31" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={{ flex: 1.5, backgroundColor: "white" }}></View>
      </View>
    </>
  );
};

export default BearHome;
