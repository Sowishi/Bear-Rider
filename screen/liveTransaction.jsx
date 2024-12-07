import { TouchableOpacity, View, Text, Image, ScrollView } from "react-native";
import Button from "../components/button";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import LottieView from "lottie-react-native";
import haversineDistance from "../utils/calculateDistance";
import { useSmokeContext } from "../utils/appContext";
import calculateArrivalTime from "../utils/calculateArrivalTime";
import cod from "../assets/cash-on-delivery.png";
import { useEffect, useRef, useState } from "react";
import { dialPhone } from "../utils/dialPhone";
import useCrudTransaction from "../hooks/useCrudTransaction";
import Timeline from "react-native-timeline-flatlist";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import Constants from "expo-constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Entypo } from "@expo/vector-icons";
import ConfirmDelivery from "../components/confirmDelivery";
import ConfirmationModal from "../components/confirmationModal";

const LiveTransaction = ({ navigation }) => {
  const {
    setFindingRider,
    selectedTransaction,
    userLocation: location,
    currentUser,
  } = useSmokeContext();
  const { getTransaction, deleteTransaction, cancelTransaction } =
    useCrudTransaction();
  const [transaction, setTransaction] = useState();
  const [cancelModal, setCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  useEffect(() => {
    getTransaction(selectedTransaction.id, setTransaction);
  }, []);

  const isRider = currentUser.role == "Rider";

  const getTransactionStatusLabel = (status) => {
    if (status == "Accepted") {
      return {
        title: "Processing",
        sub: "your rider is processing your order",
      };
    }
    if (status == "Transit") {
      return {
        title: "In Transit",
        sub: "your rider is on the way",
      };
    }
    if (status == "Nearby") {
      return {
        title: "Rider is Near",
        sub: "Waiting for you",
      };
    }
  };
  const data = [
    {
      time: "1",
      title: "Book the transaction",
      description: "You book the transaction",
      circleColor: "rgba(128, 128, 128, 1)", // Fully opaque
      lineColor: "rgba(128, 128, 128, 1)", // Fully opaque
      titleStyle: { color: "rgba(0, 0, 0, 1)" }, // Fully opaque
      descriptionStyle: { color: "rgba(0, 0, 0, 1)" }, // Fully opaque
    },
    {
      time: "2",
      title: getTransactionStatusLabel("Accepted").title,
      description: getTransactionStatusLabel("Accepted").sub,
      circleColor:
        transaction?.status === "Accepted"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      lineColor:
        transaction?.status === "Accepted"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      titleStyle: {
        color:
          transaction?.status === "Accepted"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
      descriptionStyle: {
        color:
          transaction?.status === "Accepted"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
    },
    {
      time: "3",
      title: getTransactionStatusLabel("Transit").title,
      description: getTransactionStatusLabel("Transit").sub,
      circleColor:
        transaction?.status === "Transit"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      lineColor:
        transaction?.status === "Transit"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      titleStyle: {
        color:
          transaction?.status === "Transit"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
      descriptionStyle: {
        color:
          transaction?.status === "Transit"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
    },
    {
      time: "4",
      title: getTransactionStatusLabel("Nearby").title,
      description: getTransactionStatusLabel("Nearby").sub,
      circleColor:
        transaction?.status === "Nearby"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      lineColor:
        transaction?.status === "Nearby"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      titleStyle: {
        color:
          transaction?.status === "Nearby"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
      descriptionStyle: {
        color:
          transaction?.status === "Nearby"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
    },
    {
      time: "5",
      title: "Transaction Complete",
      description: "The transaction is complete",
      circleColor:
        transaction?.status === "Nearby"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      lineColor:
        transaction?.status === "Nearby"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      titleStyle: {
        color:
          transaction?.status === "Nearby"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
      descriptionStyle: {
        color:
          transaction?.status === "Nearby"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
    },
  ];

  const handleCancelTransaction = () => {
    cancelTransaction(transaction, cancellationReason);
  };

  if (transaction?.status == "Cancelled") {
    return (
      <>
        <View
          style={{
            backgroundColor: "#B80B00",
            paddingVertical: 15,
            alignItems: "center",
            marginTop: Constants.statusBarHeight,
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Transaction Cancelled
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <>
            <Text
              style={{
                fontSize: 25,
                marginBottom: 10,
                color: "black",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              {transaction?.serviceType == "Pahatod"
                ? "Transportation Service"
                : "Delivery Service"}
            </Text>
            {/* <Text
              style={{
                textAlign: "center",
                backgroundColor: "#B80B0099",
                padding: 13,
                color: "white",
                borderRadius: 15,
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              You can cancel the transaction if it hasn't been accepted yet.
              Please note that a penalty may apply if the rider has already
              accepted it and cancelling without a valid reason.
            </Text> */}
            <Image
              style={{ width: 250, height: 250 }}
              source={require("../assets/screenAssest/Onboarding.png")}
            />

            <Text
              style={{
                color: "black",
                fontSize: 20,
                marginBottom: 5,
                textAlign: "center",
              }}
            >
              {transaction.cancellationReason}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("main");
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
                Go to Home
              </Text>
            </TouchableOpacity>
          </>
        </View>
      </>
    );
  }

  // Waiting forr a rider
  if (transaction?.status == undefined && currentUser.role !== "Rider") {
    return (
      <>
        <View
          style={{
            backgroundColor: "#B80B00",
            paddingVertical: 15,
            alignItems: "center",
            marginTop: Constants.statusBarHeight,
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Transaction Details
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <>
            <Text
              style={{
                fontSize: 25,
                marginBottom: 10,
                color: "black",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              {transaction?.serviceType == "Pahatod"
                ? "Transportation Service"
                : "Delivery Service"}
            </Text>
            {/* <Text
              style={{
                textAlign: "center",
                backgroundColor: "#B80B0099",
                padding: 13,
                color: "white",
                borderRadius: 15,
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              You can cancel the transaction if it hasn't been accepted yet.
              Please note that a penalty may apply if the rider has already
              accepted it and cancelling without a valid reason.
            </Text> */}
            <LottieView
              style={{ width: 200, height: 200 }}
              source={require("../assets/riding.json")}
              autoPlay
            />

            <Text
              style={{
                color: "black",
                fontSize: 20,
                marginBottom: 5,
                textAlign: "center",
              }}
            >
              Waiting for a rider
            </Text>
            <TouchableOpacity
              onPress={() => {
                deleteTransaction(transaction);
                navigation.navigate("main");
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
                Cancel Ride
              </Text>
            </TouchableOpacity>
          </>
        </View>
      </>
    );
  }

  if (isRider && transaction) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          marginTop: Constants.statusBarHeight,
        }}
      >
        <ExpoStatusBar style="light" />
        <ConfirmationModal
          handleConfirm={() => {
            handleCancelTransaction();
          }}
          onChangeText={(text) => setCancellationReason(text)}
          setCancellationReason={setCancellationReason}
          open={cancelModal}
          handleClose={() => {
            setCancelModal(false);
          }}
        />
        <View
          style={{
            backgroundColor: "#003082",
            paddingVertical: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Transaction Details
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 50,
            paddingTop: 20,
          }}
        >
          {transaction && transaction?.status !== undefined && (
            <>
              <View>
                <Text
                  style={{
                    fontSize: 30,
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {getTransactionStatusLabel(transaction.status)?.title}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    marginBottom: 10,
                    color: "red",
                    fontStyle: "italic",
                    marginBottom: 15,
                    textAlign: "center",
                  }}
                >
                  {getTransactionStatusLabel(transaction.status)?.sub}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "col",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 20,
                }}
              >
                <Image
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 100,
                  }}
                  source={{
                    uri: transaction?.currentUser?.profilePic,
                  }}
                />
                <View>
                  <Text style={{ fontSize: 20 }}>
                    {transaction?.currentUser?.firstName}{" "}
                    {transaction.currentUser?.lastName}
                  </Text>
                </View>
              </View>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
                Transaction Timeline
              </Text>
              <Timeline
                style={{ width: "100%" }}
                data={data}
                separator={true}
                circleSize={20}
                circleColor="rgb(45,156,219)"
                lineColor="rgb(45,156,219)"
                timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                timeStyle={{
                  textAlign: "center",
                  backgroundColor: "#ff9797",
                  color: "white",
                  padding: 5,
                  borderRadius: 13,
                  overflow: "hidden",
                }}
                descriptionStyle={{ color: "gray" }}
                options={{
                  style: { paddingTop: 5 },
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("LiveTracking");
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: 13,
                  marginTop: 20,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Entypo name="location-pin" size={24} color="red" />

                    <View style={{ marginLeft: 5 }}>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Direction
                      </Text>
                      <Text>Track your customer's location</Text>
                    </View>
                  </View>
                </View>
                <AntDesign name="arrowright" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("RiderTransactionDetails");
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: 13,
                  marginVertical: 20,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <AntDesign name="exception1" size={20} color="black" />

                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Transaction Details
                      </Text>
                      <Text>View your transaction details</Text>
                    </View>
                  </View>
                </View>
                <AntDesign name="arrowright" size={24} color="black" />
              </TouchableOpacity>
              {/* Buttons */}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Button
                  width={"100%"}
                  event={() => {
                    setCancelModal(true);
                  }}
                  text="Cancel Ride"
                  bgColor={"#B80B00"}
                />
              </View>
            </>
          )}
        </ScrollView>
      </View>
    );
  }
  if (transaction) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          marginTop: Constants.statusBarHeight,
        }}
      >
        <ExpoStatusBar style="light" />

        <ConfirmationModal
          handleConfirm={() => {
            handleCancelTransaction();
          }}
          onChangeText={(text) => setCancellationReason(text)}
          setCancellationReason={setCancellationReason}
          open={cancelModal}
          handleClose={() => {
            setCancelModal(false);
          }}
        />
        <View
          style={{
            backgroundColor: "#B80B00",
            paddingVertical: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Transaction Details
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 50,
            paddingTop: 20,
          }}
        >
          {transaction && transaction?.status !== undefined && (
            <>
              <View>
                <Text
                  style={{
                    fontSize: 30,
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {getTransactionStatusLabel(transaction.status)?.title}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    marginBottom: 10,
                    color: "red",
                    fontStyle: "italic",
                    marginBottom: 15,
                    textAlign: "center",
                  }}
                >
                  {getTransactionStatusLabel(transaction.status)?.sub}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "col",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 20,
                }}
              >
                <Image
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 100,
                  }}
                  source={{
                    uri: transaction?.rider?.selfieUrl,
                  }}
                />
                <View>
                  <Text style={{ fontSize: 20 }}>
                    {transaction?.rider?.firstName}{" "}
                    {transaction.rider?.lastName}
                  </Text>
                </View>
              </View>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
                Transaction Timeline
              </Text>
              <Timeline
                style={{ width: "100%" }}
                data={data}
                separator={true}
                circleSize={20}
                circleColor="rgb(45,156,219)"
                lineColor="rgb(45,156,219)"
                timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                timeStyle={{
                  textAlign: "center",
                  backgroundColor: "#ff9797",
                  color: "white",
                  padding: 5,
                  borderRadius: 13,
                  overflow: "hidden",
                }}
                descriptionStyle={{ color: "gray" }}
                options={{
                  style: { paddingTop: 5 },
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("viewBearAsset", {
                    type: "liveTracking",
                  });
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: 13,
                  marginTop: 20,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Entypo name="location-pin" size={24} color="red" />

                    <View style={{ marginLeft: 5 }}>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Live Tracking
                      </Text>
                      <Text>Track your rider in realtime.</Text>
                    </View>
                  </View>
                </View>
                <AntDesign name="arrowright" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("TransactionDetails");
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: 13,
                  marginVertical: 20,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <AntDesign name="exception1" size={20} color="black" />

                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Transaction Details
                      </Text>
                      <Text>View your transaction details</Text>
                    </View>
                  </View>
                </View>
                <AntDesign name="arrowright" size={24} color="black" />
              </TouchableOpacity>
              {/* Buttons */}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Button
                  width={"100%"}
                  event={() => {
                    setCancelModal(true);
                  }}
                  text="Cancel Ride"
                  bgColor={"#B80B00"}
                />
              </View>
            </>
          )}
        </ScrollView>
      </View>
    );
  }
};

export default LiveTransaction;
