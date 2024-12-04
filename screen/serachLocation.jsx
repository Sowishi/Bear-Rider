import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const SearchLocation = ({ refRBSheet, setSearchLocation, setSelected }) => {
  const searchRef = useRef();

  useEffect(() => {
    searchRef.current?.setAddressText("Camarines Norte: ");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => refRBSheet.current.close()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Entypo name="location-pin" size={24} color="red" />
          <Text style={styles.titleText}>Search Location</Text>
        </View>
      </View>

      <GooglePlacesAutocomplete
        keepResultsAfterBlur={false}
        ref={searchRef}
        placeholder="Search Location"
        enablePoweredByContainer={true}
        styles={googlePlacesStyles}
        fetchDetails
        onPress={(data, details = null) => {
          if (details) {
            const { lat, lng } = details.geometry.location;
            setSearchLocation({
              latitude: lat,
              longitude: lng,
              address: data.description,
            });
            setSelected("searchLocation");
            refRBSheet.current.close();
          }
        }}
        query={{
          key: "AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI",
          language: "en",
          components: "country:ph",
        }}
        GooglePlacesDetailsQuery={{
          fields: ["geometry"],
        }}
      />
      <View
        style={{
          bottom: 0,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 0,
        }}
      >
        <Image
          style={{ width: 200, height: 200 }}
          source={require("../assets/bear3.png")}
        />
      </View>
    </View>
  );
};

const styles = {
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  titleText: {
    fontSize: 23,
    fontWeight: "bold",
  },
};

const googlePlacesStyles = {
  container: { paddingHorizontal: 20 },
  textInputContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 20,
  },
  textInput: { marginHorizontal: 10 },
};

export default SearchLocation;
