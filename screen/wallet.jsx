import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";
import useCrudWallet from "../hooks/useCrudWallet";
import { useEffect } from "react";
import { useSmokeContext } from "../utils/appContext";
import moment from "moment";

const Wallet = () => {
  const { data, getWallet, getTransactionHistory, transactionHistory } =
    useCrudWallet();

  const { currentUser } = useSmokeContext();
  useEffect(() => {
    if (currentUser.id) {
      getWallet(currentUser.id);
      getTransactionHistory(currentUser.id);
    }
  }, []);

  console.log(transactionHistory);

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        paddingVertical: 50,
        paddingHorizontal: 30,
      }}
    >
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
      <ScrollView style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Transaction History
        </Text>
        {transactionHistory.length >= 1 && (
          <>
            {transactionHistory.map((item) => {
              const date = item.date
                ? moment(item.date.toDate()).format("LLL")
                : "...";
              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.27,
                    shadowRadius: 4.65,
                    elevation: 6,
                    backgroundColor:
                      item.type === "plus" ? "#e8f7e2" : "#fce7e6",
                    padding: 15,
                    borderRadius: 10,
                    borderLeftWidth: 5,
                    borderLeftColor:
                      item.type === "plus" ? "#4CAF50" : "#F44336",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Icon for type */}
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor:
                          item.type === "plus" ? "#4CAF50" : "#F44336",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>
                        {item.type === "plus" ? "↑" : "↓"}
                      </Text>
                    </View>
                    {/* Transaction details */}
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {item.serviceType === "Pahatod"
                          ? "Transportation"
                          : "Delivery"}
                      </Text>
                      <Text style={{ color: "#666" }}>{date}</Text>
                    </View>
                  </View>

                  {/* Amount with conditional color */}
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: item.type === "plus" ? "#4CAF50" : "#F44336",
                    }}
                  >
                    {item.type === "plus" ? "+" : "-"} ₱{parseInt(item.amount)}
                  </Text>
                </View>
              );
            })}
          </>
        )}
        {transactionHistory.length <= 0 && (
          <>
            <Text style={{ textAlign: "center", marginTop: 50 }}>
              No Transaction Yet.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Wallet;
