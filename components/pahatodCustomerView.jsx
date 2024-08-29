import { TouchableOpacity, View, Text, Image, TextInput } from "react-native";
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

  console.log(singleData);
  return (
    <>
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
        {!findingRider && (
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
              Pahatod Service
            </Text>
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
                backgroundColor: "#D3D3D3",
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <Image source={redMarker} />
              <TextInput
                editable={false}
                onChangeText={(text) => setEmail(text)}
                placeholder={location?.address}
                style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}
              />
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
                placeholder="Drop Off"
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
                }}
                width={150}
                style={{ marginTop: 20 }}
                text="Cancel"
                bgColor={"#00308299"}
              />
              <Button
                event={handleAddTransaction}
                width={150}
                style={{ marginTop: 20 }}
                text="Find a rider"
                bgColor={"#B80B00"}
              />
            </View>
          </>
        )}
        {findingRider && (
          <>
            {singleData?.status !== "Accepted" && (
              <>
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

            {singleData && singleData?.status == "Accepted" && (
              <>
                <View>
                  <Text
                    style={{
                      fontSize: 30,
                      marginBottom: 10,
                      color: "black",
                      fontWeight: "bold",
                      marginBottom: 15,
                      textAlign: "center",
                    }}
                  >
                    Arriving
                  </Text>
                  {location && (
                    <Text
                      style={{
                        fontSize: 13,
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
                            latitude: singleData.riderLocation.latitude,
                            longitude: singleData.riderLocation.longitude,
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
                    style={{ width: 80, height: 80, marginRight: 10 }}
                    source={{ uri: singleData?.rider?.profilePic }}
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
                                latitude: singleData.riderLocation.latitude,
                                longitude: singleData.riderLocation.longitude,
                              },
                              location
                            )}{" "}
                            km (
                            {calculateArrivalTime(
                              haversineDistance(
                                {
                                  latitude: singleData.riderLocation.latitude,
                                  longitude: singleData.riderLocation.longitude,
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
                Total: ₱{(distance * chargePerKilometer).toFixed(2)}
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
                  // deleteTransaction(currentUser);
                }}
                text="Hide Modal"
                bgColor={"#00308299"}
              />
              {singleData && singleData?.status !== "Accepted" && (
                <Button
                  width={150}
                  event={() => {
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
                  }}
                  text="Cancel Ride"
                  bgColor={"#B80B00"}
                />
              )}

              {singleData?.status == "Accepted" && (
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
              )}
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default PahatodCustomerView;