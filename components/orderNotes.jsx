import {
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

const OrderNotes = ({
  serviceType,
  setDeliveryNotes,
  deliveryNotes,
  setTransactionRemarksModal,
}) => {
  const [note, setNote] = useState("");

  const textInputRef = useRef();

  const handleAddNotes = () => {
    setDeliveryNotes([
      ...deliveryNotes,
      { note, quantity: 1, id: Math.random() },
    ]);
    textInputRef.current.clear();
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
          {serviceType == "Pahatod" ? "Transportation Service" : "Order Notes"}
        </Text>
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
        {deliveryNotes.map((item) => {
          return (
            <OrderNotesCard
              key={item.id}
              item={item}
              handleQuantityChange={handleQuantityChange}
              handleDelete={handleDelete}
            />
          );
        })}
      </ScrollView>
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
          width={150}
          style={{ marginTop: 20 }}
          text="Find a rider"
          bgColor={"#B80B00"}
        />
      </View>
    </View>
  );
};

export default OrderNotes;
