import {
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import Button from "./button";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
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

const PahatodCustomerView = ({
  findingRider,
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
}) => {
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geocode.length > 0) {
        const address = `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].region}, ${geocode[0].postalCode}, ${geocode[0].country}`;
        return address;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const jumpToMarker = (coords) => {
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.009, longitudeDelta: 0.009 },
      1000
    );
  };

  useEffect(() => {
    pahatodInputRef.current?.setAddressText("Camarines Norte: ");
    bookLocationRef.current?.setAddressText("Camarines Norte: ");
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

  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmDelivery, setConfirmDelivery] = useState(false);

  const {
    setMessageInfo,
    currentUser,
    setBookLocation,
    bookLocationRef,
    setViewRiderState,
    setShowBook,
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
        text={
          serviceType == "Padara"
            ? "Delivery fee will be deducted from your system wallet. Please pay for goods in cash upon delivery"
            : "Would you like to proceed?"
        }
        handleConfirm={() => {
          if (serviceType == "Pahatod") {
            handleAddTransaction();
            setConfirmDelivery(false);
          } else {
            setTransactionRemarksModal(true);
            setConfirmDelivery(false);
          }
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
            <Text
              style={{
                fontSize: 25,
                color: "black",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              {serviceType == "Pahatod"
                ? "Transportation Service"
                : "Delivery Service"}
            </Text>

            {/* Current Location of customer      */}
            <>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: 5,
                }}
              >
                <Text style={{ marginBottom: 5 }}>
                  {serviceType == "Pahatod"
                    ? "Pick Up Location"
                    : "Drop Off Location"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setBookLocation(location);
                    bookLocationRef.current?.setAddressText(location.address);
                  }}
                  style={{
                    backgroundColor: "#FFC30E",
                    borderRadius: 5,
                    marginLeft: 10,
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Use My Location
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                  paddingHorizontal: 10,
                  backgroundColor: "white",
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <GooglePlacesAutocomplete
                  ref={bookLocationRef}
                  enablePoweredByContainer={false}
                  renderLeftButton={() => {
                    return <Image source={redMarker} />;
                  }}
                  styles={{
                    textInputContainer: {
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      paddingVertical: 3,
                    },
                    textInput: { marginHorizontal: 10 },
                  }}
                  placeholder={serviceType == "Pahatod" ? "Pick Up" : "Shop to"}
                  onPress={async (data, details = null) => {
                    const lat = details?.geometry?.location.lat;
                    const lng = details?.geometry?.location.lng;
                    const address = await reverseGeocode(lat, lng);

                    jumpToMarker({
                      longitude: lng,
                      latitude: lat,
                    });
                    setBookLocation({
                      latitude: lat,
                      longitude: lng,
                      address,
                    });
                  }}
                  fetchDetails={true}
                  GooglePlacesDetailsQuery={{ fields: "geometry" }}
                  query={{
                    key: "AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI",
                    language: "en",
                    components: "country:ph",
                  }}
                />
              </View>
            </>

            {/* Drop of or shop to location */}
            <>
              <View style={{ width: "100%" }}>
                <Text style={{ marginBottom: 5 }}>
                  {serviceType == "Pahatod"
                    ? "Drop Off Location"
                    : "Shop to location"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                  paddingHorizontal: 10,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
              >
                <GooglePlacesAutocomplete
                  ref={pahatodInputRef}
                  enablePoweredByContainer={false}
                  renderLeftButton={() => {
                    return <Image source={blueMarker} />;
                  }}
                  styles={{
                    textInputContainer: {
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      paddingVertical: 3,
                    },
                    textInput: { marginHorizontal: 10 },
                  }}
                  placeholder={
                    serviceType == "Pahatod" ? "Drop Off" : "Shop to"
                  }
                  onPress={async (data, details = null) => {
                    const lat = details?.geometry?.location.lat;
                    const lng = details?.geometry?.location.lng;
                    const address = await reverseGeocode(lat, lng);

                    jumpToMarker({
                      longitude: lng,
                      latitude: lat,
                    });
                    setSelectedLocation({
                      latitude: lat,
                      longitude: lng,
                      address,
                    });
                  }}
                  fetchDetails={true}
                  GooglePlacesDetailsQuery={{ fields: "geometry" }}
                  query={{
                    key: "AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI",
                    language: "en",
                    components: "country:ph",
                  }}
                />
              </View>
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
              <Button
                event={() => {
                  setPahatodModal(false);
                  setSelectedLocation(null);
                  setBookLocation(null);
                }}
                width={selectedLocation ? 150 : 250}
                style={{ marginTop: 20 }}
                text="Close"
                bgColor={"#00308299"}
              />
              {selectedLocation && (
                <Button
                  event={() => setConfirmDelivery(true)}
                  width={150}
                  style={{ marginTop: 20 }}
                  text="Continue"
                  bgColor={"#B80B00"}
                />
              )}
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
