import { Image, ScrollView, Text, View } from "react-native";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import Button from "./button";
import { useSmokeContext } from "../utils/appContext";
import TransactionCard from "./transactionCard";
import EmptyList from "./emptyList";
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

  const riderData = transactions.filter((transaction) => {
    if (transaction?.rider?.id == currentUser.id && transaction.status) {
      return transaction;
    }
  });

  const customerData = transactions.filter((transaction) => {
    if (transaction.currentUser.id == currentUser.id) {
      return transaction;
    }
  });

  return (
    <>
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          Transaction History
        </Text>
      </View>

      {IS_RIDER && riderData.length <= 0 && <EmptyList title={"No History"} />}
      {IS_RIDER && riderData.length >= 1 && (
        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            minHeight: 200,
            marginTop: 30,
          }}
        >
          {riderData?.map((transaction) => {
            return (
              <TransactionCard
                key={transaction.id}
                handleViewRider={handleViewRider}
                transaction={transaction}
              />
            );
          })}
        </ScrollView>
      )}
      {!IS_RIDER && customerData.length <= 0 && (
        <EmptyList title={"No History"} />
      )}
      {!IS_RIDER && customerData.length >= 1 && (
        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            minHeight: 200,
            marginTop: 30,
          }}
        >
          {customerData?.map((transaction) => {
            return (
              <TransactionCard
                key={transaction.id}
                handleViewCustomer={handleViewCustomer}
                transaction={transaction}
              />
            );
          })}
        </ScrollView>
      )}
    </>
  );
};

export default HistoryContent;
