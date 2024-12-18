import {
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import Button from "./button";
import { AntDesign } from "@expo/vector-icons";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
import haversineDistance from "../utils/calculateDistance";
import { useSmokeContext } from "../utils/appContext";
import calculateArrivalTime from "../utils/calculateArrivalTime";
import cod from "../assets/cash-on-delivery.png";
import { useEffect, useRef, useState } from "react";
import Timeline from "react-native-timeline-flatlist";
import { dialPhone } from "../utils/dialPhone";
import ConfirmationModal from "./confirmationModal";
import ConfirmDelivery from "./confirmDelivery";
import Entypo from "@expo/vector-icons/Entypo";

const PahatodCustomerView = ({
  setFindingRider,
  location,
  pahatodInputRef,
  handleAddTransaction,
  setPahatodModal,
  setSelectedLocation,
  mapRef,
  singleData,
  selectedLocation,
  distance,
  chargePerKilometer,
  setSelectedTransaction,
  setSingleData,
  deleteTransaction,
  completeTransaction,
  serviceType,
  setTransactionRemarksModal,
  setTransactionDetailsModal,
  baseFare,
  setMessageModal,
  IS_RIDER,
  navigation,
}) => {
  useEffect(() => {
    pahatodInputRef.current?.setAddressText("Camarines Norte: ");
    bookLocationRef.current?.setAddressText("Camarines Norte: ");
  }, []);

  const { findingRider } = useSmokeContext();

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

  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmDelivery, setConfirmDelivery] = useState(false);

  const {
    setMessageInfo,
    currentUser,
    setBookLocation,
    bookLocationRef,
    setViewRiderState,
    setShowBook,
    bookLocation,
    destination,
  } = useSmokeContext();

  return (
    <>
      <ConfirmationModal
        handleConfirm={() => {
          setFindingRider(false);
          setPahatodModal(false);
          setSelectedLocation(null);
          setSelectedTransaction(null);
          setSingleData(null);
          deleteTransaction(singleData);
          Toast.show({
            type: "success",
            text1: "Your ride is cancelled successfully.",
          });
          setBookLocation(null);
        }}
        open={confirmModal}
        handleClose={() => setConfirmModal(false)}
      />

      <ConfirmDelivery
        text={"Would you like to proceed?"}
        handleConfirm={() => {
          navigation.navigate("ConfirmTransaction", { serviceType });
          setConfirmDelivery(false);
        }}
        open={confirmDelivery}
        handleClose={() => setConfirmDelivery(false)}
      />

      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 20,
          flex: 1,
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "white",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          paddingVertical: 30,
        }}
      >
        <View
          style={{
            height: 6,
            width: 150,
            backgroundColor: "gray",
            marginBottom: 30,
            borderRadius: 20,
          }}
        ></View>

        {/* Still Finding a rider */}
        {!findingRider && (
          <>
            {/* Header Title */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginBottom: 20,
                width: 300,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setPahatodModal(false);
                  setSelectedLocation(null);
                  setBookLocation(null);
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
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 23,
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                {serviceType == "Pahatod"
                  ? "Transportation Service"
                  : "Delivery Service"}
              </Text>
            </View>

            {/* Pick up/ Delivered to of customer      */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("bearMap", { type: "pointA" });
              }}
              style={{
                padding: 15,
                marginTop: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: 200,
                }}
              >
                <Entypo name="location-pin" size={24} color="red" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {serviceType == "Pahatod"
                      ? "Pick Up Location"
                      : "Drop Off Location"}
                  </Text>
                  <Text style={{ fontStyle: "italic", fontSize: 13 }}>
                    {bookLocation?.address
                      ? bookLocation?.address
                      : "Please select location"}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#FFF5F6",
                  padding: 10,
                  borderRadius: 100,
                }}
              >
                <AntDesign name="arrowright" size={24} color="black" />
              </View>
            </TouchableOpacity>

            {/* Destination/Delivery Location of customer      */}
            <>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("bearMap", { type: "pointB" });
                }}
                style={{
                  padding: 15,
                  marginTop: 15,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: 200,
                    overflow: "hidden",
                  }}
                >
                  <Entypo name="location-pin" size={24} color="black" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      {serviceType == "Pahatod"
                        ? "Drop Off Location"
                        : "Shop To Location"}
                    </Text>
                    <Text style={{ fontStyle: "italic", fontSize: 13 }}>
                      {destination?.address
                        ? destination?.address
                        : "Please select location"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: "#FFF5F6",
                    padding: 10,
                    borderRadius: 100,
                  }}
                >
                  <AntDesign name="arrowright" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </>

            {/* Find a rider button */}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setConfirmDelivery(true);
                }}
                disabled={!destination}
                style={{
                  width: "100%",
                  backgroundColor: destination ? "#B80B00" : "#B80B0099",
                  paddingVertical: 15,
                  marginTop: 20,
                  borderRadius: 20,
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
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Rider Found */}

        {findingRider && (
          <>
            {singleData?.status == undefined && (
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
                  {singleData?.serviceType == "Pahatod"
                    ? "Transportation Service"
                    : "Delivery Service"}
                </Text>
                <LottieView
                  autoPlay
                  style={{ width: 100, height: 100 }}
                  source={require("../assets/maps.json")}
                />

                <Text
                  style={{
                    color: "black",
                    fontSize: 16,
                    marginBottom: 5,
                    textAlign: "center",
                  }}
                >
                  Waiting for a rider
                </Text>
              </>
            )}

            {singleData && singleData?.status !== undefined && (
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
                    {getTransactionStatusLabel(singleData.status)?.title}
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
                    {getTransactionStatusLabel(singleData.status)?.sub}
                  </Text>
                  {location && (
                    <Text
                      style={{
                        fontSize: 10,
                        marginBottom: 10,
                        color: "red",
                        fontStyle: "italic",
                        marginBottom: 15,
                        textAlign: "center",
                      }}
                    >
                      Your rider is arriving in{" "}
                      {calculateArrivalTime(
                        haversineDistance(
                          {
                            latitude: singleData?.riderLocation.latitude,
                            longitude: singleData?.riderLocation.longitude,
                          },
                          location
                        ),
                        60
                      )}{" "}
                      mins
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginVertical: 20,
                  }}
                >
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      marginRight: 10,
                      borderRadius: 100,
                    }}
                    source={{ uri: singleData?.rider?.selfieUrl }}
                  />
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      {singleData?.rider?.firstName}{" "}
                      {singleData.rider?.lastName}
                    </Text>
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        style={{ width: 15, height: 15, marginRight: 5 }}
                        source={redMarker}
                      />
                      <Text style={{ fontSize: 15 }}>
                        {singleData?.riderLocation && location && (
                          <Text
                            style={{
                              color: "black",
                              fontSize: 12,
                            }}
                          >
                            Rider:{" "}
                            {haversineDistance(
                              {
                                latitude: singleData?.riderLocation.latitude,
                                longitude: singleData?.riderLocation.longitude,
                              },
                              location
                            )}{" "}
                            km (
                            {calculateArrivalTime(
                              haversineDistance(
                                {
                                  latitude: singleData?.riderLocation.latitude,
                                  longitude:
                                    singleData?.riderLocation.longitude,
                                },
                                location
                              ),
                              60
                            )}{" "}
                            mins away )
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        style={{ width: 15, height: 15, marginRight: 5 }}
                        source={blueMarker}
                      />
                      <Text style={{ fontSize: 15 }}>
                        {location && selectedLocation && (
                          <View>
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                              }}
                            >
                              Destination: {distance} km
                            </Text>
                          </View>
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
                {/* Motorcyle and plate number */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "80%",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>
                    {singleData.rider.motorcycle}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      color: "#B80B00",
                      fontWeight: "bold",
                    }}
                  >
                    {singleData.rider.plateNumber}
                  </Text>
                </View>
              </>
            )}

            {/* Pricing */}

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 13,
                }}
              >
                Payment Method
              </Text>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Total: ₱{parseInt(singleData?.totalPrice)}
              </Text>
            </View>

            {/* Payment Method       */}
            <View
              style={{
                backgroundColor: "#FFB8B850",
                width: "100%",
                paddingVertical: 13,
                paddingHorizontal: 10,
                color: "white",
                flexDirection: "row",
                borderRadius: 10,
              }}
            >
              <Image
                source={cod}
                style={{ width: 20, height: 20, marginRight: 5 }}
              />
              <Text>Cash on Arrival</Text>
            </View>
            {singleData?.status && (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => dialPhone(singleData.rider.phoneNumber)}
                  style={{
                    borderWidth: 2,
                    width: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 5,
                    borderRadius: 5,
                    borderColor: "#003082",
                  }}
                >
                  <Text style={{ borderColor: "#003082" }}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMessageModal(true);
                    setMessageInfo({
                      receiver: IS_RIDER
                        ? singleData.currentUser.id
                        : singleData.rider.id,
                      sender: currentUser.id,
                    });
                  }}
                  style={{
                    borderWidth: 2,
                    width: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 5,
                    borderRadius: 5,
                    borderColor: "#003082",
                    backgroundColor: "#003082",
                  }}
                >
                  <Text style={{ borderColor: "#003082", color: "white" }}>
                    Message
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                event={() => setTransactionDetailsModal(true)}
                style={{ marginTop: 10 }}
                width={"90%"}
                text="Details"
                bgColor={"#003082"}
              />
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: "row" }}>
              <Button
                width={150}
                event={() => {
                  setFindingRider(false);
                  setPahatodModal(false);
                  setSelectedLocation(null);
                  setSelectedTransaction(null);
                  setSingleData(null);
                  setBookLocation(null);
                  setViewRiderState(false);
                  setShowBook(true);
                  // deleteTransaction(currentUser);
                }}
                text="Close"
                bgColor={"#00308299"}
              />
              {!singleData?.status ? (
                <Button
                  width={150}
                  event={() => {
                    setConfirmModal(true);
                  }}
                  text="Cancel Ride"
                  bgColor={"#B80B00"}
                />
              ) : (
                <Button
                  width={150}
                  event={() => {
                    setFindingRider(false);
                    setPahatodModal(false);
                    setSelectedLocation(null);
                    setViewRiderState(true);
                    setShowBook(false);
                  }}
                  text="Rider State"
                  bgColor={"#B80B00"}
                />
              )}

              {/* {singleData?.status == "Accepted" && (
                <Button
                  width={150}
                  event={() => {
                    setFindingRider(false);
                    setPahatodModal(false);
                    setSelectedLocation(null);
                    setSelectedTransaction(null);
                    setSingleData(null);
                    completeTransaction(singleData);
                    Toast.show({
                      type: "success",
                      text1: "Thank you for choosing, Bear Rider Express! 😊",
                    });
                  }}
                  text="Complete Ride"
                  bgColor={"green"}
                />
              )} */}
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default PahatodCustomerView;
