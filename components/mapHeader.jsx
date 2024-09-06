import { Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { TextInput, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const MapHeader = ({
  IS_RIDER,
  location,
  mapRef,
  navigation,
  isOnline,
  setIsOnline,
  setNoficationModal,
}) => {
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
          position: "absolute",
          top: 0,
          left: 0,
          flex: 1,
          width: "90%",
          marginHorizontal: 20,
          marginTop: 25,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 2,
              borderRadius: 10,
            }}
          >
            <Entypo
              name="menu"
              size={30}
              color={IS_RIDER ? "#003082" : "#B80B00"}
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "flex-start",
              marginHorizontal: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                jumpToMarker({
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                });
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                Current Location
              </Text>
              <TextInput
                editable={false}
                value={location?.address}
                style={{
                  backgroundColor: "white",
                  paddingVertical: 5,
                  borderRadius: 10,
                  paddingHorizontal: 5,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 4,
              borderRadius: 10,
            }}
          >
            {!IS_RIDER ? (
              <FontAwesome
                onPress={() => setNoficationModal(true)}
                name="bell"
                size={25}
                color={"#B80B00"}
              />
            ) : (
              <FontAwesome5
                onPress={() => setIsOnline(!isOnline)}
                name="power-off"
                size={24}
                color="#003082"
              />
            )}
          </View>
        </View>

        {IS_RIDER && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "white",
              marginTop: 10,
              paddingVertical: 6,
              borderRadius: 10,
              marginHorizontal: 70,
            }}
          >
            <Text style={{ fontSize: 15, marginRight: 5 }}>
              {isOnline ? "You're online" : "You're Offline"}
            </Text>
            <View
              style={{
                height: 15,
                borderRadius: 300,
                width: 15,
                backgroundColor: isOnline ? "#08B783" : "#B80B00",
              }}
            ></View>
          </View>
        )}
      </View>
    </>
  );
};

export default MapHeader;
