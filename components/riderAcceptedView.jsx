import { Image, Text, View } from "react-native";
import cod from "../assets/cash-on-delivery.png";

const RiderAcceptedView = ({ singleData, chargePerKilometer }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        minHeight: 50,
        width: "100%",
        paddingVertical: 20,
        borderRadius: 10,
      }}
    >
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              height: 6,
              width: 150,
              backgroundColor: "gray",
              marginBottom: 30,
              borderRadius: 20,
            }}
          ></View>
          <Text
            style={{
              fontSize: 25,
              color: "black",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            {singleData?.serviceType == "Pahatod"
              ? "Transportation Service"
              : "Delivery Service"}
          </Text>
          <Image
            style={{ width: 75, height: 75 }}
            source={{
              uri: singleData?.currentUser.profilePic,
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
            {singleData?.currentUser.firstName}{" "}
            {singleData?.currentUser.lastName}
          </Text>
        </View>
      </View>

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
          Total: ₱{(singleData?.distance * chargePerKilometer).toFixed(2)}
        </Text>
      </View>
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
        <Image source={cod} style={{ width: 20, height: 20, marginRight: 5 }} />
        <Text>Cash on Arrival</Text>
      </View>
    </View>
  );
};

export default RiderAcceptedView;
