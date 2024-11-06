import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import LottieView from "lottie-react-native";
import Scanner from "../assets/scanner.json";
import { useSmokeContext } from "../utils/appContext";
import useCrudWallet from "../hooks/useCrudWallet";
import Toast from "react-native-toast-message";
import useCrudTransaction from "../hooks/useCrudTransaction";
import Loader from "./loader";

export default function BearScanner({
  totalPrice,
  setScan,
  setTransactionRemarksModal,
  singleData,
  setPahatodModal,
  setTransactionDetailsModal,
  setSelectedTransaction,
}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleMakePayment } = useCrudWallet();
  const { currentUser, setBookLocation } = useSmokeContext();
  const { completeTransaction } = useCrudTransaction();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return; // Prevent multiple scans

    setScanned(true);
    setLoading(true);

    try {
      // Attempt to make payment
      const paymentResult = await handleMakePayment(
        data,
        totalPrice,
        currentUser?.id,
        singleData?.serviceType
      );

      // Validate if payment succeeded before completing transaction
      if (!paymentResult?.success) {
        throw new Error(
          paymentResult?.message || "Payment could not be completed."
        );
      }

      // Proceed with completing the transaction if payment is successful
      await completeTransaction(singleData);

      // Close the modals and reset state
      setScan(false);
      setTransactionRemarksModal(false);
      setPahatodModal(false);
      setTransactionDetailsModal(false);
      setSelectedTransaction(null);
      // setBookLocation(null);

      Toast.show({
        type: "success",
        text1: "Payment Processed Successfully!",
        text2: "Thank you for choosing Bear Rider Express! 😊",
      });
    } catch (error) {
      setScan(false);
      setTransactionRemarksModal(false);
      setPahatodModal(false);
      setTransactionDetailsModal(false);
      setSelectedTransaction(null);
      // setBookLocation(null);

      // Handle errors such as insufficient balance
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2:
          error.message || "An error occurred while processing your payment.",
      });
      setScanned(false); // Allow rescan if there was an error
    } finally {
      setLoading(false);
    }
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
      {loading && <Loader />}
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
        />
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
