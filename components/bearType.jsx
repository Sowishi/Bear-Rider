import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import TypeWriter from "react-native-typewriter";

const BearTypes = () => {
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
    <TypeWriter
      typing={isTyping}
      maxDelay={100}
      minDelay={50}
      style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
    >
      {text}
    </TypeWriter>
  );
};

export default BearTypes;
