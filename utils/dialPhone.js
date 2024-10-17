import { Linking } from "react-native";

export const dialPhone = (number) => {
  let phoneUrl = `tel:${number}`;

  Linking.canOpenURL(phoneUrl)
    .then((supported) => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        Alert.alert("Error", "Phone number is not available");
      }
    })
    .catch((err) => console.error("Error opening phone number:", err));
};
