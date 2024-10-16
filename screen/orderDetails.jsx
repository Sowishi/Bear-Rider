import { Image, ScrollView, Text, View } from "react-native";
import CameraButton from "../components/cameraButton";
import blueMarker from "../assets/blue-marker.png";
import { useSmokeContext } from "../utils/appContext";
import useCrudTransaction from "../hooks/useCrudTransaction";

const OrderDetails = ({ route, navigation }) => {
  const { proofOfPurchase } = useSmokeContext();

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        marginTop: 5,
      }}
    >
      {false && (
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
              {/* {deliveryNotes.map((item) => {
              return (
                <OrderNotesCard
                  viewOnly={viewOnly}
                  key={item.id}
                  item={item}
                  handleQuantityChange={handleQuantityChange}
                  handleDelete={handleDelete}
                />
              );
            })} */}
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
            {proofOfPurchase && (
              <Image
                style={{ width: 300, height: 300 }}
                source={{ uri: proofOfPurchase }}
              />
            )}

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
      )}
    </View>
  );
};

export default OrderDetails;
