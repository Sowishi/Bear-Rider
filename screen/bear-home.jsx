import { View, Text, ImageBackground } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import TypeWriter from "react-native-typewriter";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import bg1 from "../assets/bg1.jpg";
import Entypo from "@expo/vector-icons/Entypo";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import BearTypes from "../components/bearType";

const BearHome = ({ navigation }) => {
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
            <BearTypes />
            <Text style={{ color: "white", marginTop: 10 }}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Necessitatibus, quaerat!
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("bearMap");
              }}
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

        <View style={{ flex: 1.5, backgroundColor: "white" }}>
          <View>
            <View
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingHorizontal: 10,
                paddingVertical: 13,
                marginHorizontal: 20,
                borderRadius: 10,
                marginTop: -30,
              }}
            >
              <Entypo name="location-pin" size={24} color="red" />
              <Text style={{ fontSize: 23 }}>Where To?</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              padding: 15,
              marginTop: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <AntDesign name="pushpin" size={24} color="black" />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Current Location
                </Text>
                <Text style={{ fontStyle: "italic", fontSize: 13 }}>
                  Moreno Integarated School
                </Text>
              </View>
            </View>
            <View>
              <AntDesign name="arrowright" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Ride/Deliver to saved places
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "#FFF5F6",
                padding: 5,
                borderRadius: 100,
              }}
            >
              <AntDesign name="arrowright" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row", // Arrange children in a row
              flexWrap: "wrap", // Allow items to wrap if necessary
              justifyContent: "space-between",
              alignItems: "center", // Distribute columns evenly
              padding: 10,
            }}
          >
            <View
              style={{
                width: "30%",
                borderRadius: 5,
                backgroundColor: "#FFF5F6",
                padding: 5,
                margin: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="home" size={24} color="#A22B2F" />
              <Text>Home</Text>
            </View>
            <View
              style={{
                width: "30%",
                borderRadius: 5,
                backgroundColor: "#FFF5F6",
                padding: 5,
                margin: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="home" size={24} color="#A22B2F" />
              <Text>Home</Text>
            </View>
            <View
              style={{
                width: "30%",
                borderRadius: 5,
                backgroundColor: "#FFF5F6",
                padding: 5,
                margin: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="home" size={24} color="#A22B2F" />
              <Text>Home</Text>
            </View>
            <View
              style={{
                width: "30%",
                borderRadius: 5,
                backgroundColor: "#FFF5F6",
                padding: 5,
                margin: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="home" size={24} color="#A22B2F" />
              <Text>Home</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default BearHome;
