import { TouchableOpacity, View, Text, Image, TextInput } from "react-native";
import Button from "./button";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";

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
        {!findingRider && (
          <>
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
                <View style={{ width: "100%" }}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={{ uri: singleData?.rider.profilePic }}
                  />
                  <Text style={{ fontSize: 15 }}>
                    {singleData?.rider.firstName} {singleData.rider.lastName}
                  </Text>
                </View>
              </>
            )}

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              {location && selectedLocation && (
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                  }}
                >
                  Destination Distance: {distance} km
                </Text>
              )}
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
