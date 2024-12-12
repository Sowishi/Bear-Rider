import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSmokeContext } from "../utils/appContext";
import useCrudTransaction from "../hooks/useCrudTransaction";
import { handleUploadImage } from "../utils/handleUploadImage";
import Toast from "react-native-toast-message";

const Receipts = ({ navigation, route }) => {
  const { transaction } = route.params || {};
  const { confirmOrderDetails } = useCrudTransaction();
  const { proof, setProof, currentUser } = useSmokeContext();
  const [purchaseCost, setPurchaseCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleDelete = (id) => {
    const copyProof = [...proof];
    const output = copyProof.filter((item) => {
      if (item !== id) {
        return item;
      }
    });
    setProof(output);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const proofUrls = [];

    // Loop through the proof array and upload each image
    for (let i = 0; i < proof?.length; i++) {
      const uploadedUrl = await handleUploadImage(proof[i]);
      proofUrls.push(uploadedUrl); // Add the uploaded URL to the array
    }
    confirmOrderDetails(
      transaction.id,
      purchaseCost,
      proofUrls,
      purchaseCost + parseInt(transaction.totalPrice),
      transaction.totalPrice
    );
    setLoading(false);
    Toast.show({ type: "success", text1: "Successfully submited receipts" });
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, padding: 25 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Receipts</Text>
          {currentUser.role == "Rider" && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("BearCamera", {
                  isProof: true,
                  transaction,
                });
              }}
            >
              <AntDesign name="plus" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {transaction.proofOfPurchase ? (
            <>
              {transaction.proofOfPurchase.map((item) => {
                console.log(item);
                return (
                  <View
                    key={item}
                    style={{ position: "relative", marginVertical: 20 }}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: 250,
                        borderRadius: 10,
                      }}
                      source={{
                        uri: item,
                      }}
                    />
                  </View>
                );
              })}
            </>
          ) : (
            <>
              {proof.map((item) => {
                return (
                  <View
                    key={item}
                    style={{ position: "relative", marginVertical: 20 }}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: 250,
                        borderRadius: 10,
                      }}
                      source={{
                        uri: item,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        handleDelete(item);
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
                        position: "absolute",
                        right: 10,
                        top: 10,
                      }}
                    >
                      <AntDesign name="delete" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>
      </View>
      {currentUser.role == "Rider" && (
        <View style={{ padding: 25 }}>
          <View>
            <Text style={{ color: "red" }}>Purchase Cost</Text>
            <TextInput
              keyboardType="numeric"
              onChangeText={(text) => setPurchaseCost(parseInt(text))}
              placeholder="Enter the Purchase Cost"
              style={{
                shadowColor: "#000",
                backgroundColor: "white",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,

                elevation: 2,
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
            />
          </View>
          <TouchableOpacity
            disabled={!(proof.length >= 1 && purchaseCost > 0)}
            onPress={handleSubmit}
            style={{
              backgroundColor:
                proof.length >= 1 && purchaseCost > 0 ? "#AA2D31" : "#AA2D3199",
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {loading ? (
                <ActivityIndicator color={"white"} size={"large"} />
              ) : (
                "Save Receipts"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Receipts;
