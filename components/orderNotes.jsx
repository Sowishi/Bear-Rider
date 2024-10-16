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
  navigation,
}) => {
  const [note, setNote] = useState("");

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

  const { proofOfPurchase } = useSmokeContext();

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        marginTop: 5,
      }}
    >
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
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: "#FFFEF7",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 15 }}>Store to Shop</Text>
          <View style={{ flexDirection: "column", marginTop: 10 }}>
            <Text style={{ fontSize: 10, color: "#003082", marginBottom: 1 }}>
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
        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: "#FFFEF7",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 15 }}>Order/s</Text>
          <View style={{ flexDirection: "column", marginTop: 10 }}>
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
        </View>
        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: "#FFFEF7",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 15 }}>Proof of Purchase / Receipt</Text>
          <View
            style={{
              flexDirection: "column",
              marginTop: 10,
              marginVertical: 10,
            }}
          >
            <CameraButton navigation={navigation} type={"proofOfPurchase"} />
          </View>
        </View>
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
