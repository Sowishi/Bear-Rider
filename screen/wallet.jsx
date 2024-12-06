import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import useCrudWallet from "../hooks/useCrudWallet";
import { useSmokeContext } from "../utils/appContext";
import AntDesign from "@expo/vector-icons/AntDesign";

const Wallet = ({ navigation }) => {
  const { data, getWallet, getTransactionHistory, transactionHistory } =
    useCrudWallet();
  const { currentUser } = useSmokeContext();
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (currentUser?.id) {
      await getWallet(currentUser.id);
      await getTransactionHistory(currentUser.id);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const viewAllTransactions = () => {
    navigation.navigate("viewAllWallet");
    // Add your navigation or modal logic here
  };

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 50,
        paddingHorizontal: 30,
        backgroundColor: "white",
      }}
    >
      <View style={{ flex: 1, paddingTop: 30 }}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Wallet Balance:{" "}
          <Text style={{ fontWeight: "bold", color: "#B80B00" }}>
            ₱{data?.balance?.toLocaleString() || 0}
          </Text>
        </Text>
        <LinearGradient
          end={{ y: 0.5, x: 0.2 }}
          style={{
            height: 200,
            borderRadius: 20,
            marginTop: 20,
            justifyContent: "space-between",
            padding: 20,
          }}
          colors={["#BA1100", "#F7AF0C"]}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Bear Rider Wallet
          </Text>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
            {data?.id || "N/A"}
          </Text>
        </LinearGradient>
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Transaction History
          </Text>
          <TouchableOpacity
            onPress={viewAllTransactions}
            style={{
              backgroundColor: "#FEF3F7",
              padding: 7,
              borderRadius: 100,
            }}
          >
            <AntDesign name="arrowright" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {transactionHistory?.length > 0 ? (
          transactionHistory.slice(0, 3).map((item) => {
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
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor: "white",
                  shadowColor: item.type === "plus" ? "#4CAF50" : "#F44336",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
          })
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              style={{ width: 150, height: 150 }}
              source={require("../assets/screenAssest/No Wallet History.png")}
            />
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              There's no wallet history
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Wallet;
