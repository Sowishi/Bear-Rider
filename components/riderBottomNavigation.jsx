import { TouchableOpacity, View, Text } from "react-native";
import Button from "./button";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useSmokeContext } from "../utils/appContext";
import Toast from "react-native-toast-message";
import useCrudNotification from "../hooks/useCrudNotification";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const RiderBottomNavigation = ({
  isOnline,
  singleData,
  setTransactionModal,
  setSingleData,
  setSelectedTransaction,
  acceptTransaction,
  selectedTransaction,
  setViewTransactionModal,
  location,
}) => {
  const {
    currentUser,
    transactionCount,
    setConversationModal,
    setWalletModal,
    setBookLocation,
    showRiderBubble,
  } = useSmokeContext();
  const { addNotification } = useCrudNotification();

  const handleAcceptTransaction = () => {
    acceptTransaction(selectedTransaction, currentUser, location);
    addNotification(selectedTransaction, currentUser, "accept rider");
    Toast.show({ type: "success", text1: "Successfully accepeted ride." });
  };

  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: "white",
        bottom: 20,
        flex: 1,
        marginHorizontal: 20,
        minHeight: 50,
        width: "90%",
        borderRadius: 10,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 20,
      }}
    >
      {isOnline ? (
        <>
          {singleData && showRiderBubble && (
            <View
              style={{
                marginVertical: 10,
                position: "absolute",
                top: -70,
                width: "100%",
                backgroundColor: "white",
                borderRadius: 5,
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setViewTransactionModal(true);
                  }}
                  style={{
                    borderWidth: 2,
                    width: 150,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 5,
                    borderRadius: 5,
                    borderColor: "#003082",
                  }}
                >
                  <Text style={{ borderColor: "#003082" }}>
                    View Transaction
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSingleData(null);
                    setSelectedTransaction(null);
                    setBookLocation(null);
                  }}
                  style={{
                    borderWidth: 2,
                    width: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 5,
                    borderRadius: 5,
                    borderColor: "#003082",
                    backgroundColor: "#003082",
                  }}
                >
                  <Text style={{ borderColor: "#003082", color: "white" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setWalletModal(true)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "33%",
            }}
          >
            <SimpleLineIcons name="wallet" size={21} color="black" />
            <Text style={{ fontSize: 10 }}>Wallet</Text>
          </TouchableOpacity>
          <View
            style={{
              width: "33%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setTransactionModal(true)}
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <FontAwesome name="motorcycle" size={30} color="#003082" />
                <Text
                  style={{
                    fontSize: 12,
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: 100,
                    width: 18,
                    height: 18,
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  {transactionCount}
                </Text>
              </View>
              <Text style={{ fontSize: 10 }}>Transactions</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setConversationModal(true)}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "33%",
            }}
          >
            <AntDesign name="message1" size={24} color="#003082" />
            <Text style={{ fontSize: 10 }}>Messages</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text
            style={{
              fontSize: 13,
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            You're offline, please turn the power button 🔴
          </Text>
        </>
      )}
    </View>
  );
};

export default RiderBottomNavigation;
