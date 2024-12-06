import React, { useEffect } from "react";
import { OnboardFlow } from "react-native-onboard";
import { ImageBackground, StyleSheet, View, Text, Image } from "react-native";
import logo from "../assets/bear2.png"; // Import your local image
import logo2 from "../assets/bear.png"; // Import your local image
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSmokeContext } from "../utils/appContext";

const BearOnboarding = ({ navigation }) => {
  const { setCurrentUser } = useSmokeContext();

  const getUser = async () => {
    const output = await AsyncStorage.getItem("user");
    const data = await JSON.parse(output);
    setCurrentUser(data);
    if (data) {
      navigation.navigate("main");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const defaultTitle = "Bear Rider Express";
  const defaultSubtitle =
    "Bear Rider Express is your go-to delivery app in Daet, Camarines Norte, offering fast, reliable, and convenient services tailored to your needs.";
  return (
    <OnboardFlow
      onDone={() => {
        navigation.navigate("login");
      }}
      primaryButtonStyle={{
        backgroundColor: "#B80B00",
      }}
      primaryButtonTextStyle={{
        fontSize: 20,
        fontWeight: "bold",
      }}
      renderPage={({ title, subtitle, imageUri }) => (
        <ImageBackground
          source={{ uri: imageUri }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>{title || defaultTitle}</Text>
            <Text style={styles.subtitle}>{subtitle || defaultSubtitle}</Text>
          </View>
        </ImageBackground>
      )}
      pages={[
        {
          title: "Welcome to Bear Rider Express",
          imageUri: Image.resolveAssetSource(logo).uri, // Resolving the URI for the local image
        },
        {
          title: "Why Choose Us?",
          subtitle:
            "We prioritize speed, reliability, and customer satisfaction to make every delivery seamless.",
          imageUri: Image.resolveAssetSource(logo2).uri, // Resolving the URI for the local image
        },
      ]}
      type="fullscreen"
    />
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default BearOnboarding;
