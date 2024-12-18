import {
  TouchableOpacity,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Linking,
} from "react-native";
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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PayModalContent from "../components/payModalContent";
import TransactionSummary from "../components/transactionSummary";
import PopupModal from "../components/popupModal";
import createCheckout from "../utils/paymongo";
import paymentMethods from "../utils/paymentMethods";
import BottomModal from "../components/bottomModal";
import QRCode from "react-native-qrcode-svg";
import logo from "../assets/bear.png";
import Toast from "react-native-toast-message";
const LiveTransaction = ({ navigation }) => {
  const {
    setFindingRider,
    selectedTransaction,
    userLocation: location,
    currentUser,
  } = useSmokeContext();
  const {
    getTransaction,
    deleteTransaction,
    cancelTransaction,
    completeTransaction,
    addTip,
  } = useCrudTransaction();
  const [transaction, setTransaction] = useState();
  const [cancelModal, setCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [modalCash, setModalCash] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    getTransaction(selectedTransaction.id, setTransaction);
  }, []);

  const isRider = currentUser.role == "Rider";

  const getTransactionStatusLabel = (status) => {
    if (status === "Accepted") {
      return isRider
        ? {
            title: "Transaction Accepted",
            sub: "You have accepted the transaction",
          }
        : {
            title: "Processing",
            sub: "Your rider is processing your transaction",
          };
    }
    if (status === "Transit") {
      return isRider
        ? {
            title: "In Transit",
            sub: "You are on your way to the customer",
          }
        : {
            title: "In Transit",
            sub: "Your rider is on the way",
          };
    }
    if (status === "Nearby") {
      return isRider
        ? {
            title: "Near Destination",
            sub: "You are close to the customer's location",
          }
        : {
            title: "Rider is Near",
            sub: "Waiting for you",
          };
    }
    if (status === "Pickup") {
      return isRider
        ? {
            title: "Pickup Confirmed",
            sub: "You have picked up the order",
          }
        : {
            title: "Confirmed Pickup",
            sub: "You are now with your rider",
          };
    }
    if (status === "DropOff") {
      return isRider
        ? {
            title: "Drop-Off Complete",
            sub: "You have drop off the customer",
          }
        : {
            title: "Confirmed Drop-Off",
            sub: "Your are now in your destination",
          };
    }
    if (status === "Completed") {
      return isRider
        ? {
            title: "Transaction Complete",
            sub: "You have successfully completed the transaction",
          }
        : {
            title: "Transaction Complete",
            sub: "The transaction is complete",
          };
    }

    // Default case for unmatched or undefined statuses
    return {
      title: "Unknown Status",
      sub: "Status is undefined or invalid",
    };
  };

  const data = [
    {
      time: "1",
      title: isRider ? "Accept the transaction" : "Book the transaction",
      description: isRider
        ? "You accept the transaction"
        : "You book the transaction",
      circleColor: "rgba(128, 128, 128, 0.5)",
      lineColor: "rgba(128, 128, 128, 0.5)",
      titleStyle: { color: "rgba(0, 0, 0, 0.5)" },
      descriptionStyle: { color: "rgba(0, 0, 0, 0.5)" },
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
      title: isRider
        ? getTransactionStatusLabel("Transit").title
        : getTransactionStatusLabel("Transit").title,
      description: isRider ? "You are on your way" : "The rider is on the way",
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
      title: isRider
        ? getTransactionStatusLabel("Nearby").title
        : "Rider is nearby",
      description: isRider
        ? "You are near the customer location"
        : "The rider is near your location",
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
      title: "Confirmed Pickup",
      description: isRider
        ? transaction?.serviceType == "Pahatod"
          ? "You have pick up the customer"
          : "You delivered the goods"
        : transaction?.serviceType == "Pahatod"
        ? "You are now with your rider"
        : "Your goods is delivered",
      circleColor:
        transaction?.status === "Pickup"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      lineColor:
        transaction?.status === "Pickup"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      titleStyle: {
        color:
          transaction?.status === "Pickup"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
      descriptionStyle: {
        color:
          transaction?.status === "Pickup"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
    },
    {
      time: "6",
      title:
        transaction?.serviceType == "Pahatod"
          ? "Confirmed Drop Off"
          : "Confirm Delivery",
      description: isRider
        ? transaction?.serviceType == "Pahatod"
          ? "You have drop off the customer"
          : "The customer checked the goods"
        : transaction?.serviceType == "Pahatod"
        ? "You are now in your destination"
        : "Successfully confirmed the deliery",
      circleColor:
        transaction?.status === "DropOff"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      lineColor:
        transaction?.status === "DropOff"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      titleStyle: {
        color:
          transaction?.status === "DropOff"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
      descriptionStyle: {
        color:
          transaction?.status === "DropOff"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
    },
    {
      time: "7",
      title: "Transaction Complete",
      description: isRider
        ? "The transaction is complete"
        : "The transaction is complete",
      circleColor:
        transaction?.status === "Completed"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      lineColor:
        transaction?.status === "Completed"
          ? "rgba(184, 11, 0, 1)"
          : "rgba(128, 128, 128, 0.5)",
      titleStyle: {
        color:
          transaction?.status === "Completed"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
      descriptionStyle: {
        color:
          transaction?.status === "Complete"
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0.5)",
      },
    },
  ];

  const handleCancelTransaction = () => {
    cancelTransaction(transaction, cancellationReason);
  };

  const handleCompletePayment = () => {
    if (transaction.paymentMethod == "Cash") {
      completeTransaction(transaction);
    }
  };

  if (transaction?.status == "Completed") {
    return (
      <>
        <TransactionSummary navigation={navigation} data={transaction} />
      </>
    );
  }

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

            <Image
              style={{ width: 250, height: 250 }}
              source={require("../assets/screenAssest/Onboarding.png")}
            />

            <View>
              <Text style={{ opacity: 0.5, fontSize: 15, marginBottom: 5 }}>
                Reason of cancellation:
              </Text>
              <TextInput
                editable={false}
                style={{
                  backgroundColor: "#D6D6D6",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 14,
                  color: "#333",
                  minHeight: 60,
                  textAlignVertical: "top",
                  marginBottom: 10,
                }}
                placeholder="Enter any additional information"
                placeholderTextColor="#888"
                value={transaction.cancellationReason}
                multiline
              />
            </View>

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
            backgroundColor: isRider ? "#003082" : "#B80B00",
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
                {isRider ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
                    <View
                      style={{
                        width: 13,
                        height: 13,
                        backgroundColor: "red",
                        borderRadius: 100,
                        marginRight: 5,
                      }}
                    ></View>

                    <View style={{ marginLeft: 5 }}>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Live Tracking
                      </Text>
                      <Text style={{ opacity: 0.5 }}>
                        Track your rider in realtime
                      </Text>
                    </View>
                  </View>
                </View>
                <AntDesign name="arrowright" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(
                    currentUser.role == "Rider"
                      ? "RiderTransactionDetails"
                      : "TransactionDetails"
                  );
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
                      <Text style={{ opacity: 0.5 }}>
                        View your transaction details
                      </Text>
                    </View>
                  </View>
                </View>
                <AntDesign name="arrowright" size={24} color="black" />
              </TouchableOpacity>
              {transaction.serviceType == "Padara" && (
                <TouchableOpacity
                  onPress={() => {
                    if (transaction) {
                      navigation.navigate("Receipts", { transaction });
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    paddingHorizontal: 13,
                    marginBottom: 20,
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
                      <MaterialIcons name="receipt" size={20} />

                      <View style={{ marginLeft: 8 }}>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                          Delivery Receipts
                        </Text>
                        <Text style={{ opacity: 0.5 }}>
                          View your delivery receipts
                        </Text>
                      </View>
                    </View>
                  </View>
                  <AntDesign name="arrowright" size={24} color="black" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                disabled
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: 13,
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
                    {transaction.paymentMethod == "Cash" && (
                      <Image
                        style={{ width: 25, height: 25 }}
                        source={paymentMethods[0].logo}
                      />
                    )}
                    {transaction.paymentMethod == "Gcash" && (
                      <Image
                        style={{ width: 25, height: 25 }}
                        source={paymentMethods[1].logo}
                      />
                    )}
                    {transaction.paymentMethod == "Bear Wallet" && (
                      <Image
                        style={{ width: 25, height: 25 }}
                        source={paymentMethods[2].logo}
                      />
                    )}
                    {!transaction.paymentMethod && (
                      <MaterialIcons name="payment" size={24} color="black" />
                    )}
                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Payment Method
                      </Text>
                      <Text style={{ opacity: 0.5 }}>
                        {transaction.paymentMethod}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {currentUser.role !== "Rider" && (
                <View
                  style={{
                    width: "100%",
                    paddingHorizontal: 20,
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: "gray", marginBottom: 3 }}>
                    Tip (Optional)
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TextInput
                      onChangeText={(text) => setTip(parseInt(text))}
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 5,
                        flex: 1,
                        backgroundColor: "#C6C6C6",
                      }}
                    />
                    {transaction.tip <= 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          addTip(transaction, tip);
                          Toast.show({
                            type: "success",
                            text1: "Successfully added tip",
                          });
                        }}
                        style={{
                          marginLeft: 10,
                          backgroundColor: "#B80B00",
                          paddingVertical: 3,
                          paddingHorizontal: 10,
                          borderRadius: 5,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "white" }}>Add</Text>
                        <AntDesign name="plus" size={15} color="white" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {/* Buttons */}
              {transaction.status !== "DropOff" && (
                <TouchableOpacity
                  onPress={() => {
                    setCancelModal(true);
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
              )}
              {transaction.status == "DropOff" &&
                currentUser.role !== "Rider" && (
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Button
                      width={"100%"}
                      event={() => {
                        if (transaction.paymentMethod == "Cash") {
                          setModalCash(true);
                        }
                        if (transaction.paymentMethod == "Gcash") {
                          navigation.navigate("Paymongo", { transaction });
                        }
                        if (transaction.paymentMethod == "Bear Wallet") {
                          navigation.navigate("Scanner", { transaction });
                        }
                      }}
                      text="Proceed To Payment"
                      bgColor={"#B80B00"}
                    />
                  </View>
                )}

              {transaction.status == "DropOff" &&
                currentUser.role == "Rider" &&
                transaction.paymentMethod !== "Gcash" && (
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Button
                      width={"100%"}
                      event={() => {
                        if (transaction.paymentMethod == "Cash") {
                          setModalCash(true);
                        }
                        if (transaction.paymentMethod == "Bear Wallet") {
                          setQrModal(true);
                        }
                      }}
                      text="Received Payment"
                      bgColor={"#B80B00"}
                    />
                  </View>
                )}
            </>
          )}
        </ScrollView>

        <PopupModal
          open={modalCash}
          handleClose={() => {
            setModalCash(false);
          }}
        >
          <PayModalContent
            handleConfirm={handleCompletePayment}
            isRider={currentUser.role == "Rider"}
            price={transaction.totalPrice}
          />
        </PopupModal>

        <BottomModal
          modalVisible={qrModal}
          closeModal={() => setQrModal(false)}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
              Account Name:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {currentUser.firstName + " " + currentUser.lastName}
              </Text>
            </Text>
            <QRCode logo={logo} size={300} value={currentUser.id} />
          </View>
        </BottomModal>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LottieView
        style={{ width: 300, height: 300 }}
        autoPlay
        source={require("../assets/detect.json")}
      />
      <Text style={{ fontSize: 20 }}>Getting the live transaction...</Text>
    </View>
  );
};

export default LiveTransaction;
