import { View, Text } from "react-native";
import React, { useEffect } from "react";
import createCheckout from "../utils/paymongo";

const Paymongo = ({ route }) => {
  const { transaction } = route.params || {};
  console.log(transaction);
  return (
    <View>
      <Text>Paymongo</Text>
    </View>
  );
};

export default Paymongo;
