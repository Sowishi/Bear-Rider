import { Text, TouchableOpacity, View } from "react-native";

const OrderNotesCard = ({ handleQuantityChange, item, handleDelete }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 8,
      }}
    >
      <Text style={{ flex: 1, fontStyle: "italic" }}>{item.note}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 10,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.id, "increment")}
            style={{
              backgroundColor: "#003082",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 5 }} disabled>
            <Text>{item.quantity}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={item.quantity == 1}
            onPress={() => handleQuantityChange(item.id, "decrement")}
            style={{
              backgroundColor: item.quantity == 1 ? "#00308299" : "#003082",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>-</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={{
            marginLeft: 10,
            backgroundColor: "red",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderNotesCard;
