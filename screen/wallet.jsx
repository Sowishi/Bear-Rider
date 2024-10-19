import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

const Wallet = () => {
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Wallet Balance: 2,500
        </Text>
        <LinearGradient
          end={{ y: 0.5, x: 0.2 }}
          style={{
            height: 200,
            borderRadius: 20,
            marginTop: 20,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
          colors={["#BA1100", "#F7AF0C"]}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              padding: 20,
              fontSize: 20,
            }}
          >
            Bear Rider Wallet
          </Text>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              padding: 20,
              fontSize: 20,
            }}
          >
            1738 8371 1738
          </Text>
        </LinearGradient>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Transaction History
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,

            elevation: 6,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <View>
            <Text style={{ fontSize: 18 }}>Delivery</Text>
            <Text>Aug 32, 2023</Text>
          </View>
          <Text>+100</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,

            elevation: 6,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <View>
            <Text style={{ fontSize: 18 }}>Delivery</Text>
            <Text>Aug 32, 2023</Text>
          </View>
          <Text>+100</Text>
        </View>
      </View>
    </View>
  );
};

export default Wallet;
