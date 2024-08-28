import { Image, Text, View } from "react-native";

const RiderAcceptedView = ({ singleData, chargePerKilometer }) => {
  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: "white",
        bottom: 130,
        flex: 1,
        marginHorizontal: 20,
        minHeight: 50,
        width: "90%",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 10,
      }}
    >
      <View>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: singleData?.currentUser.profilePic,
          }}
        />
        <Text style={{ fontSize: 15 }}>
          {singleData?.currentUser.firstName} {singleData?.currentUser.lastName}
        </Text>
        <View
          style={{
            width: 100,
            height: 2,
            backgroundColor: "gray",
            marginVertical: 4,
          }}
        ></View>
      </View>
      <View
        style={{
          borderRadius: 10,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View>
          <Text>Service Type: {singleData?.serviceType}</Text>
          <Text>Distance: {singleData?.distance} km</Text>
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          Price: ₱{(singleData?.distance * chargePerKilometer).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default RiderAcceptedView;
