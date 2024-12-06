import { TouchableOpacity, View, Text, Image } from "react-native";
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

const LiveTransaction = ({ navigation }) => {
  const { setFindingRider, selectedTransaction } = useSmokeContext();
  const { getTransaction } = useCrudTransaction();
  const [transaction, setTransaction] = useState();

  useEffect(() => {
    getTransaction(selectedTransaction.id, setTransaction);
  }, []);

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
  return (
    <View>
      <Text>LiveTransaction</Text>
      <TouchableOpacity
        onPress={() => {
          setFindingRider(false);
          navigation.navigate("drawer");
        }}
        style={{ backgroundColor: "red", padding: 50 }}
      >
        <Text>Cancel</Text>
      </TouchableOpacity>
      <>
        {transaction?.status == undefined && (
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
                        latitude: transaction?.riderLocation.latitude,
                        longitude: transaction?.riderLocation.longitude,
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
                source={{ uri: transaction?.rider?.selfieUrl }}
              />
              <View>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {transaction?.rider?.firstName} {transaction.rider?.lastName}
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
                    {transaction?.riderLocation && location && (
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                        }}
                      >
                        Rider:{" "}
                        {haversineDistance(
                          {
                            latitude: transaction?.riderLocation.latitude,
                            longitude: transaction?.riderLocation.longitude,
                          },
                          location
                        )}{" "}
                        km (
                        {calculateArrivalTime(
                          haversineDistance(
                            {
                              latitude: transaction?.riderLocation.latitude,
                              longitude: transaction?.riderLocation.longitude,
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
                {transaction.rider.motorcycle}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: "#B80B00",
                  fontWeight: "bold",
                }}
              >
                {transaction.rider.plateNumber}
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
            Total: ₱{parseInt(transaction?.totalPrice)}
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
        {transaction?.status && (
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
              onPress={() => dialPhone(transaction.rider.phoneNumber)}
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
                    ? transaction.currentUser.id
                    : transaction.rider.id,
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
              settransaction(null);
              setBookLocation(null);
              setViewRiderState(false);
              setShowBook(true);
              // deleteTransaction(currentUser);
            }}
            text="Close"
            bgColor={"#00308299"}
          />
          {!transaction?.status ? (
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

          {/* {transaction?.status == "Accepted" && (
                <Button
                  width={150}
                  event={() => {
                    setFindingRider(false);
                    setPahatodModal(false);
                    setSelectedLocation(null);
                    setSelectedTransaction(null);
                    settransaction(null);
                    completeTransaction(transaction);
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
    </View>
  );
};

export default LiveTransaction;
