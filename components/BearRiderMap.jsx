import MapView, { Marker } from "react-native-maps";
import { useSmokeContext } from "../utils/appContext";
import MapViewDirections from "react-native-maps-directions";
import { Image } from "react-native";
import people from "../assets/user.png";
import rider from "../assets/motorcycle.png";
import { useRef } from "react";
import { PROVIDER_GOOGLE } from "react-native-maps";
import useAddOnline from "../hooks/useAddOnline";
import * as Location from "expo-location";

const BearRiderMap = ({
  location,
  selectedLocation,
  setSelectedLocation,
  selectedTransaction,
  isOnline,
  IS_RIDER,
  pahatodInputRef,
  mapRef,
}) => {
  const { mapView, currentUser } = useSmokeContext();
  const { onlineUsers } = useAddOnline();

  const MarkerUserImage = () => {
    return <Image source={people} style={{ width: 50, height: 50 }} />;
  };

  const MarkerRiderImage = () => {
    return <Image source={rider} style={{ width: 40, height: 40 }} />;
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
    <MapView
      mapType={mapView}
      showsBuildings
      showsUserLocation
      ref={mapRef}
      showsTraffic={true}
      provider={PROVIDER_GOOGLE}
      showsMyLocationButton={true}
      style={{ flex: 1, minHeight: 500, minWidth: 500 }}
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

      {selectedLocation && (
        <Marker
          draggable
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

      {location && selectedLocation && (
        <MapViewDirections
          strokeWidth={4}
          strokeColor="#B80B00"
          origin={{
            latitude: location?.latitude,
            longitude: location?.longitude,
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
      {selectedTransaction && IS_RIDER && (
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
            title="Destination / Drop Off"
            description="Customer Destination"
            pinColor={"#003082"}
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
          <MapViewDirections
            strokeWidth={4}
            strokeColor="#003082"
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
      {selectedTransaction && !IS_RIDER && (
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
            title="Destination / Drop Off"
            description="Customer Destination"
            pinColor={"#003082"}
          />

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

          {selectedTransaction.riderLocation && (
            <>
              <MapViewDirections
                strokeWidth={4}
                strokeColor="#003082"
                origin={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                }}
                destination={{
                  latitude: selectedTransaction.riderLocation?.latitude,
                  longitude: selectedTransaction.riderLocation?.longitude,
                }}
                apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
              />
              <Marker
                children={<MarkerRiderImage />}
                onPress={() =>
                  jumpToMarker({
                    latitude: selectedTransaction.riderLocation?.latitude,
                    longitude: selectedTransaction.riderLocation?.longitude,
                  })
                }
                coordinate={{
                  latitude: selectedTransaction.riderLocation?.latitude,
                  longitude: selectedTransaction.riderLocation?.longitude,
                }}
                title={selectedTransaction?.currentUser.firstName}
                description="Customer Location"
              />
            </>
          )}
        </>
      )}
    </MapView>
  );
};

export default BearRiderMap;
