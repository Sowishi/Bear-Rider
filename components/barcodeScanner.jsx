import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import LottieView from "lottie-react-native";
import Scanner from "../assets/scanner.json";
import { useSmokeContext } from "../utils/appContext";
import useCrudWallet from "../hooks/useCrudWallet";
import Toast from "react-native-toast-message";

export default function BearScanner({ totalPrice, setScan }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const { handleMakePayment, data } = useCrudWallet();
  const { currentUser } = useSmokeContext();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    await handleMakePayment(data, totalPrice, currentUser?.id);
    Toast.show({ type: "success", text1: "Payment Processed Succesfully!" });
    setScan(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        style={{
          position: "absolute",
          width: "100%",
          top: 70,
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20, color: "#fefefe99", textAlign: "center" }}>
          Scan your rider QR code to pay
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          width: "100%",
          top: "30%",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LottieView
          autoPlay
          style={{ width: 300, height: 300 }}
          source={Scanner}
        ></LottieView>
      </View>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
  },
});
