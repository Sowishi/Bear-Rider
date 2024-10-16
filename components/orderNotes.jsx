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

const OrderNotes = ({
  serviceType,
  setDeliveryNotes,
  deliveryNotes,
  setTransactionRemarksModal,
  handleAddTransaction,
  viewOnly,
  IS_RIDER,
  singleData,
  navigataion,
}) => {
  const [note, setNote] = useState("");
  const [openCamera, setOpenCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { proof, setProof } = useSmokeContext();
  const textInputRef = useRef();

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

      <ScrollView
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
          Order Details
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
            <Text style={{ fontSize: 15 }}>Store to Shop</Text>
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
                  {singleData.serviceType == "Padara" ? "Shop to Location" : ""}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ width: 20, height: 20, marginRight: 5 }}
                    source={blueMarker}
                  />
                  <Text>{singleData.destination.address}</Text>
                </View>
              </View>
            </View>
          </>
        )}

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

        {proof && (
          <>
            <Text style={{ fontSize: 15, marginTop: 10, marginBottom: 5 }}>
              Proof of Purchase / Receipt
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                style={{ width: 250, height: 250, borderRadius: 10 }}
                source={{ uri: proof }}
              />
            </View>
          </>
        )}

        <CameraButton
          removeEvent={setProof}
          event={() => setOpenCamera(true)}
          type={"proofOfPurchase"}
          navigation={navigataion}
        />
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
