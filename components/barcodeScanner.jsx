import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import LottieView from "lottie-react-native";
import Scanner from "../assets/scanner.json";
import { useSmokeContext } from "../utils/appContext";
import useCrudWallet from "../hooks/useCrudWallet";
import Toast from "react-native-toast-message";
import useCrudTransaction from "../hooks/useCrudTransaction";
import Loader from "./loader";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import BottomModal from "../components/bottomModal";
import TransactionSummary from "./transactionSummary";

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
  const [confirmModal, setConfirmModal] = useState(false);
  const [user, setUser] = useState();
  const { handleMakePayment } = useCrudWallet();
  const {
    currentUser,
    setBookLocation,
    setViewRiderState,
    setShowSelectedLocation,
    setSumModal,
    setSumInfo,
  } = useSmokeContext();
  const { completeTransaction } = useCrudTransaction();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async (data) => {
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
      setBookLocation(null);
      setViewRiderState(false);
      setShowSelectedLocation(false);
      setSumModal(true);
      setSumInfo({
        totalPrice,
        user,
      });

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
      setBookLocation(null);
      setViewRiderState(false);
      setShowSelectedLocation(false);

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

  const handleConfirmation = async ({ data }) => {
    if (scanned) return; // Prevent multiple scans

    setScanned(true);
    setLoading(true);

    try {
      // Get the document reference from the Firestore collection
      const userRef = doc(db, "users", data); // 'users' is the collection, and data is the user ID

      // Fetch the document snapshot
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        // Data exists for the user, you can access it here
        const userData = userSnapshot.data();
        console.log("User data:", userData);
        setUser(userData);
        setConfirmModal(true);
        // You can now use this data in your app as needed
      } else {
        console.log("No user data found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Stop loading after the operation
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
        onBarCodeScanned={scanned ? undefined : handleConfirmation}
        style={StyleSheet.absoluteFillObject}
      />
      <BottomModal
        modalVisible={confirmModal}
        closeModal={() => setConfirmModal(false)}
      >
        {user && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "start",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                width={150}
                height={150}
                source={{ uri: user.selfieUrl }}
                style={styles.userImage}
              />
              <Text style={styles.userName}>
                {user.firstName + " " + user.lastName}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userText}>
                Email: <Text style={styles.infoText}>{user.email}</Text>
              </Text>
              <Text style={styles.userText}>
                Phone: <Text style={styles.infoText}>{user.phoneNumber}</Text>
              </Text>
              <Text style={styles.userText}>
                Rider Status:{" "}
                <Text style={styles.infoText}>{user.riderStatus}</Text>
              </Text>
            </View>

            <Text style={styles.totalPrice}>
              Total Price: <Text style={styles.priceText}>{totalPrice}</Text>
            </Text>

            {/* Pay Now Button */}
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => handleBarCodeScanned(user.id)}
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setConfirmModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomModal>

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
  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  userImage: {
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  userInfo: {
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
  userText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  infoText: {
    fontWeight: "500",
    color: "#333",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1d72b8",
    marginTop: 10,
  },
  priceText: {
    color: "#e94e77",
    fontSize: 18,
  },
  payButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: "#f44336", // Red color for cancel button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
