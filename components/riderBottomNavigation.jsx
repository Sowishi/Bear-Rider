import { TouchableOpacity, View, Text } from "react-native";
import Button from "./button";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useSmokeContext } from "../utils/appContext";
import Toast from "react-native-toast-message";
import useCrudNotification from "../hooks/useCrudNotification";

const RiderBottomNavigation = ({
  isOnline,
  singleData,
  setTransactionModal,
  setSingleData,
  setSelectedTransaction,
  acceptTransaction,
  selectedTransaction,
  location,
}) => {
  const { currentUser, transactionCount } = useSmokeContext();
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
        paddingHorizontal: 20,
        paddingVertical: 20,
      }}
    >
      {isOnline ? (
        <>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "33%",
            }}
          >
            <FontAwesome name="bolt" size={30} color="#003082" />
            <Text style={{ fontSize: 10 }}>Auto Accept</Text>
          </View>
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
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "33%",
            }}
          >
            <FontAwesome name="user" size={30} color="#003082" />
            <Text style={{ fontSize: 10 }}>My Account</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 13, textAlign: "center" }}>
            You're offline, please turn the power button 🔴
          </Text>
        </>
      )}
    </View>
  );
};

export default RiderBottomNavigation;
