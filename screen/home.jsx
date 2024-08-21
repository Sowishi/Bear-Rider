import { StatusBar } from "expo-status-bar";
import { TextInput, View } from "react-native";
import Constants from "expo-constants";

import MapView, { Callout } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Home = ({ route, navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: "#FAF5FC",
      }}
    >
      <StatusBar backgroundColor={"white"} style="dark" />

      <View style={{ flex: 1, position: "relative" }}>
        <MapView
          showsTraffic={true}
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={true}
          style={{ flex: 1, minHeight: 500, minWidth: 500 }}
          initialRegion={{
            latitude: 14.0996,
            longitude: 122.955,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        ></MapView>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 20,
            marginTop: 25,
          }}
        >
          <Entypo
            onPress={() => {
              navigation.openDrawer();
            }}
            name="menu"
            size={35}
            color="#B80B00"
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 3,
              paddingHorizontal: 10,
              backgroundColor: "white",
              borderRadius: 10,
              flex: 1,
              marginHorizontal: 25,
            }}
          >
            <TextInput
              secureTextEntry
              placeholder="Your Location"
              style={{
                flex: 1,
                paddingVertical: 9,
                paddingHorizontal: 10,
              }}
            />
          </View>
          <FontAwesome name="bell" size={24} color="#B80B00" />
        </View>
      </View>
    </View>
  );
};

export default Home;
