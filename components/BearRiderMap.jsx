import MapView, { Marker } from "react-native-maps";
import { useSmokeContext } from "../utils/appContext";
import MapViewDirections from "react-native-maps-directions";
import { Image, Text, View, Dimensions } from "react-native";
import people from "../assets/icons8-human-24 1.png";
import rider from "../assets/motorcyle.png";
import shop from "../assets/image 14.png";
import { useEffect, useRef, useState } from "react";
import { PROVIDER_GOOGLE } from "react-native-maps";
import useAddOnline from "../hooks/useAddOnline";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { riderMapStyle } from "../utils/riderMapStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const BearRiderMap = ({
  location,
  selectedLocation,
  setSelectedLocation,
  selectedTransaction,
  isOnline,
  IS_RIDER,
  pahatodInputRef,
  mapRef,
  singleData,
}) => {
  const {
    mapView,
    currentUser,
    viewDirection,
    bookLocation,
    bookLocationRef,
    setBookLocation,
  } = useSmokeContext();
  const { onlineUsers } = useAddOnline();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const [mapLoading, setMapLoading] = useState(true);

  const MarkerUserImage = () => {
    return <FontAwesome name="user" size={30} color="#B80B00" />;
  };

  const MarkerRiderImage = () => {
    return <FontAwesome name="motorcycle" size={30} color="#003082" />;
  };

  const ShopImage = () => {
    return <FontAwesome5 name="store" size={30} color="#FFC30E" />;
  };

  const jumpToMarker = (coords) => {
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.009, longitudeDelta: 0.009 },
      1000
    );
  };
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

  return (
    <>
      {mapLoading && (
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            height: screenHeight,
            width: screenWidth,
            zIndex: 9999,
          }}
        >
          <LottieView
            autoPlay
            style={{ width: 200, height: 200 }}
            source={require("../assets/maps.json")}
          />
        </View>
      )}

      <MapView
        customMapStyle={IS_RIDER ? riderMapStyle : ""}
        onMapLoaded={() => {
          setMapLoading(false);
        }}
        mapType={mapView}
        showsBuildings
        showsUserLocation
        ref={mapRef}
        showsTraffic={true}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1, minHeight: screenHeight, minWidth: screenWidth }}
        initialRegion={{
          latitude: 14.0996,
          longitude: 122.955,
          latitudeDelta: 0.8,
          longitudeDelta: 0.5,
        }}
        region={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        }}
      >
        {/* Current Location */}
        {location && (
          <Marker
            onPress={() =>
              jumpToMarker({
                latitude: location?.latitude,
                longitude: location?.longitude,
              })
            }
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
            title="Current Location"
            description="This is where you are"
            pinColor={"#B80B00"}
          />
        )}
        {/* Book Location of the Customer */}
        {bookLocation && (
          <Marker
            draggable={!singleData}
            onDragEnd={async (event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              const address = await reverseGeocode(latitude, longitude);
              bookLocationRef.current?.setAddressText(address);

              setBookLocation({ latitude, longitude, address });
            }}
            onPress={() =>
              jumpToMarker({
                latitude: bookLocation?.latitude,
                longitude: bookLocation?.longitude,
              })
            }
            coordinate={{
              latitude: bookLocation?.latitude,
              longitude: bookLocation?.longitude,
            }}
            pinColor="yellow"
            title="Book Location"
          />
        )}
        {selectedLocation && (
          <Marker
            draggable={!singleData}
            onDragEnd={async (event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              const address = await reverseGeocode(latitude, longitude);
              pahatodInputRef.current?.setAddressText(address);

              setSelectedLocation({ latitude, longitude, address });
            }}
            onPress={() =>
              jumpToMarker({
                latitude: selectedLocation?.latitude,
                longitude: selectedLocation?.longitude,
              })
            }
            coordinate={{
              latitude: selectedLocation?.latitude,
              longitude: selectedLocation?.longitude,
            }}
            pinColor="#003082"
            title="Selected Location"
          />
        )}
        {bookLocation && selectedLocation && (
          <MapViewDirections
            strokeWidth={4}
            strokeColor="#B80B00"
            origin={{
              latitude: bookLocation?.latitude,
              longitude: bookLocation?.longitude,
            }}
            destination={{
              latitude: selectedLocation?.latitude,
              longitude: selectedLocation?.longitude,
            }}
            apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
          />
        )}
        {/* Online Users */}
        {onlineUsers.length >= 1 &&
          !selectedTransaction &&
          (isOnline || !IS_RIDER) && (
            <>
              {onlineUsers?.map((user) => {
                if (user?.currentUser.id !== currentUser?.id) {
                  return (
                    <Marker
                      children={
                        user?.currentUser.role == "Rider" ? (
                          <MarkerRiderImage />
                        ) : (
                          <MarkerUserImage />
                        )
                      }
                      pinColor="yellow"
                      key={user.id}
                      onPress={() =>
                        jumpToMarker({
                          latitude: user.latitude,
                          longitude: user.longitude,
                        })
                      }
                      coordinate={{
                        latitude: user.latitude,
                        longitude: user.longitude,
                      }}
                      title={user?.currentUser.firstName}
                      description={
                        user?.currentUser.role == "Rider" ? "Rider" : "Customer"
                      }
                    />
                  );
                }
              })}
            </>
          )}
        {/* Rider Direction to Customer and Shop Location or Destination Location */}
        {selectedTransaction && IS_RIDER && viewDirection && (
          <>
            <Marker
              onPress={() =>
                jumpToMarker({
                  latitude: selectedTransaction.destination?.latitude,
                  longitude: selectedTransaction.destination?.longitude,
                })
              }
              coordinate={{
                latitude: selectedTransaction.destination?.latitude,
                longitude: selectedTransaction.destination?.longitude,
              }}
              title="Shop Location / Drop Off Location"
              pinColor="#003082"
            />
            <Marker
              children={<MarkerUserImage />}
              onPress={() =>
                jumpToMarker({
                  latitude: selectedTransaction.origin?.latitude,
                  longitude: selectedTransaction.origin?.longitude,
                })
              }
              coordinate={{
                latitude: selectedTransaction.origin?.latitude,
                longitude: selectedTransaction.origin?.longitude,
              }}
              title={selectedTransaction?.currentUser.firstName}
              description="Customer Location"
            />
            {/* Customer  to Destination  or Shop to location */}
            <MapViewDirections
              strokeWidth={4}
              strokeColor="#B80B00"
              origin={{
                latitude: selectedTransaction.origin?.latitude,
                longitude: selectedTransaction.origin?.longitude,
              }}
              destination={{
                latitude: selectedTransaction.destination?.latitude,
                longitude: selectedTransaction.destination?.longitude,
              }}
              apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
            />

            {/* Ridet to Customer Destintation */}
            <MapViewDirections
              strokeWidth={4}
              strokeColor="#FFC30E"
              origin={{
                latitude: location?.latitude,
                longitude: location?.longitude,
              }}
              destination={{
                latitude: selectedTransaction.origin?.latitude,
                longitude: selectedTransaction.origin?.longitude,
              }}
              apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
            />
          </>
        )}
        {singleData && !IS_RIDER && (
          <>
            <Marker
              onPress={() =>
                jumpToMarker({
                  latitude: singleData.destination?.latitude,
                  longitude: singleData.destination?.longitude,
                })
              }
              coordinate={{
                latitude: singleData.destination?.latitude,
                longitude: singleData.destination?.longitude,
              }}
              title="Destination / Drop Off"
              description="Customer Destination"
              pinColor={"#003082"}
            />

            <MapViewDirections
              strokeWidth={4}
              strokeColor="#B80B00"
              origin={{
                latitude: singleData.origin?.latitude,
                longitude: singleData.origin?.longitude,
              }}
              destination={{
                latitude: singleData.destination?.latitude,
                longitude: singleData.destination?.longitude,
              }}
              apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
            />

            {singleData.riderLocation && (
              <>
                <MapViewDirections
                  strokeWidth={4}
                  strokeColor="#003082"
                  origin={{
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                  }}
                  destination={{
                    latitude: singleData.riderLocation?.latitude,
                    longitude: singleData.riderLocation?.longitude,
                  }}
                  apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
                />
                <Marker
                  children={<MarkerRiderImage />}
                  onPress={() =>
                    jumpToMarker({
                      latitude: singleData.riderLocation?.latitude,
                      longitude: singleData.riderLocation?.longitude,
                    })
                  }
                  coordinate={{
                    latitude: singleData.riderLocation?.latitude,
                    longitude: singleData.riderLocation?.longitude,
                  }}
                  title={singleData?.rider.firstName}
                  description="Customer Location"
                />
              </>
            )}
          </>
        )}
      </MapView>
    </>
  );
};

export default BearRiderMap;
