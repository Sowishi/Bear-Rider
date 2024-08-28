import { Image, ScrollView, Text, View } from "react-native";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import Button from "./button";
import { useSmokeContext } from "../utils/appContext";
import TransactionCard from "./transactionCard";
const HistoryContent = ({
  transactions,
  setSelectedTransaction,
  setTransactionModal,
  IS_RIDER,
  setHistoryModal,
  setPahatodModal,
  setFindingRider,
  setSelectedLocation,
}) => {
  const { currentUser } = useSmokeContext();

  const handleViewRider = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionModal(false);
    setHistoryModal(false);
  };

  const handleViewCustomer = (transaction) => {
    setSelectedTransaction(transaction);
    setPahatodModal(true);
    setFindingRider(true);
    setSelectedLocation(transaction.destination);
    setTransactionModal(false);
    setHistoryModal(false);
  };
  return (
    <>
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          Transaction History
        </Text>
      </View>
      {IS_RIDER && (
        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            minHeight: 200,
            marginTop: 30,
          }}
        >
          {transactions?.map((transaction) => {
            if (
              transaction?.rider?.id == currentUser.id &&
              transaction.status == "Accepted"
            ) {
              return (
                <TransactionCard
                  handleViewRider={handleViewRider}
                  transaction={transaction}
                />
              );
            }
          })}
        </ScrollView>
      )}

      {!IS_RIDER && (
        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            minHeight: 200,
            marginTop: 30,
          }}
        >
          {transactions?.map((transaction) => {
            if (transaction.currentUser.id == currentUser.id) {
              return (
                <TransactionCard
                  handleViewCustomer={handleViewCustomer}
                  transaction={transaction}
                />
              );
            }
          })}
        </ScrollView>
      )}
    </>
  );
};

export default HistoryContent;
