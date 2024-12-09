import { View, Text } from "react-native";
import React, { useEffect } from "react";
import createCheckout from "../utils/paymongo";

const Paymongo = () => {
  useEffect(() => {
    createCheckout();
  }, []);

  return (
    <View>
      <Text>Paymongo</Text>
    </View>
  );
};

export default Paymongo;
