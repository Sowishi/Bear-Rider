import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import { useSmokeContext } from "../utils/appContext";
const TransactionSummary = ({ data, navigation }) => {
  const { fare, currentUser: user } = useSmokeContext();
  const {
    id,
    createdAt,
    currentUser,
    destination,
    distance,
    paymentMethod,
    rider,
    serviceType,
    status,
    totalPrice,
    insured,
    distanceCharge,
    purchaseCost,
    tip,
  } = data;

  const baseFare = fare.baseFareValue;
  return (
    <View
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
        padding: 20,
        backgroundColor: "#fefefe",
      }}
    >
      <StatusBar style="dark" backgroundColor="#fefefe" />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => {
            if (user.role == "Rider") {
              navigation.navigate("main");
              return;
            } else {
              navigation.navigate("Feedback", { data });
            }
          }}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        {/* <AntDesign name="download" size={24} color="black" /> */}
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <AntDesign name="checkcircle" size={24} color="#00C473" />
          <Text
            style={{
              color: "#00C473",
              fontWeight: "bold",
              marginTop: 10,
              fontSize: 15,
            }}
          >
            Payment Successful
          </Text>
          <Text style={{ fontSize: 35, marginTop: 5, fontWeight: "bold" }}>
            ₱
            {parseInt(totalPrice).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 30,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,

          elevation: 4,
          borderRadius: 10,
          width: "100%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ marginTop: -20, padding: 5 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 100 }}
              source={require("../assets/bear.png")}
            />
          </View>

          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {serviceType == "Pahatod"
              ? "Transportation Service"
              : "Delivery Service"}
          </Text>
          <View style={{ padding: 20, width: "100%" }}>
            {serviceType != "Padara" && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
                    Base Fare
                  </Text>
                  <Text style={{ color: "black", fontSize: 15 }}>
                    ₱{baseFare}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
                    Distance Charge
                  </Text>
                  <Text style={{ color: "black", fontSize: 15 }}>
                    ₱ {parseInt(distanceCharge)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
                    Tip
                  </Text>
                  <Text style={{ color: "black", fontSize: 15 }}>₱{tip}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
                    Total
                  </Text>
                  <Text style={{ color: "black", fontSize: 15 }}>
                    ₱{parseInt(totalPrice)}
                  </Text>
                </View>
              </>
            )}
            {serviceType == "Padara" && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
                    Base Fare
                  </Text>
                  <Text style={{ color: "black", fontSize: 15 }}>
                    ₱{baseFare}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
                    Distance Charge
                  </Text>
                  <Text style={{ color: "black", fontSize: 15 }}>
                    ₱ {parseInt(distanceCharge)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
                    Purchase Cost
                  </Text>
                  <Text style={{ color: "black", fontSize: 15 }}>
                    ₱ {parseInt(purchaseCost)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
                    Tip
                  </Text>
                  <Text style={{ color: "black", fontSize: 15 }}>₱0</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
                    Total
                  </Text>
                  <Text style={{ color: "black", fontSize: 15 }}>
                    ₱{parseInt(totalPrice)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Transaction Details
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
            Payment Method
          </Text>
          <Text style={{ color: "black", fontSize: 15 }}>{paymentMethod}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
            Status
          </Text>
          <Text style={{ color: "black", fontSize: 15 }}>{status}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
            Insured
          </Text>
          <Text style={{ color: "black", fontSize: 15 }}>
            {insured ? "Yes" : "No"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
            Date
          </Text>
          <Text style={{ color: "black", fontSize: 15 }}>
            {moment(new Date()).format("LLL")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
            Rider Name
          </Text>
          <Text style={{ color: "black", fontSize: 15 }}>
            {rider.firstName + " " + rider.lastName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ color: "black", fontSize: 15, opacity: 0.5 }}>
            Customer Name
          </Text>
          <Text style={{ color: "black", fontSize: 15 }}>
            {currentUser.firstName + " " + currentUser.lastName}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (user.role == "Rider") {
            navigation.navigate("main");
            return;
          } else {
            navigation.navigate("Feedback", { data });
          }
        }}
        style={{
          width: "100%",
          backgroundColor: "#B80B00",
          paddingVertical: 15,
          marginTop: 20,
          borderRadius: 20,
          marginTop: 30,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionSummary;
