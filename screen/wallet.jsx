import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import useCrudWallet from "../hooks/useCrudWallet";
import { useEffect } from "react";
import { useSmokeContext } from "../utils/appContext";

const Wallet = () => {
  const { data, getWallet } = useCrudWallet();

  const { currentUser } = useSmokeContext();
  useEffect(() => {
    if (currentUser.id) {
      getWallet(currentUser.id);
    }
  }, []);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Wallet Balance:{" "}
          <Text style={{ fontWeight: "bold", color: "#B80B00" }}>
            ₱{data?.balance.toLocaleString()}
          </Text>
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
              fontSize: 15,
            }}
          >
            {data?.id}
          </Text>
        </LinearGradient>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Transaction History
        </Text>
        {data?.transaction.length >= 1 && (
          <>
            {data?.transaction.map((item) => {
              return (
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
              );
            })}
          </>
        )}
        {data?.transaction.length <= 0 && (
          <>
            <Text style={{ textAlign: "center", marginTop: 50 }}>
              No Transaction Yet.
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default Wallet;
