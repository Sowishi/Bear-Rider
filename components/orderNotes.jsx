import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import OrderNotesCard from "./orderNotesCard";
import Input from "./input";
import { useRef, useState } from "react";
import Button from "./button";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import CameraButton from "./cameraButton";
import BottomModal from "./bottomModal";
import BearCamera from "./BearCamera";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSmokeContext } from "../utils/appContext";
import useCrudTransaction from "../hooks/useCrudTransaction";
import { handleUploadImage } from "../utils/handleUploadImage";
import QRCode from "react-native-qrcode-svg";
import logo from "../assets/bear.png";
import BearScanner from "./barcodeScanner";
const OrderNotes = ({
  serviceType,
  setDeliveryNotes,
  deliveryNotes,
  setTransactionRemarksModal,
  setTransactionDetailsModal,
  handleAddTransaction,
  viewOnly,
  IS_RIDER,
  singleData,
  navigataion,
  chargePerKilometer,
  baseFare,
  setPahatodModal,
  setSelectedTransaction,
}) => {
  const [note, setNote] = useState("");
  const [qrModal, setQrModal] = useState(false);
  const [scan, setScan] = useState(false);
  const [purchaseCost, setPurchaseCost] = useState(0);
  const [openCamera, setOpenCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { proof, setProof, currentUser } = useSmokeContext();
  const textInputRef = useRef();

  const { confirmOrderDetails, markNearby } = useCrudTransaction();

  const handleAddNotes = () => {
    if (note.length >= 1) {
      setDeliveryNotes([
        ...deliveryNotes,
        { note, quantity: 1, id: Math.random() },
      ]);
      textInputRef.current.clear();
      setNote("");
    }
  };

  const handleQuantityChange = (id, type) => {
    const copyDeliveryNotes = [...deliveryNotes];
    const output = copyDeliveryNotes.map((item) => {
      if (item.id == id) {
        if (type == "increment") {
          item.quantity = item.quantity + 1;
        } else {
          item.quantity = item.quantity - 1;
        }
      }
      return item;
    });

    setDeliveryNotes(output);
  };

  const handleDelete = (id) => {
    const copyDeliveryNotes = [...deliveryNotes];
    const output = copyDeliveryNotes.filter((item) => {
      if (item.id !== id) {
        return item;
      }
    });

    setDeliveryNotes(output);
  };

  const handleSubmit = async () => {
    if (singleData?.serviceType == "Padara") {
      const proofUrl = await handleUploadImage(proof);
      confirmOrderDetails(
        singleData.id,
        purchaseCost,
        proofUrl,
        totalPrice,
        deliveryFee
      );
    }
  };

  const handleMarkNearby = async () => {
    await markNearby(singleData.id);
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>We need your permission to show the camera</Text>
        <Button
          bgColor={"#003082"}
          event={requestPermission}
          text="grant permission"
        />
      </View>
    );
  }

  const deliveryFee = parseInt(
    singleData?.distance * chargePerKilometer + baseFare
  );
  const totalPrice = parseInt(deliveryFee) + parseInt(purchaseCost);

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        marginTop: 5,
      }}
    >
      {openCamera && (
        <BottomModal
          heightPx={700}
          modalVisible={openCamera}
          closeModal={() => setOpenCamera(false)}
        >
          <View style={{ width: 350, height: 600, backgroundColor: "red" }}>
            <BearCamera setOpenCamera={setOpenCamera} proofOfPurchase />
          </View>
        </BottomModal>
      )}
      {scan && (
        <BottomModal
          heightPx={700}
          modalVisible={scan}
          closeModal={() => setScan(false)}
        >
          <View style={{ width: 350, height: 600, backgroundColor: "white" }}>
            <BearScanner
              setSelectedTransaction={setSelectedTransaction}
              setPahatodModal={setPahatodModal}
              singleData={singleData}
              setTransactionDetailsModal={setTransactionDetailsModal}
              setTransactionRemarksModal={setTransactionRemarksModal}
              setScan={setScan}
              totalPrice={singleData?.totalPrice}
            />
          </View>
        </BottomModal>
      )}

      <BottomModal modalVisible={qrModal} closeModal={() => setQrModal(false)}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text style={{ fontSize: 20, marginBottom: 20 }}>
            Account Name:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {currentUser.firstName + " " + currentUser.lastName}
            </Text>
          </Text>
          <QRCode logo={logo} size={300} value={currentUser.id} />
        </View>
      </BottomModal>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{
          width: "100%",
        }}
      >
        <Text
          style={{
            fontSize: 25,
            color: "black",
            fontWeight: "bold",
            marginBottom: 15,
          }}
        >
          {singleData?.serviceType == "Padara"
            ? "Order Details"
            : "Transportation Details"}
        </Text>
        {/* Add Order Notes Button */}
        {!viewOnly && (
          <View
            style={{
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 3,
                paddingHorizontal: 10,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <TextInput
                ref={textInputRef}
                onChangeText={(text) => setNote(text)}
                placeholder="Enter your order here"
                style={{
                  flex: 1,
                  paddingVertical: 5,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={handleAddNotes}
              style={{
                marginLeft: 10,
                backgroundColor: "#003082",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        {singleData && (
          <>
            <Text style={{ fontSize: 15 }}>
              {" "}
              {singleData?.serviceType == "Padara"
                ? "Store to Shop"
                : "Drop off Locataion"}
            </Text>
            <View
              style={{
                padding: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                backgroundColor: "white",
                margin: 10,
                borderRadius: 10,
              }}
            >
              <View style={{ flexDirection: "column", marginTop: 10 }}>
                <Text
                  style={{ fontSize: 10, color: "#003082", marginBottom: 1 }}
                >
                  {singleData?.serviceType == "Padara"
                    ? "Shop to Location"
                    : "Drop off Locataion"}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ width: 20, height: 20, marginRight: 5 }}
                    source={blueMarker}
                  />
                  <Text>{singleData?.destination.address}</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {singleData?.serviceType == "Padara" && (
          <>
            <Text style={{ fontSize: 15 }}>Order/s</Text>
            <View
              style={{
                padding: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                backgroundColor: "white",
                margin: 10,
                borderRadius: 10,
              }}
            >
              {deliveryNotes.map((item) => {
                return (
                  <OrderNotesCard
                    viewOnly={viewOnly}
                    key={item.id}
                    item={item}
                    handleQuantityChange={handleQuantityChange}
                    handleDelete={handleDelete}
                  />
                );
              })}
            </View>
          </>
        )}

        {!viewOnly && (
          <>
            <Text style={{ fontSize: 15 }}>Order/s</Text>
            <View
              style={{
                padding: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                backgroundColor: "white",
                margin: 10,
                borderRadius: 10,
              }}
            >
              {deliveryNotes.map((item) => {
                return (
                  <OrderNotesCard
                    viewOnly={viewOnly}
                    key={item.id}
                    item={item}
                    handleQuantityChange={handleQuantityChange}
                    handleDelete={handleDelete}
                  />
                );
              })}
            </View>
          </>
        )}

        {singleData?.status !== undefined &&
          singleData?.serviceType == "Padara" && (
            <>
              <Text style={{ fontSize: 15, marginTop: 10, marginBottom: 5 }}>
                Proof of Purchase / Receipt
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              >
                <Image
                  style={{
                    width: "100%",
                    height: 250,
                    borderRadius: 10,
                  }}
                  source={{
                    uri:
                      singleData?.status == "Transit" ||
                      singleData?.status == "Nearby"
                        ? singleData?.proofOfPurchase
                        : proof,
                  }}
                />
              </View>
            </>
          )}

        {IS_RIDER && singleData?.serviceType == "Padara" && (
          <CameraButton
            removeEvent={setProof}
            event={() => setOpenCamera(true)}
            type={"proofOfPurchase"}
            navigation={navigataion}
          />
        )}
        {IS_RIDER &&
          singleData?.status !== "Nearby" &&
          singleData?.serviceType == "Padara" && (
            <>
              <Text style={{ fontSize: 15, marginTop: 20 }}>
                Total Item Cost
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 3,
                  paddingHorizontal: 10,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
              >
                <TextInput
                  onChangeText={(text) => setPurchaseCost(text)}
                  keyboardType="numeric"
                  placeholder="Total Item Cost"
                  style={{
                    flex: 1,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                  }}
                />
              </View>
            </>
          )}

        <>
          {/* Sub Total of the orders */}
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                color: "black",
                fontSize: 15,
              }}
            >
              Delivery Fee:
              <Text style={{ color: "#FFC30E", fontWeight: "bold" }}>
                {" "}
                ₱{deliveryFee ? deliveryFee : "----"}
              </Text>
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 15,
              }}
            >
              Purchase Cost:
              <Text style={{ color: "#FFC30E", fontWeight: "bold" }}>
                ₱
                {singleData?.status == "Transit" ||
                singleData?.status == "Nearby"
                  ? singleData?.purchaseCost
                  : purchaseCost}
              </Text>
            </Text>
            <Text style={{ marginVertical: 10 }}>
              Total{" "}
              <Text style={{ fontSize: 25 }}>
                ₱
                {singleData?.status == "Transit" ||
                singleData?.status == "Nearby"
                  ? singleData.totalPrice
                  : totalPrice
                  ? totalPrice
                  : "---"}{" "}
              </Text>
            </Text>
          </View>
        </>
        {/* Confirm Button */}

        {IS_RIDER && singleData?.serviceType == "Padara" && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {singleData.status !== "Nearby" && (
              <Button
                event={handleSubmit}
                isDisable={purchaseCost <= 0 || !proof}
                style={{ marginTop: 10 }}
                width={singleData?.status == "Transit" ? 130 : "90%"}
                text={singleData?.status == "Transit" ? "Update" : "Confirm"}
                bgColor={"#003082"}
              />
            )}

            {singleData?.status == "Transit" && (
              <Button
                event={() => markNearby(singleData.id)}
                style={{ marginTop: 10 }}
                width={singleData?.status == "Transit" ? 130 : "90%"}
                text={"Nearby"}
                bgColor={"#B80B00"}
              />
            )}
            {singleData?.status == "Nearby" && (
              <Button
                event={() => setQrModal(true)}
                style={{ marginTop: 10 }}
                width={singleData?.status == "Transit" ? 130 : "90%"}
                text={"Open QR Code"}
                bgColor={"#B80B00"}
              />
            )}
          </View>
        )}

        {IS_RIDER && singleData?.serviceType == "Pahatod" && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {singleData.status !== "Nearby" && (
              <Button
                event={handleSubmit}
                style={{ marginTop: 10 }}
                width={singleData?.status == "Transit" ? 130 : "90%"}
                text={"Confirm"}
                bgColor={"#003082"}
              />
            )}

            {singleData?.status == "Transit" && (
              <Button
                event={() => markNearby(singleData.id)}
                style={{ marginTop: 10 }}
                width={singleData?.status == "Transit" ? 130 : "90%"}
                text={"Nearby"}
                bgColor={"#B80B00"}
              />
            )}
            {singleData?.status == "Nearby" && (
              <Button
                event={() => setQrModal(true)}
                style={{ marginTop: 10 }}
                width={singleData?.status == "Transit" ? 130 : "90%"}
                text={"Open QR Code"}
                bgColor={"#B80B00"}
              />
            )}
          </View>
        )}

        {singleData?.status == "Nearby" && !IS_RIDER && (
          <Button
            event={() => setScan(true)}
            style={{ marginTop: 10 }}
            width={singleData?.status == "Transit" ? 130 : "90%"}
            text={"Pay"}
            bgColor={"#B80B00"}
          />
        )}
      </ScrollView>

      {/* Find a rider button */}
      {!viewOnly && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            event={() => setTransactionRemarksModal(false)}
            width={100}
            style={{ marginTop: 20 }}
            text="Cancel"
            bgColor={"#003082"}
          />
          <Button
            isDisable={deliveryNotes.length <= 0}
            event={handleAddTransaction}
            width={150}
            style={{ marginTop: 20 }}
            text="Find a rider"
            bgColor={"#B80B00"}
          />
        </View>
      )}
    </View>
  );
};

export default OrderNotes;
