import { Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { TextInput, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";

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
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
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
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
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
              }}
            >
              <AntDesign name="menufold" size={24} color="black" />
            </TouchableOpacity>
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
