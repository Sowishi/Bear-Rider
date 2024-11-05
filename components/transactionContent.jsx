import { Image, ScrollView, Text, View } from "react-native";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import Button from "./button";
import EmptyList from "./emptyList";
import TransactionCard from "./transactionCard";
import PopupModal from "./popupModal";

const TransactionContent = ({
  transactions,
  setSelectedTransaction,
  setTransactionModal,
  setViewTransactionModal,
}) => {
  const filter = transactions.filter((transaction) => {
    if (!transaction.status) {
      return transactions;
    }
  });

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionModal(false);
    setViewTransactionModal(true);
  };

  return (
    <>
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          Available Transaction
        </Text>
      </View>

      {filter.length <= 0 && <EmptyList title={"No transaction yet"} />}
      {filter.length >= 1 && (
        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            minHeight: 200,
            marginTop: 30,
          }}
        >
          {filter?.map((transaction) => {
            return (
              <TransactionCard
                isTransactionPage
                key={transaction.id}
                handleViewTransaction={handleViewTransaction}
                transaction={transaction}
              />
            );
          })}
        </ScrollView>
      )}
    </>
  );
};

export default TransactionContent;
